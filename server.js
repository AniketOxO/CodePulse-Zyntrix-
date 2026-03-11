import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

app.listen(4001, () => {
  console.log('Backend server running on port 4001');
});