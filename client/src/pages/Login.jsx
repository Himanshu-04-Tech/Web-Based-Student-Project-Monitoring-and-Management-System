import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);

      const role = res.data.user?.role;

      if (!role) {
        alert("Login failed: role not found");
        return;
      }

      if (role === "FACULTY") {
        navigate("/faculty/FacultyDashboard");
      } else if (role === "STUDENT") {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
        }

        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 80px;
          position: relative;
          z-index: 2;
        }

        .auth-right {
          width: 480px;
          background: #111118;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.06);
          z-index: 3;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 1;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: rgba(99, 102, 241, 0.18);
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: rgba(236, 72, 153, 0.1);
          bottom: -80px; right: 200px;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: rgba(16, 185, 129, 0.08);
          top: 50%; right: 100px;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
        }
        .brand-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .hero-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 52px;
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -2px;
          margin: 0 0 20px;
        }
        .hero-text h1 span {
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-text p {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 380px;
          margin: 0;
          font-weight: 300;
        }

        .feature-pills {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 52px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          font-weight: 400;
        }
        .pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }

        .form-card { width: 100%; max-width: 380px; }

        .form-header { margin-bottom: 36px; }
        .form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.8px;
          margin: 0 0 8px;
        }
        .form-header p {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        .field-group { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(99, 102, 241, 0.07);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .password-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .forgot-link {
          font-size: 12px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #a78bfa; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.2px;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }
        .submit-btn:hover::before { background: rgba(255,255,255,0.08); }
        .submit-btn:active { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .register-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }
        .register-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .register-link a:hover { color: #a78bfa; }

        .trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }

        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; border: none; padding: 40px 28px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left panel */}
        <div className="auth-left">
          <div className="brand-badge">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">Projexis</span>
          </div>
          <div className="hero-text">
            <h1>
              Welcome<br />
              <span>back.</span>
            </h1>
            <p>
              Sign in to your Projexis account and pick up right where you left off. Your projects are waiting.
            </p>
          </div>
          <div className="feature-pills">
            <div className="pill"><span className="pill-dot" /> Real-time project collaboration</div>
            <div className="pill"><span className="pill-dot" /> Role-based dashboards</div>
            <div className="pill"><span className="pill-dot" /> Smart deadline tracking</div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right">
          <div className="form-card">
            <div className="form-header">
              <h2>Sign in</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <div className="field-group">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <div className="password-row">
                <label className="field-label" style={{ margin: 0 }}>Password</label>
                {/* <a href="#" className="forgot-link">Forgot password?</a> */}
              </div>
              <input
                type="password"
                className="field-input"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>

            <div className="register-link">
              Don't have an account?{" "}
              <Link to="/register">Create one</Link>
            </div>

            <div className="trust-row">
              <span className="trust-item">🔒 SSL Secured</span>
              <span className="trust-item">🛡 Privacy first</span>
              <span className="trust-item">✦ 99.9% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;