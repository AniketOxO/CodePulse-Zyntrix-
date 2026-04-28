import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Code,
  FolderGit2,
  Github,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  MessageSquare,
  FileText,
} from "lucide-react";
import SettingsPage from "./components/SettingsPage";
import SnippetsPage from "./components/SnippetsPage";
import AnalyticsPageComponent from "./components/AnalyticsPage";
import ChatsPage from "./components/ChatsPage";
import TemplatesPage from "./components/TemplatesPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { authApi } from "./services/api";
// at top of file
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

function goToGithub() {
  if (!CLIENT_ID) {
    console.error("Missing VITE_GITHUB_CLIENT_ID for GitHub OAuth");
    return;
  }
  const redirect = encodeURIComponent(window.location.origin);
  window.location.href =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&scope=repo,user` +
    `&redirect_uri=${redirect}`;
}

const heroSignals = [
  { label: "Teams onboarded", value: "2,180+" },
  { label: "Insights generated monthly", value: "4.1M" },
  { label: "Average release confidence lift", value: "+39%" },
];

const homeFeatures = [
  {
    title: "Signal Clarity Engine",
    text: "Turn noisy commit streams into board-ready engineering intelligence in real time.",
    icon: "signal",
  },
  {
    title: "Secure Data Vault",
    text: "Enterprise-grade repository access controls with encrypted sync and audit-ready logs.",
    icon: "vault",
  },
  {
    title: "Delivery Flow Mapping",
    text: "Visualize bottlenecks from PR open to merge and optimize cycle-time before sprint close.",
    icon: "pipeline",
  },
  {
    title: "Predictive Release AI",
    text: "Forecast timeline risk and confidence levels from real team velocity and review behavior.",
    icon: "forecast",
  },
  {
    title: "Automated Governance",
    text: "Trigger quality alerts and policy checks automatically when engineering patterns drift.",
    icon: "automation",
  },
  {
    title: "Team Benchmark Matrix",
    text: "Compare squads fairly with normalized metrics across quality, throughput, and consistency.",
    icon: "team",
  },
];

const workflowSteps = [
  {
    title: "Connect your stack",
    text: "Securely connect GitHub repositories and teams with scoped, role-based access.",
  },
  {
    title: "Set success metrics",
    text: "Define objectives for cycle-time, review speed, reliability, and delivery confidence.",
  },
  {
    title: "Operate with precision",
    text: "Use live recommendations to remove bottlenecks and improve every sprint outcome.",
  },
];

const impactStats = [
  { label: "Release confidence", value: "94%" },
  { label: "PR turnaround", value: "-31%" },
  { label: "Delivery throughput", value: "+46%" },
  { label: "Planning accuracy", value: "9.4 / 10" },
];

const partnerLogos = [
  { name: "Google", icon: "google" },
  { name: "Microsoft", icon: "microsoft" },
  { name: "Amazon", icon: "amazon" },
  { name: "Meta", icon: "meta" },
  { name: "Netflix", icon: "netflix" },
  { name: "Stripe", icon: "stripe" },
  { name: "Shopify", icon: "shopify" },
  { name: "Atlassian", icon: "atlassian" },
  { name: "Cloudflare", icon: "cloudflare" },
  { name: "Notion", icon: "notion" },
  { name: "Slack", icon: "slack" },
  { name: "Spotify", icon: "spotify" },
];

const platformPillars = [
  {
    title: "Leadership Command View",
    text: "Unified visibility across delivery health, release confidence, and execution risk across all engineering teams.",
    points: ["Portfolio-level reporting", "Executive-ready weekly summaries", "Real-time delivery alerts"],
  },
  {
    title: "Team Operations Layer",
    text: "Operational dashboards for EMs and tech leads to optimize review flow, cycle-time, and sprint throughput.",
    points: ["Team-by-team benchmarks", "Workflow bottleneck detection", "Quality trend monitoring"],
  },
  {
    title: "Developer Experience Insights",
    text: "Connect daily activity to measurable outcomes so teams improve consistency without adding reporting overhead.",
    points: ["Commit and PR intelligence", "Streak and momentum tracking", "Contextual recommendation engine"],
  },
];

const useCases = [
  {
    title: "For Engineering Leaders",
    text: "Forecast roadmap confidence with real delivery signals and allocate resources before risk compounds.",
  },
  {
    title: "For Managers and Leads",
    text: "Identify review bottlenecks, rebalance workload, and improve sprint execution with actionable team metrics.",
  },
  {
    title: "For Platform and DevOps",
    text: "Track governance adherence, monitor quality drift, and standardize engineering excellence across repositories.",
  },
];

const trustSignals = [
  { label: "SOC 2 Type II ready", value: "Security controls aligned" },
  { label: "SAML / SSO", value: "Enterprise identity compatible" },
  { label: "Audit-grade logs", value: "Every sync and action recorded" },
  { label: "Data encryption", value: "At rest and in transit" },
];

const faqItems = [
  {
    q: "How quickly can we launch CodePulse in production?",
    a: "Most teams connect repositories, define metrics, and launch a first executive dashboard within one business day.",
  },
  {
    q: "Does CodePulse replace existing engineering tools?",
    a: "No. CodePulse sits on top of your existing stack and unifies operational insight for leadership and delivery teams.",
  },
  {
    q: "Can large organizations segment data by team or business unit?",
    a: "Yes. Multi-team workspace segmentation and role-based access allow enterprise organizations to scale safely.",
  },
];

const dashboardSignals = [
  { label: "Engineering health", value: "93 / 100", delta: "+6.8%", tone: "up" },
  { label: "Cycle-time score", value: "8.7 / 10", delta: "+1.2 pts", tone: "up" },
  { label: "Code quality index", value: "91%", delta: "Stable", tone: "steady" },
  { label: "Risk alerts", value: "03", delta: "Needs review", tone: "watch" },
];

const statsCards = [
  { label: "Total commits", value: "1,845" },
  { label: "Active days", value: "24" },
  { label: "Current streak", value: "11 days" },
  { label: "Sprint velocity", value: "82 pts" },
];

const quickActions = [
  {
    id: "chat",
    label: "Start a focus chat",
    description: "Capture decisions and unblock quickly.",
    path: "/chats",
    icon: MessageSquare,
  },
  {
    id: "snippet",
    label: "Save a snippet",
    description: "Store patterns you re-use weekly.",
    path: "/snippets",
    icon: Code,
  },
  {
    id: "template",
    label: "Draft a template",
    description: "Standardize recurring prompts.",
    path: "/templates",
    icon: FileText,
  },
  {
    id: "analytics",
    label: "Review analytics",
    description: "Spot delivery shifts in minutes.",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
];

type GoalItem = {
  id: string;
  title: string;
  progress: number;
};

type CalendarConnections = {
  google: boolean;
  outlook: boolean;
};

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "plan", label: "Plan top 3 outcomes for today", done: false },
  { id: "focus", label: "Run two 25-min focus sprints", done: false },
  { id: "review", label: "Review open pull requests", done: false },
];

const DEFAULT_GOALS: GoalItem[] = [
  { id: "release", title: "Ship weekly release", progress: 64 },
  { id: "review", title: "Review cycle time under 6h", progress: 52 },
  { id: "quality", title: "Reduce reopen rate", progress: 41 },
];

const DEFAULT_CALENDAR: CalendarConnections = {
  google: false,
  outlook: false,
};

const CHECKLIST_KEY = "codepulse_checklist";
const GOALS_KEY = "codepulse_goals";
const NOTES_KEY = "codepulse_notes";
const CALENDAR_KEY = "codepulse_calendar";
const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const upcomingEvents = [
  { id: "standup", time: "10:00", title: "Daily standup", tag: "Team" },
  { id: "planning", time: "13:00", title: "Sprint planning", tag: "Planning" },
  { id: "review", time: "16:30", title: "PR review block", tag: "Quality" },
];

const weeklyCommits = [
  { week: "W1", commits: 52 },
  { week: "W2", commits: 68 },
  { week: "W3", commits: 44 },
  { week: "W4", commits: 75 },
  { week: "W5", commits: 81 },
  { week: "W6", commits: 58 },
  { week: "W7", commits: 72 },
  { week: "W8", commits: 87 },
];

const codingHours = [3.2, 4.8, 5.4, 4.1, 6.2, 5.7, 4.9];

const languageUsage = [
  { name: "TypeScript", value: 42 },
  { name: "JavaScript", value: 28 },
  { name: "Python", value: 18 },
  { name: "CSS", value: 12 },
];

const repositories = [
  { name: "SmartDev", commits: 120, language: "JavaScript" },
  { name: "ChatApp", commits: 89, language: "Node.js" },
  { name: "Portfolio", commits: 45, language: "React" },
  { name: "API-Toolkit", commits: 61, language: "TypeScript" },
  { name: "DevOps-Flow", commits: 33, language: "Shell" },
];

const teamHealth = [
  { name: "Platform", score: "96", trend: "Strong" },
  { name: "Frontend", score: "91", trend: "Improving" },
  { name: "Data", score: "88", trend: "Stable" },
  { name: "Infra", score: "86", trend: "Needs focus" },
];

const activityFeed = [
  "Platform merged a critical release PR in 1.6h review time.",
  "Frontend reduced reopen rate by 22% this sprint.",
  "Infra cycle-time alert triggered for two repositories.",
  "Data team hit a 14-day consistency streak.",
];

const contributionMatrix = [
  [0, 2, 3, 1, 2, 3, 0],
  [1, 2, 0, 0, 3, 2, 1],
  [0, 3, 2, 1, 2, 3, 0],
  [2, 2, 1, 0, 3, 1, 0],
  [1, 3, 2, 2, 3, 2, 1],
  [0, 2, 1, 0, 2, 3, 2],
  [1, 2, 3, 1, 2, 2, 0],
  [0, 1, 2, 3, 2, 1, 0],
];

const sidebarItems = [
  { id: "home", label: "Home", path: "/", icon: Home },
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { id: "repositories", label: "Repositories", path: "/repositories", icon: FolderGit2 },
  { id: "chats", label: "Chats", path: "/chats", icon: MessageSquare },
  { id: "templates", label: "Templates", path: "/templates", icon: FileText },
  { id: "snippets", label: "Snippets", path: "/snippets", icon: Code },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings },
];

function HomeFeatureIcon({ icon }: { icon: string }) {
  if (icon === "signal") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 17.5h16" />
        <path d="M6.5 14l3.2-3.2 2.8 2.8 5-5" />
        <path d="M16.7 5.6H20v3.3" />
      </svg>
    );
  }

  if (icon === "vault") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="4.2" y="5" width="15.6" height="14" rx="2.5" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M12 9.3v5.4" />
      </svg>
    );
  }

  if (icon === "pipeline") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3.8" y="4.5" width="5.4" height="5.4" rx="1.1" />
        <rect x="14.8" y="4.5" width="5.4" height="5.4" rx="1.1" />
        <rect x="9.3" y="14.2" width="5.4" height="5.4" rx="1.1" />
        <path d="M9.2 7.2h5.6" />
        <path d="M12 10v4.2" />
      </svg>
    );
  }

  if (icon === "forecast") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4.2 18.2h15.6" />
        <path d="M6.1 16.1c1.3-4.3 3.8-6.4 7.3-6.4 2.1 0 3.7.7 4.9 2.3" />
        <path d="M15.8 8.1H20v4.2" />
      </svg>
    );
  }

  if (icon === "automation") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M11.9 3.8v3.1" />
        <path d="M11.9 17.1v3.1" />
        <path d="M3.8 12h3.1" />
        <path d="M17.1 12h3.1" />
        <circle cx="12" cy="12" r="4.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <circle cx="12" cy="16" r="2.5" />
      <path d="M10.3 9.8 11.1 13" />
      <path d="M13.7 9.8 12.9 13" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M5.2 7.6a6.4 6.4 0 0 1 6.4-6.4h4.8v4.1h-4.8a2.3 2.3 0 1 0 0 4.6h3.6v4.2h-3.6a6.4 6.4 0 0 1-6.4-6.5z" />
      <path d="M18.8 16.4a6.4 6.4 0 0 1-6.4 6.4H7.6v-4.1h4.8a2.3 2.3 0 0 0 0-4.6H8.8V9.9h3.6a6.4 6.4 0 0 1 6.4 6.5z" />
    </svg>
  );
}

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onConnect = () => navigate("/dashboard");
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CP";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home-page">
      <span className="ambient-shape ambient-a" aria-hidden />
      <span className="ambient-shape ambient-b" aria-hidden />

      <header className="landing-navbar" id="home">
        <a className="logo-wrap" href="#home">
          <div className="logo-badge">
            <BrandMark />
          </div>
          <span>CodePulse</span>
        </a>

        <nav className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#security">Security</a>
          <a href="#faq">Resources</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <button
                type="button"
                className="avatar nav-avatar"
                onClick={() => navigate("/dashboard")}
                aria-label="Go to dashboard"
              >
                {user.profilePicUrl ? (
                  <img src={user.profilePicUrl} alt={user.name} />
                ) : (
                  <span>{initials}</span>
                )}
              </button>
              <div className="nav-user-meta">
                <p>{user.name}</p>
                <span>{user.email}</span>
              </div>
              <button className="btn btn-ghost" onClick={onConnect}>
                Dashboard
              </button>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary btn-elevated" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Enterprise Engineering Intelligence Platform</p>
            <h1>Give leadership and individual one trusted system for delivery clarity.</h1>
            <p>
              CodePulse brings commits, pull requests, review behavior, and governance
              into a unified intelligence layer so organizations ship with higher
              confidence and fewer execution surprises.
            </p>
            <ul className="hero-value-list">
              <li>Built for engineering organizations from startup to enterprise scale</li>
              <li>Actionable analytics for executives, managers, and delivery teams</li>
              <li>Fast setup with secure GitHub integration and role-based controls</li>
            </ul>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-elevated"
                onClick={() => navigate("/signup")}
              >
                Create free account
              </button>
              <button className="btn btn-ghost" onClick={goToGithub}>
                <Github size={16} />
                Connect GitHub
              </button>
            </div>
             

            <div className="hero-signal-grid">
              {heroSignals.map((signal) => (
                <article key={signal.label}>
                  <p>{signal.label}</p>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className="hero-console" id="preview">
            <div className="console-header">
              <span>Executive Snapshot</span>
              <span className="status-dot">Synced</span>
            </div>

            <div className="console-grid">
              <article className="console-card">
                <p>Release confidence</p>
                <strong>92%</strong>
                <small>Up 13% this sprint</small>
              </article>
              <article className="console-card">
                <p>Review cycle time</p>
                <strong>3.4h</strong>
                <small>Faster than target</small>
              </article>
              <article className="console-card wide">
                <p>Weekly engineering momentum</p>
                <div className="mini-bars" aria-hidden>
                  {[38, 50, 44, 67, 61, 74, 88].map((height) => (
                    <span key={height} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </article>
            </div>

            <div className="console-tracks">
              {[
                { label: "Cycle-time stability", value: 86 },
                { label: "Review quality confidence", value: 91 },
                { label: "Planning predictability", value: 79 },
              ].map((row) => (
                <div key={row.label} className="track-row">
                  <p>{row.label}</p>
                  <div>
                    <em style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="console-foot">
              {[ ["Merged PRs", "148"], ["High-risk repos", "4"], ["Quality score", "9.1"] ].map(
                ([label, value]) => (
                  <div key={label}>
                    <p>{label}</p>
                    <strong>{value}</strong>
                  </div>
                ),
              )}
            </div>
          </aside>
        </section>

        <section className="proof-strip" aria-label="Popular engineering ecosystems">
          <p>Built for teams using tools from</p>
          <div className="logo-marquee">
            <div className="logo-track">
              {[...partnerLogos, ...partnerLogos].map((company, index) => (
                <span className="logo-chip" key={`${company.name}-${index}`}>
                  <img
                    className="company-logo"
                    src={`https://cdn.simpleicons.org/${company.icon}`}
                    alt={`${company.name} logo`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="platform-section" id="platform">
          <div className="section-title">
            <h2>One platform, three operational layers for modern software organizations</h2>
            <p>
              CodePulse is designed to align strategy, execution, and engineering quality
              with measurable outcomes from day one.
            </p>
          </div>

          <div className="pillar-grid">
            {platformPillars.map((pillar) => (
              <article key={pillar.title} className="pillar-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
                <ul>
                  {pillar.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section" id="solutions">
          <div className="section-title">
            <h2>Core capabilities that scale with growing engineering complexity</h2>
            <p>
              From predictive release intelligence to automated governance, each module
              is built to improve delivery quality and execution confidence.
            </p>
          </div>

          <div className="features-grid">
            {homeFeatures.map((item) => (
              <article key={item.title} className="feature-card">
                <div className="feature-icon-wrap">
                  <HomeFeatureIcon icon={item.icon} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="process">
          <div className="section-title">
            <h2>Deployment model built for speed, governance, and enterprise adoption</h2>
          </div>

          <div className="workflow-layout">
            <ol className="workflow-list">
              {workflowSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="workflow-highlight">
              <p className="panel-label">Operations note</p>
              <h3>Live policy automation keeps engineering standards enforceable at scale.</h3>
              <p>
                Teams receive contextual recommendations and risk alerts before issues
                become blockers for release or roadmap commitments.
              </p>
              <button className="btn btn-ghost" onClick={onConnect}>
                Open dashboard <ArrowRight size={15} />
              </button>
            </aside>
          </div>
        </section>

        <section className="usecase-section">
          <div className="section-title">
            <h2>Purpose-built experiences for every layer of the engineering org</h2>
          </div>
          <div className="usecase-grid">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="usecase-card">
                <h3>{useCase.title}</h3>
                <p>{useCase.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="security-section" id="security">
          <article className="security-main">
            <p className="panel-label">Security and compliance</p>
            <h3>Enterprise trust controls designed for regulated and high-scale environments.</h3>
            <p>
              Security is built into the platform architecture with encrypted data
              handling, identity integration, and full audit visibility for enterprise
              governance programs.
            </p>
            <a className="btn btn-ghost" href="#faq">
              View governance details
            </a>
          </article>
          <div className="trust-grid">
            {trustSignals.map((item) => (
              <article key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

<section className="results-section" id="results">
  <div className="impact-grid">
    {impactStats.map((item) => (
      <article key={item.label}>
        <strong>{item.value}</strong>
        <p>{item.label}</p>
      </article>
    ))}
  </div>
</section>

</main>
</div>
);
}

function DashboardPage({ githubToken }: { githubToken: string | null }) {
  const [repos, setRepos] = useState<any[]>([]);
  const [signals, setSignals] = useState(dashboardSignals);
  const navigate = useNavigate();
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const stored = localStorage.getItem(CHECKLIST_KEY);
    if (!stored) {
      return DEFAULT_CHECKLIST;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as ChecklistItem[];
      }
    } catch (error) {
      console.error("Failed to parse checklist:", error);
    }
    return DEFAULT_CHECKLIST;
  });
  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const stored = localStorage.getItem(GOALS_KEY);
    if (!stored) {
      return DEFAULT_GOALS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as GoalItem[];
      }
    } catch (error) {
      console.error("Failed to parse goals:", error);
    }
    return DEFAULT_GOALS;
  });
  const [notes, setNotes] = useState(() => localStorage.getItem(NOTES_KEY) ?? "");
  const [calendarConnections, setCalendarConnections] =
    useState<CalendarConnections>(() => {
      const stored = localStorage.getItem(CALENDAR_KEY);
      if (!stored) {
        return DEFAULT_CALENDAR;
      }
      try {
        const parsed = JSON.parse(stored) as Partial<CalendarConnections>;
        return {
          google: Boolean(parsed?.google),
          outlook: Boolean(parsed?.outlook),
        };
      } catch (error) {
        console.error("Failed to parse calendar connections:", error);
      }
      return DEFAULT_CALENDAR;
    });

  useEffect(() => {
    if (githubToken) {
      fetch('https://api.github.com/user/repos', {
        headers: { Authorization: `Bearer ${githubToken}` }
      })
      .then(r => r.json())
      .then(data => {
        setRepos(data);
        const updatedSignals = dashboardSignals.map(signal => 
          signal.label === "Risk alerts" ? { ...signal, value: data.length.toString(), label: "Active repos" } : signal
        );
        setSignals(updatedSignals);
      })
      .catch(err => console.error('Failed to fetch repos:', err));
    }
  }, [githubToken]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(calendarConnections));
  }, [calendarConnections]);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }
    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!isTimerRunning || secondsLeft !== 0) {
      return;
    }
    const nextMode = timerMode === "focus" ? "break" : "focus";
    setTimerMode(nextMode);
    setSecondsLeft(nextMode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
  }, [isTimerRunning, secondsLeft, timerMode]);

  const maxWeeklyCommits = Math.max(...weeklyCommits.map((entry) => entry.commits));
  const totalCommits = weeklyCommits.reduce((sum, entry) => sum + entry.commits, 0);
  const remainingTasks = checklist.filter((task) => !task.done).length;
  const completedTasks = checklist.length - remainingTasks;
  const averageGoalProgress = goals.length
    ? Math.round(
        goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      )
    : 0;
  const isCalendarConnected =
    calendarConnections.google || calendarConnections.outlook;
  const totalSeconds = timerMode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = totalSeconds
    ? ((totalSeconds - secondsLeft) / totalSeconds) * 100
    : 0;

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(timerMode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
    }
    setIsTimerRunning((current) => !current);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerMode("focus");
    setSecondsLeft(FOCUS_DURATION);
  };

  const handleSkipTimer = () => {
    const nextMode = timerMode === "focus" ? "break" : "focus";
    setTimerMode(nextMode);
    setSecondsLeft(nextMode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
  };

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) {
      return;
    }
    const id = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setChecklist((current) => [{ id, label: trimmed, done: false }, ...current]);
    setNewTask("");
  };

  const handleAddGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newGoal.trim();
    if (!trimmed) {
      return;
    }
    const id = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setGoals((current) => [{ id, title: trimmed, progress: 0 }, ...current]);
    setNewGoal("");
  };

  const handleGoalProgress = (id: string, value: number) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id ? { ...goal, progress: value } : goal
      )
    );
  };

  const handleToggleTask = (id: string) => {
    setChecklist((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleClearCompleted = () => {
    setChecklist((current) => current.filter((task) => !task.done));
  };

  const handleToggleCalendar = (provider: keyof CalendarConnections) => {
    setCalendarConnections((current) => ({
      ...current,
      [provider]: !current[provider],
    }));
  };

  const linePoints = useMemo(() => {
    const maxHours = Math.max(...codingHours);
    return codingHours
      .map((hours, index) => {
        const x = (index / (codingHours.length - 1)) * 100;
        const y = 100 - (hours / maxHours) * 90;
        return `${x},${y}`;
      })
      .join(" ");
  }, []);

  return (
    <div className="dashboard-page">
      {!githubToken && (
        <div className="panel banner-card">
          <div>
            <h3>Connect GitHub to unlock live signals</h3>
            <p>Sync repositories to refresh dashboard insights automatically.</p>
          </div>
          <button className="btn btn-primary" onClick={goToGithub}>
            <Github size={16} />
            Connect GitHub
          </button>
        </div>
      )}
      <section className="dashboard-hero">
        <div>
          <p className="panel-label">Execution cockpit</p>
          <h1>Engineering Dashboard</h1>
          <p>
            Real-time signal across throughput, quality, and predictability so teams ship
            faster with fewer surprises.
          </p>
          <div className="dashboard-hero-tags">
            <span>Sprint 12</span>
            <span>4 teams active</span>
            <span>Last sync 2 min ago</span>
          </div>
        </div>
        <div className="dashboard-hero-actions">
          <button
            className="btn btn-primary btn-elevated"
            onClick={() => navigate("/repositories")}
          >
            Open repositories <ArrowRight size={15} />
          </button>
          <button className="btn btn-ghost">Export weekly report</button>
        </div>
      </section>

      <section className="signal-grid">
        {signals.map((signal) => (
          <article key={signal.label} className="signal-card">
            <p>{signal.label}</p>
            <strong>{signal.value}</strong>
            <span className={`signal-delta ${signal.tone}`}>{signal.delta}</span>
          </article>
        ))}
      </section>

      <section className="stats-grid">
        {statsCards.map((card) => (
          <article className="panel stat-card" key={card.label}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="productivity-grid">
        <article className="panel quick-actions">
          <div className="panel-head">
            <h3>Productivity launchpad</h3>
            <span>Quick actions</span>
          </div>
          <div className="action-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="action-card"
                onClick={() => navigate(action.path)}
              >
                <div className="action-title">
                  <action.icon size={18} />
                  <strong>{action.label}</strong>
                </div>
                <p>{action.description}</p>
              </button>
            ))}
          </div>
        </article>

        <article className="panel focus-card">
          <div className="panel-head">
            <h3>Focus timer</h3>
            <span>{timerMode === "focus" ? "Focus" : "Break"}</span>
          </div>
          <div className="focus-timer">
            <p className="timer-subtitle">
              {timerMode === "focus"
                ? "Deep work sprint"
                : "Reset and breathe"}
            </p>
            <strong className="timer-display">{formatTime(secondsLeft)}</strong>
            <div className="timer-bar">
              <span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
          </div>
          <div className="timer-actions">
            <button className="btn btn-primary" type="button" onClick={handleToggleTimer}>
              {isTimerRunning ? "Pause" : "Start"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleResetTimer}>
              Reset
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleSkipTimer}>
              Skip
            </button>
          </div>
        </article>

        <article className="panel checklist-card">
          <div className="panel-head">
            <h3>Daily checklist</h3>
            <span>{remainingTasks} open</span>
          </div>
          <form className="checklist-form" onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </form>
          <ul className="checklist-list">
            {checklist.map((task) => (
              <li
                key={task.id}
                className={`checklist-item ${task.done ? "done" : ""}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(task.id)}
                  />
                  <span>{task.label}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="checklist-footer">
            <span className="checklist-meta">
              {completedTasks} complete
            </span>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={handleClearCompleted}
              disabled={completedTasks === 0}
            >
              Clear completed
            </button>
          </div>
        </article>

        <article className="panel goals-card">
          <div className="panel-head">
            <h3>Goal tracking</h3>
            <span>{averageGoalProgress}% on track</span>
          </div>
          <form className="goals-form" onSubmit={handleAddGoal}>
            <input
              type="text"
              placeholder="Add a goal"
              value={newGoal}
              onChange={(event) => setNewGoal(event.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </form>
          <div className="goals-list">
            {goals.map((goal) => (
              <div key={goal.id} className="goal-row">
                <div className="goal-title">
                  <strong>{goal.title}</strong>
                  <span>{goal.progress}%</span>
                </div>
                <div className="goal-bar">
                  <span style={{ width: `${goal.progress}%` }} />
                </div>
                <input
                  className="goal-range"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={goal.progress}
                  onChange={(event) =>
                    handleGoalProgress(goal.id, Number(event.target.value))
                  }
                  aria-label={`Progress for ${goal.title}`}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="panel calendar-card">
          <div className="panel-head">
            <h3>Calendar sync</h3>
            <span>{isCalendarConnected ? "Connected" : "Not connected"}</span>
          </div>
          <div className="calendar-actions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleToggleCalendar("google")}
            >
              {calendarConnections.google
                ? "Disconnect Google"
                : "Connect Google"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleToggleCalendar("outlook")}
            >
              {calendarConnections.outlook
                ? "Disconnect Outlook"
                : "Connect Outlook"}
            </button>
          </div>
          <p className="calendar-helper">
            Block focus time and keep review windows visible.
          </p>
          <div className="calendar-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="calendar-item">
                <span className="calendar-time">{event.time}</span>
                <div className="calendar-details">
                  <strong>{event.title}</strong>
                  <span className="calendar-tag">{event.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel notes-card">
          <div className="panel-head">
            <h3>Personal notes</h3>
            <span>Autosaved</span>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Capture decisions, ideas, or next steps..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="notes-meta">
            <span>{notes.length ? `${notes.length} chars` : "Empty"}</span>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setNotes("")}
              disabled={!notes.trim()}
            >
              Clear
            </button>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-card commits-chart">
          <div className="panel-head">
            <h3>Commit momentum</h3>
            <span>Last 8 weeks</span>
          </div>
          <div className="chart-summary">
            <p>Total commits in range</p>
            <strong>{totalCommits}</strong>
          </div>
          <div className="bar-chart">
            {weeklyCommits.map((item) => (
              <div key={item.week} className="bar-stack">
                <span
                  className="bar-fill"
                  style={{ height: `${(item.commits / maxWeeklyCommits) * 100}%` }}
                />
                <small>{item.week}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel team-card">
          <div className="panel-head">
            <h3>Team health matrix</h3>
            <span>Live</span>
          </div>
          <div className="team-list">
            {teamHealth.map((team) => (
              <div key={team.name} className="team-row">
                <div>
                  <p>{team.name}</p>
                  <small>{team.trend}</small>
                </div>
                <strong>{team.score}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel contribution-panel">
          <div className="panel-head">
            <h3>Contribution heatmap</h3>
            <span>Last 8 weeks</span>
          </div>
          <div className="weekdays">
            {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="contribution-grid" aria-label="Contribution heatmap">
            {contributionMatrix.map((week, weekIndex) =>
              week.map((level, dayIndex) => (
                <span
                  key={`${weekIndex}-${dayIndex}`}
                  className={`heat-cell heat-${level}`}
                  title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                />
              )),
            )}
          </div>
        </article>

        <article className="panel chart-card language-chart">
          <div className="panel-head">
            <h3>Language distribution</h3>
            <span>Repository mix</span>
          </div>
          <div className="language-list">
            {languageUsage.map((item) => (
              <div key={item.name} className="language-row">
                <span>{item.name}</span>
                <div>
                  <em style={{ width: `${item.value}%` }} />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel chart-card coding-time-chart">
          <div className="panel-head">
            <h3>Coding hour trend</h3>
            <span>Hours/day</span>
          </div>
          <svg viewBox="0 0 100 100" role="img" aria-label="Coding hours trend">
            <polyline points={linePoints} />
          </svg>
          <div className="day-labels">
            {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </article>

        <article className="panel activity-card">
          <div className="panel-head">
            <h3>Activity feed</h3>
            <span>Today</span>
          </div>
          <ul className="activity-list">
            {activityFeed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

function RepositoriesPage({ githubToken }: { githubToken: string | null }) {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    if (githubToken) {
      fetch('https://api.github.com/user/repos', {
        headers: { Authorization: `Bearer ${githubToken}` }
      })
      .then(r => r.json())
      .then(data => setRepos(data))
      .catch(err => console.error('Failed to fetch repos:', err));
    }
  }, [githubToken]);

  return (
    <div className="repo-page">
      {!githubToken && (
        <div className="panel banner-card">
          <div>
            <h3>Connect GitHub to view repositories</h3>
            <p>Link your GitHub account to pull live repository data.</p>
          </div>
          <button className="btn btn-primary" onClick={goToGithub}>
            <Github size={16} />
            Connect GitHub
          </button>
        </div>
      )}
      <div className="dashboard-heading">
        <h1>Repositories</h1>
        <p>Project-level delivery pulse across active codebases.</p>
      </div>

      <section className="repo-summary-grid">
        <article>
          <p>Active repositories</p>
          <strong>{repos.length}</strong>
        </article>
        <article>
          <p>Avg merge cycle</p>
          <strong>4.2h</strong>
        </article>
        <article>
          <p>Weekly commits</p>
          <strong>437</strong>
        </article>
      </section>

      <section className="panel repo-table-wrap">
        <table className="repo-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Commits</th>
              <th>Primary Language</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
                <td>{repo.commits || 'N/A'}</td>
                <td>{repo.language || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const GITHUB_TOKEN_KEY = "codepulse_github_token";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="loader-card">
          <p className="eyebrow">Securing your session</p>
          <h2>Loading your workspace</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

function AppShell({
  githubToken,
  onLogoutGithub,
}: {
  githubToken: string | null;
  onLogoutGithub: () => void;
}) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CP";

  const handleLogout = () => {
    logout();
    onLogoutGithub();
    navigate("/");
  };

  const handleAvatarPick = () => {
    if (!isUploadingAvatar) {
      avatarInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarError(null);
    setIsUploadingAvatar(true);
    try {
      const result = await authApi.updateProfilePic(file);
      updateUser(result.user);
    } catch (error) {
      setAvatarError(
        error instanceof Error ? error.message : "Failed to update profile image"
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="sidebar-brand" to="/dashboard">
          <div className="logo-badge">
            <BrandMark />
          </div>
          <span>CodePulse</span>
        </Link>

        <div className="sidebar-user">
          <button
            type="button"
            className="avatar avatar-button"
            onClick={handleAvatarPick}
            disabled={isUploadingAvatar}
            aria-label="Change profile photo"
          >
            {user?.profilePicUrl ? (
              <img src={user.profilePicUrl} alt={user.name} />
            ) : (
              <span>{initials}</span>
            )}
            <span className="avatar-edit">Change</span>
          </button>
          <input
            ref={avatarInputRef}
            className="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <div>
            <p>{user?.name || "Workspace"}</p>
            <span>{user?.email || ""}</span>
            {avatarError && <span className="avatar-error">{avatarError}</span>}
            {isUploadingAvatar && !avatarError && (
              <span className="avatar-status">Updating photo...</span>
            )}
          </div>
        </div>

        <nav>
          {sidebarItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `side-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <p>{githubToken ? "GitHub connected" : "GitHub not connected"}</p>
          <strong>{githubToken ? "Sync enabled" : "Connect to enable sync"}</strong>
        </div>

        {!githubToken && (
          <button className="btn btn-ghost sidebar-connect" onClick={goToGithub}>
            <Github size={16} />
            Connect GitHub
          </button>
        )}

        <button className="side-link side-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [githubToken, setGithubToken] = useState<string | null>(() =>
    localStorage.getItem(GITHUB_TOKEN_KEY)
  );
  const [handledCode, setHandledCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (!code || code === handledCode) {
      return;
    }

    setHandledCode(code);

    const exchangeToken = async () => {
      try {
        const response = await fetch(`/api/github-oauth?code=${code}`);
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem(GITHUB_TOKEN_KEY, data.access_token);
          setGithubToken(data.access_token);
        }
      } catch (error) {
        console.error('GitHub OAuth failed:', error);
      } finally {
        navigate(user ? "/dashboard" : "/login", { replace: true });
      }
    };

    exchangeToken();
  }, [handledCode, location.search, navigate, user]);

  const clearGithubToken = () => {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    setGithubToken(null);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage onGithubLogin={goToGithub} />} />
      <Route path="/signup" element={<SignupPage onGithubLogin={goToGithub} />} />

      <Route element={<ProtectedRoute />}>
        <Route
          element={<AppShell githubToken={githubToken} onLogoutGithub={clearGithubToken} />}
        >
          <Route path="/dashboard" element={<DashboardPage githubToken={githubToken} />} />
          <Route path="/analytics" element={<AnalyticsPageComponent />} />
          <Route path="/repositories" element={<RepositoriesPage githubToken={githubToken} />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/snippets" element={<SnippetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}



