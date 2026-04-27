import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./FacultyNavbar.module.css";

export default function FacultyNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* BRAND */}
        <div className={styles.brand} onClick={() => navigate("/faculty/FacultyDashboard")}>
          <div className={styles.brandIcon}>P</div>
          <span className={styles.brandName}>Projexis</span>
        </div>

        {/* NAV LINKS */}
        <div className={styles.links}>
          <Link
            to="/faculty/FacultyDashboard"
            className={`${styles.link} ${isActive("/faculty/FacultyDashboard") || location.pathname === "/faculty" ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>⊞</span>
            Dashboard
          </Link>
          <Link
            to="/faculty/FacultyTeams"
            className={`${styles.link} ${isActive("/faculty/FacultyTeams") || isActive("/faculty/team") ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>◈</span>
            Teams
          </Link>
        </div>

        {/* RIGHT — PROFILE */}
        <div className={styles.right}>
          <button className={styles.profileBtn} onClick={() => navigate("/profile")}>
            <div className={styles.avatar}>F</div>
            <span className={styles.profileLabel}>Faculty</span>
          </button>
        </div>
      </div>
    </nav>
  );
}