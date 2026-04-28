import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onGithubLogin: () => void;
}

function GoogleMark() {
  return (
    <svg
      className="google-mark"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.7 1.2 9.1 3.5l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.5 5.4 2.7 13.3l7.9 6.1C12.5 13 17.8 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.5-.1-2.7-.4-4H24v7.6h12.5c-.6 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.9-9.9 6.9-16.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.6 28.6c-1-3-1-6.3 0-9.3l-7.9-6.1c-3.4 6.8-3.4 14.8 0 21.6l7.9-6.2z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 12-2.1 16-5.7l-7.3-5.7c-2 1.4-4.6 2.3-8.7 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage({ onGithubLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential: string }) => {
          try {
            setError(null);
            const result = await authApi.googleLogin(response.credential);
            setAuth(result.token, result.user);
            navigate(redirectTo);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed");
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [googleClientId, navigate, setAuth]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.login({ email, password });
      setAuth(result.token, result.user);
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <span className="ambient-shape ambient-a" aria-hidden />
      <span className="ambient-shape ambient-b" aria-hidden />

      <section className="auth-shell">
        <header className="auth-header">
          <Link className="btn btn-ghost" to="/">
            Back to home
          </Link>
          <button className="btn btn-primary" onClick={onGithubLogin}>
            <Github size={16} />
            Connect GitHub
          </button>
        </header>

        <article className="auth-card">
          <div className="auth-intro">
            <p className="eyebrow">Welcome back</p>
            <h1>Log in to monitor delivery signals in real time.</h1>
            <p>
              Access your engineering dashboards, team benchmarks, and workflow
              intelligence with a secure JWT-based session.
            </p>

            <ul className="auth-benefits">
              <li>Secure JWT authentication with session control</li>
              <li>Connect Google in one tap for faster access</li>
              <li>Keep your GitHub OAuth integration ready</li>
            </ul>
          </div>

          <div className="auth-form-wrap">
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-elevated auth-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            {googleClientId ? (
              <div className="google-button" ref={googleButtonRef} />
            ) : (
              <div className="google-fallback">
                <button className="btn google-disabled" type="button" disabled>
                  <GoogleMark />
                  Continue with Google
                </button>
                <p className="auth-helper">
                  Add VITE_GOOGLE_CLIENT_ID to enable Google login.
                </p>
              </div>
            )}

            <p className="auth-footer">
              New to CodePulse? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
