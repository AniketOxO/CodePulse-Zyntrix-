import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import { connectDatabase } from './database.js';
import User from './models/User.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const id = crypto.randomBytes(12).toString('hex');
      cb(null, `${id}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = new Set(['.png', '.jpg', '.jpeg', '.webp']);
    if (!allowed.has(ext)) {
      return cb(new Error('Only image uploads are allowed'));
    }
    return cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ============================================
// AUTH HELPERS
// ============================================

function createToken(user) {
  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET in environment');
  }
  return jwt.sign({ sub: user._id.toString() }, jwtSecret, { expiresIn: '7d' });
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    profilePicUrl: user.profilePicUrl || null,
    provider: user.provider,
  };
}

function requireAuth(req, res, next) {
  if (!jwtSecret) {
    return res.status(500).json({ error: 'Missing JWT_SECRET in environment' });
  }
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/auth/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const profilePicUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      profilePicUrl,
      provider: 'local',
      lastLoginAt: new Date(),
    });

    const token = createToken(user);
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);
    return res.json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log in' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID in environment' });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const normalizedEmail = payload.email.toLowerCase();
    let user = await User.findOne({
      $or: [{ googleSub: payload.sub }, { email: normalizedEmail }],
    });

    if (!user) {
      user = await User.create({
        name: payload.name || 'Google User',
        email: normalizedEmail,
        provider: 'google',
        googleSub: payload.sub,
        profilePicUrl: payload.picture || null,
        lastLoginAt: new Date(),
      });
    } else {
      let updated = false;
      if (!user.googleSub) {
        user.googleSub = payload.sub;
        updated = true;
      }
      if (!user.profilePicUrl && payload.picture) {
        user.profilePicUrl = payload.picture;
        updated = true;
      }
      if (user.provider !== 'google') {
        user.provider = 'google';
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);
    return res.json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

app.put('/api/auth/profile-pic', requireAuth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Profile image is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousPic = user.profilePicUrl;
    user.profilePicUrl = `/uploads/${req.file.filename}`;
    await user.save();

    if (previousPic && previousPic.startsWith('/uploads/')) {
      const previousPath = path.join(uploadsDir, path.basename(previousPic));
      fs.promises.unlink(previousPath).catch(() => {});
    }

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile image' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(serializeUser(user));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.get('/api/github-oauth', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing GitHub OAuth code' });
    }

    if (typeof fetch !== 'function') {
      return res.status(500).json({ error: 'Server fetch is unavailable. Use Node 18+.' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Missing GitHub OAuth environment variables' });
    }

    const redirectUri = process.env.APP_URL || req.headers.origin || '';
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: String(code),
    });
    if (redirectUri) {
      body.set('redirect_uri', redirectUri);
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      const message = data.error_description || data.error || 'GitHub OAuth failed';
      return res.status(400).json({ error: message });
    }

    return res.json({
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to exchange GitHub OAuth code' });
  }
});

// ============================================
// IN-MEMORY DATA STORES (Replace with DB in production)
// ============================================

let chatSessions = [];
let chatIdCounter = 1;

let snippets = [];
let snippetIdCounter = 1;

let promptTemplates = [];
let templateIdCounter = 1;

let userSettings = {
  theme: 'dark',
  language: 'en',
  notifications: true,
  autoSync: true,
  syncInterval: 5,
  defaultBranch: 'main',
};

let analytics = {
  totalRequests: 0,
  totalSyncs: 0,
  lastSyncTime: null,
  requestHistory: [],
};

app.use('/api/chats', requireAuth);
app.use('/api/snippets', requireAuth);
app.use('/api/templates', requireAuth);
app.use('/api/settings', requireAuth);
app.use('/api/analytics', requireAuth);

// ============================================
// CHAT SESSIONS CRUD
// ============================================

// CREATE - Save a new chat session
app.post('/api/chats', (req, res) => {
  const { title, messages } = req.body;
  const newChat = {
    id: chatIdCounter++,
    title: title || 'New Chat',
    messages: messages || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  chatSessions.push(newChat);
  res.status(201).json(newChat);
});

// READ - Get all chat sessions
app.get('/api/chats', (req, res) => {
  res.json(chatSessions);
});

// READ - Get single chat session by ID
app.get('/api/chats/:id', (req, res) => {
  const chat = chatSessions.find((c) => c.id === parseInt(req.params.id));
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  res.json(chat);
});

// UPDATE - Update a chat session
app.put('/api/chats/:id', (req, res) => {
  const chatIndex = chatSessions.findIndex((c) => c.id === parseInt(req.params.id));
  if (chatIndex === -1) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  const { title, messages } = req.body;
  chatSessions[chatIndex] = {
    ...chatSessions[chatIndex],
    title: title ?? chatSessions[chatIndex].title,
    messages: messages ?? chatSessions[chatIndex].messages,
    updatedAt: new Date().toISOString(),
  };
  res.json(chatSessions[chatIndex]);
});

// DELETE - Delete a chat session
app.delete('/api/chats/:id', (req, res) => {
  const chatIndex = chatSessions.findIndex((c) => c.id === parseInt(req.params.id));
  if (chatIndex === -1) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  chatSessions.splice(chatIndex, 1);
  res.status(204).send();
});

// ============================================
// CODE SNIPPETS CRUD
// ============================================

// CREATE - Save a code snippet
app.post('/api/snippets', (req, res) => {
  const { title, code, language, tags, description } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }
  const newSnippet = {
    id: snippetIdCounter++,
    title: title || 'Untitled Snippet',
    code,
    language: language || 'plaintext',
    tags: tags || [],
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  snippets.push(newSnippet);
  res.status(201).json(newSnippet);
});

// READ - Get all snippets (with optional filtering)
app.get('/api/snippets', (req, res) => {
  const { language, tag, search } = req.query;
  let filtered = [...snippets];

  if (language) {
    filtered = filtered.filter((s) => s.language === language);
  }
  if (tag) {
    filtered = filtered.filter((s) => s.tags.includes(tag));
  }
  if (search) {
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );
  }
  res.json(filtered);
});

// READ - Get single snippet
app.get('/api/snippets/:id', (req, res) => {
  const snippet = snippets.find((s) => s.id === parseInt(req.params.id));
  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  res.json(snippet);
});

// UPDATE - Update a snippet
app.put('/api/snippets/:id', (req, res) => {
  const index = snippets.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  const { title, code, language, tags, description } = req.body;
  snippets[index] = {
    ...snippets[index],
    title: title ?? snippets[index].title,
    code: code ?? snippets[index].code,
    language: language ?? snippets[index].language,
    tags: tags ?? snippets[index].tags,
    description: description ?? snippets[index].description,
    updatedAt: new Date().toISOString(),
  };
  res.json(snippets[index]);
});

// DELETE - Delete a snippet
app.delete('/api/snippets/:id', (req, res) => {
  const index = snippets.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  snippets.splice(index, 1);
  res.status(204).send();
});

// ============================================
// PROMPT TEMPLATES CRUD
// ============================================

// CREATE - Create a prompt template
app.post('/api/templates', (req, res) => {
  const { name, prompt, category, variables } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  const newTemplate = {
    id: templateIdCounter++,
    name: name || 'Untitled Template',
    prompt,
    category: category || 'general',
    variables: variables || [],
    createdAt: new Date().toISOString(),
  };
  promptTemplates.push(newTemplate);
  res.status(201).json(newTemplate);
});

// READ - Get all templates
app.get('/api/templates', (req, res) => {
  const { category } = req.query;
  if (category) {
    return res.json(promptTemplates.filter((t) => t.category === category));
  }
  res.json(promptTemplates);
});

// READ - Get single template
app.get('/api/templates/:id', (req, res) => {
  const template = promptTemplates.find((t) => t.id === parseInt(req.params.id));
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// UPDATE - Update template
app.put('/api/templates/:id', (req, res) => {
  const index = promptTemplates.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  const { name, prompt, category, variables } = req.body;
  promptTemplates[index] = {
    ...promptTemplates[index],
    name: name ?? promptTemplates[index].name,
    prompt: prompt ?? promptTemplates[index].prompt,
    category: category ?? promptTemplates[index].category,
    variables: variables ?? promptTemplates[index].variables,
  };
  res.json(promptTemplates[index]);
});

// DELETE - Delete template
app.delete('/api/templates/:id', (req, res) => {
  const index = promptTemplates.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  promptTemplates.splice(index, 1);
  res.status(204).send();
});

// ============================================
// USER SETTINGS CRUD
// ============================================

// READ - Get user settings
app.get('/api/settings', (req, res) => {
  res.json(userSettings);
});

// UPDATE - Update user settings
app.put('/api/settings', (req, res) => {
  const { theme, language, notifications, autoSync, syncInterval, defaultBranch } = req.body;
  userSettings = {
    theme: theme ?? userSettings.theme,
    language: language ?? userSettings.language,
    notifications: notifications ?? userSettings.notifications,
    autoSync: autoSync ?? userSettings.autoSync,
    syncInterval: syncInterval ?? userSettings.syncInterval,
    defaultBranch: defaultBranch ?? userSettings.defaultBranch,
  };
  res.json(userSettings);
});

// RESET - Reset settings to default
app.post('/api/settings/reset', (req, res) => {
  userSettings = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoSync: true,
    syncInterval: 5,
    defaultBranch: 'main',
  };
  res.json(userSettings);
});

// ============================================
// ANALYTICS CRUD
// ============================================

// READ - Get analytics
app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

// READ - Get usage summary
app.get('/api/analytics/summary', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRequests = analytics.requestHistory.filter(
    (r) => new Date(r.timestamp) >= today
  );

  res.json({
    totalRequests: analytics.totalRequests,
    totalSyncs: analytics.totalSyncs,
    lastSyncTime: analytics.lastSyncTime,
    todayRequests: todayRequests.length,
  });
});

// UPDATE - Record a sync
app.post('/api/analytics/sync', (req, res) => {
  analytics.totalSyncs++;
  analytics.lastSyncTime = new Date().toISOString();
  analytics.requestHistory.push({
    type: 'sync',
    timestamp: new Date().toISOString(),
  });
  // Keep only last 100 records
  if (analytics.requestHistory.length > 100) {
    analytics.requestHistory.shift();
  }
  res.json(analytics);
});

// DELETE - Reset analytics
app.delete('/api/analytics', (req, res) => {
  analytics = {
    totalRequests: 0,
    totalSyncs: 0,
    lastSyncTime: null,
    requestHistory: [],
  };
  res.status(204).send();
});

// ============================================
// GITHUB OAUTH
// ============================================

app.get('/api/github-oauth', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing GitHub credentials' });
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code' });
  }
});

const port = process.env.PORT || 4001;
connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });