import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./StudentNavbar.module.css";

const StudentNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* BRAND */}
        <div className={styles.brand} onClick={() => navigate("/student/dashboard")}>
          <div className={styles.brandIcon}>P</div>
          <span className={styles.brandName}>Projexis</span>
        </div>

        {/* NAV LINKS */}
        <div className={styles.links}>
          <Link
            to="/student/dashboard"
            className={`${styles.link} ${isActive("/student/dashboard") ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>⊞</span>
            Dashboard
          </Link>
          <Link
            to="/student/teams"
            className={`${styles.link} ${isActive("/student/team") || isActive("/student/teams") ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>◈</span>
            Teams
          </Link>
        </div>

        {/* PROFILE */}
        <div className={styles.right}>
          <button className={styles.profileBtn} onClick={() => navigate("/profile")}>
            <div className={styles.avatar}>S</div>
            <span className={styles.profileLabel}>Student</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;