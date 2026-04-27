import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: role.toUpperCase(),
      });

      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Registration Failed");
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

        /* Ambient orbs */
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

        /* Grid pattern */
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

        /* Form card */
        .form-card {
          width: 100%;
          max-width: 380px;
        }

        .form-header {
          margin-bottom: 36px;
        }
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

        .field-group {
          margin-bottom: 18px;
        }
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
          appearance: none;
          -webkit-appearance: none;
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .field-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(99, 102, 241, 0.07);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .role-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 18px;
        }
        .role-option {
          position: relative;
        }
        .role-option input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0; height: 0;
        }
        .role-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .role-label:hover {
          border-color: rgba(99,102,241,0.4);
          color: rgba(255,255,255,0.7);
        }
        .role-option input:checked + .role-label {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.6);
          color: #a78bfa;
        }
        .role-icon { font-size: 16px; }

        .role-field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

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

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }
        .login-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-link a:hover { color: #a78bfa; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.5px;
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
              Build &<br />
              <span>collaborate</span><br />
              smarter.
            </h1>
            <p>
              A unified platform for students and faculty to manage projects, track progress, and achieve goals together.
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
              <h2>Create account</h2>
              <p>Join Projexis and get started today</p>
            </div>

            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input
                type="text"
                className="field-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <label className="field-label">Password</label>
              <input
                type="password"
                className="field-input"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field-group">
              <span className="role-field-label">I am a</span>
              <div className="role-row">
                <div className="role-option">
                  <input
                    type="radio"
                    id="student"
                    name="role"
                    value="STUDENT"
                    checked={role === "STUDENT"}
                    onChange={() => setRole("STUDENT")}
                  />
                  <label htmlFor="student" className="role-label">
                    <span className="role-icon">🎓</span> Student
                  </label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    id="faculty"
                    name="role"
                    value="FACULTY"
                    checked={role === "FACULTY"}
                    onChange={() => setRole("FACULTY")}
                  />
                  <label htmlFor="faculty" className="role-label">
                    <span className="role-icon">🏫</span> Faculty
                  </label>
                </div>
              </div>
            </div>

            <button
              className="submit-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>

            <div className="login-link">
              Already have an account?{" "}
              <Link to="/">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;