import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChartNoAxesCombined,
  FolderGit2,
  GitCommitHorizontal,
  Github,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

type AppView = "home" | "auth" | "dashboard" | "repositories";

type SidebarItem = {
  id: "dashboard" | "commits" | "analytics" | "repositories" | "settings" | "logout";
  label: string;
};

type HomeIconKey =
  | "signal"
  | "vault"
  | "pipeline"
  | "forecast"
  | "automation"
  | "team";

type HomeFeature = {
  title: string;
  text: string;
  icon: HomeIconKey;
};

type DashboardSignal = {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "steady" | "watch";
};

type PartnerLogo = {
  name: string;
  icon: string;
};

const heroSignals = [
  { label: "Teams onboarded", value: "2,180+" },
  { label: "Insights generated monthly", value: "4.1M" },
  { label: "Average release confidence lift", value: "+39%" },
];

const homeFeatures: HomeFeature[] = [
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

const partnerLogos: PartnerLogo[] = [
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

const dashboardSignals: DashboardSignal[] = [
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

const contributionMatrix: number[][] = [
  [0, 2, 3, 1, 2, 3, 0],
  [1, 2, 0, 0, 3, 2, 1],
  [0, 3, 2, 1, 2, 3, 0],
  [2, 2, 1, 0, 3, 1, 0],
  [1, 3, 2, 2, 3, 2, 1],
  [0, 2, 1, 0, 2, 3, 2],
  [1, 2, 3, 1, 2, 2, 0],
  [0, 1, 2, 3, 2, 1, 0],
];

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "commits", label: "Commits" },
  { id: "analytics", label: "Analytics" },
  { id: "repositories", label: "Repositories" },
  { id: "settings", label: "Settings" },
  { id: "logout", label: "Logout" },
];

function HomeFeatureIcon({ icon }: { icon: HomeIconKey }) {
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

function HomePage({ onConnect }: { onConnect: () => void }) {
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
          <a className="btn btn-ghost" href="#cta">
            Book demo
          </a>
          <button className="btn btn-primary btn-elevated" onClick={onConnect}>
            <Github size={16} />
            Connect GitHub
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Enterprise Engineering Intelligence Platform</p>
            <h1>Give leadership and invidual one trusted system for delivery clarity.</h1>
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
              <button className="btn btn-primary btn-elevated" onClick={onConnect}>
                <Github size={16} />
                Start free integration
              </button>
              <a className="btn btn-ghost" href="#preview">
                Explore product tour
              </a>
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
              <article key={item.label} className="impact-card">
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <article className="testimonial-card">
            <p className="panel-label">Customer voice</p>
            <h3>
              "We stopped reacting at sprint-end. CodePulse gives us early signals and
              we ship with confidence."
            </h3>
            <span>VP Engineering, Global SaaS Team</span>
          </article>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-title">
            <h2>Frequently asked questions from product and engineering organizations</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => (
              <article key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="cta">
          <h2>Adopt a landing experience and platform story that reflects enterprise-grade execution.</h2>
          <p>
            Connect GitHub, align engineering metrics to business outcomes, and give every
            stakeholder a reliable view of delivery performance.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-elevated" onClick={onConnect}>
              <Github size={16} />
              Launch CodePulse
            </button>
            <a className="btn btn-ghost" href="#platform">
              Explore platform
            </a>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>(c) 2026 CodePulse. Precision visibility for high-performing engineering teams.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#security">Security</a>
          <a href="#faq">Resources</a>
        </div>
      </footer>
    </div>
  );
}

function AuthPage({
  onBackHome,
  onAuthSuccess,
}: {
  onBackHome: () => void;
  onAuthSuccess: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="auth-page">
      <span className="ambient-shape ambient-a" aria-hidden />
      <span className="ambient-shape ambient-b" aria-hidden />

      <section className="auth-shell">
        <header className="auth-header">
          <button className="btn btn-ghost" onClick={onBackHome}>
            Back to home
          </button>
          <a
            className="logo-wrap"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              onBackHome();
            }}
          >
            <div className="logo-badge">
              <BrandMark />
            </div>
            <span>CodePulse</span>
          </a>
        </header>

        <article className="auth-card">
          <div className="auth-intro">
            <p className="eyebrow">GitHub access</p>
            <h1>Log in or sign up to connect your repositories.</h1>
            <p>
              Authenticate your team with GitHub, then open your dashboard to start
              tracking commits, pull requests, and delivery health.
            </p>

            <ul className="auth-benefits">
              <li>Scoped GitHub OAuth permissions</li>
              <li>Secure organization-level access control</li>
              <li>Instant setup for team dashboards</li>
            </ul>
          </div>

          <div className="auth-form-wrap">
            <div className="auth-switch" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </div>

            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onAuthSuccess();
              }}
            >
              {mode === "signup" && (
                <label>
                  Full name
                  <input type="text" placeholder="Alex Carter" required />
                </label>
              )}

              <label>
                Work email
                <input type="email" placeholder="name@company.com" required />
              </label>

              <label>
                Password
                <input type="password" placeholder="Enter password" required />
              </label>

              {mode === "signup" && (
                <label>
                  Organization
                  <input type="text" placeholder="Velocity Labs" required />
                </label>
              )}

              <button type="submit" className="btn btn-primary btn-elevated auth-submit">
                <Github size={16} />
                {mode === "login" ? "Log in with GitHub" : "Sign up with GitHub"}
              </button>
            </form>

            <button className="btn btn-ghost auth-continue" onClick={onAuthSuccess}>
              Continue to dashboard
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

function DashboardPage({
  onOpenRepositories,
}: {
  onOpenRepositories: () => void;
}) {
  const maxWeeklyCommits = Math.max(...weeklyCommits.map((entry) => entry.commits));
  const totalCommits = weeklyCommits.reduce((sum, entry) => sum + entry.commits, 0);

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
          <button className="btn btn-primary btn-elevated" onClick={onOpenRepositories}>
            Open repositories <ArrowRight size={15} />
          </button>
          <button className="btn btn-ghost">Export weekly report</button>
        </div>
      </section>

      <section className="signal-grid">
        {dashboardSignals.map((signal) => (
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

function RepositoriesPage() {
  return (
    <div className="repo-page">
      <div className="dashboard-heading">
        <h1>Repositories</h1>
        <p>Project-level delivery pulse across active codebases.</p>
      </div>

      <section className="repo-summary-grid">
        <article>
          <p>Active repositories</p>
          <strong>24</strong>
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
            {repositories.map((repo) => (
              <tr key={repo.name}>
                <td>{repo.name}</td>
                <td>{repo.commits}</td>
                <td>{repo.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function AppShell({
  view,
  setView,
}: {
  view: AppView;
  setView: (view: AppView) => void;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-badge">
            <BrandMark />
          </div>
          <span>CodePulse</span>
        </div>

        <div className="sidebar-workspace">
          <p>Workspace</p>
          <strong>Velocity Labs</strong>
        </div>

        <nav>
          {sidebarItems.map((item) => {
            const isActive =
              (view === "dashboard" && ["dashboard", "commits", "analytics"].includes(item.id)) ||
              (view === "repositories" && item.id === "repositories");

            return (
              <button
                key={item.id}
                className={`side-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "repositories") {
                    setView("repositories");
                    return;
                  }
                  if (item.id === "logout") {
                    setView("home");
                    return;
                  }
                  if (["dashboard", "commits", "analytics"].includes(item.id)) {
                    setView("dashboard");
                  }
                }}
              >
                {item.id === "dashboard" && <LayoutDashboard size={16} />}
                {item.id === "commits" && <GitCommitHorizontal size={16} />}
                {item.id === "analytics" && <ChartNoAxesCombined size={16} />}
                {item.id === "repositories" && <FolderGit2 size={16} />}
                {item.id === "settings" && <Settings size={16} />}
                {item.id === "logout" && <LogOut size={16} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <p>GitHub connected</p>
          <strong>Sync: 2 min ago</strong>
        </div>
      </aside>

      <main className="dashboard-main">
        {view === "dashboard" ? (
          <DashboardPage onOpenRepositories={() => setView("repositories")} />
        ) : (
          <RepositoriesPage />
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>("home");

  if (view === "home") {
    return <HomePage onConnect={() => setView("auth")} />;
  }

  if (view === "auth") {
    return <AuthPage onBackHome={() => setView("home")} onAuthSuccess={() => setView("dashboard")} />;
  }

  return <AppShell view={view} setView={setView} />;
}


