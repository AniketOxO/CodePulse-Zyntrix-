import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github, ImagePlus } from "lucide-react";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface SignupPageProps {
  onGithubLogin: () => void;
}

export default function SignupPage({ onGithubLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  useEffect(() => {
    if (!profilePic) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profilePic);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePic]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const result = await authApi.register(formData);
      setAuth(result.token, result.user);
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
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
            <p className="eyebrow">Get started</p>
            <h1>Create your CodePulse account in minutes.</h1>
            <p>
              Set up your profile, add a photo, and start tracking delivery health
              across teams. Your JWT session keeps everything secure.
            </p>

            <ul className="auth-benefits">
              <li>Upload a profile photo stored locally</li>
              <li>Secure password hashing with bcrypt</li>
              <li>Instant access to dashboards after signup</li>
            </ul>
          </div>

          <div className="auth-form-wrap">
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

              <label>
                Work email
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <label>
                Confirm password
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>

              <div className="profile-upload">
                <div className="profile-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" />
                  ) : (
                    <ImagePlus size={28} />
                  )}
                </div>
                <div>
                  <p>Profile photo</p>
                  <span>PNG, JPG, WEBP up to 2MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setProfilePic(event.target.files ? event.target.files[0] : null)
                    }
                  />
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-elevated auth-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
