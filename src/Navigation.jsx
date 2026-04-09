import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackActivities, fallbackHoneymoon, fallbackFamily, fallbackLtc, fallbackGroup, fallbackIslands, fallbackFerry } from "./fallbackData.js";

export default function Navigation({ isAdmin = false }) {
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showIslandDropdown, setShowIslandDropdown] = useState(false);
  const [showFerryDropdown, setShowFerryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Timeout refs for delayed closing
  const packageTimeoutRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const islandTimeoutRef = useRef(null);
  const ferryTimeoutRef = useRef(null);
  
  // Helper functions for dropdown management
  const handlePackageEnter = () => {
    if (packageTimeoutRef.current) {
      clearTimeout(packageTimeoutRef.current);
    }
    if (!showMobileMenu) setShowPackageDropdown(true);
  };

  const handlePackageLeave = () => {
    packageTimeoutRef.current = setTimeout(() => {
      setShowPackageDropdown(false);
    }, 150);
  };

  const handleActivityEnter = () => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    if (!showMobileMenu) setShowActivityDropdown(true);
  };

  const handleActivityLeave = () => {
    activityTimeoutRef.current = setTimeout(() => {
      setShowActivityDropdown(false);
    }, 150);
  };

  const handleIslandEnter = () => {
    if (islandTimeoutRef.current) {
      clearTimeout(islandTimeoutRef.current);
    }
    if (!showMobileMenu) setShowIslandDropdown(true);
  };

  const handleIslandLeave = () => {
    islandTimeoutRef.current = setTimeout(() => {
      setShowIslandDropdown(false);
    }, 150);
  };

  const handleFerryEnter = () => {
    if (ferryTimeoutRef.current) {
      clearTimeout(ferryTimeoutRef.current);
    }
    if (!showMobileMenu) setShowFerryDropdown(true);
  };

  const handleFerryLeave = () => {
    ferryTimeoutRef.current = setTimeout(() => {
      setShowFerryDropdown(false);
    }, 150);
  };
  
  // Dynamic data states
  const [activities, setActivities] = useState([]);
  const [islands, setIslands] = useState([]);
  const [honeymoon, setHoneymoon] = useState([]);
  const [family, setFamily] = useState([]);
  const [ltc, setLtc] = useState([]);
  const [group, setGroup] = useState([]);
  const [ferry, setFerry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNavData() {
      setLoading(true);
      try {
        const [a, i, h, f, l, g, fe] = await Promise.all([
          // Using fallback data for now to avoid 404 errors
          Promise.resolve(fallbackActivities),
          Promise.resolve(fallbackIslands),
          fetchList("/api/honeymoon", {}, fallbackHoneymoon),
          fetchList("/api/family", {}, fallbackFamily),
          fetchList("/api/ltc", {}, fallbackLtc),
          fetchList("/api/group", {}, fallbackGroup),
          fetchList("/api/ferry", {}, fallbackFerry)
        ]);
        setActivities(a);
        setIslands(i);
        setHoneymoon(h);
        setFamily(f);
        setLtc(l);
        setGroup(g);
        setFerry(fe);
      } catch (error) {
        console.error('Navigation data loading error:', error);
        // Use fallback data if API fails
        setActivities(fallbackActivities);
        setIslands(fallbackIslands);
        setHoneymoon(fallbackHoneymoon);
        setFamily(fallbackFamily);
        setLtc(fallbackLtc);
        setGroup(fallbackGroup);
        setFerry(fallbackFerry);
      }
      setLoading(false);
    }
    loadNavData();
  }, []);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">AB</span>
        <div>
          <div className="brand-title">Andaman Treek Holidays</div>
          <div className="brand-sub">Tours and Experiences</div>
        </div>
      </div>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰
      </button>
      <nav className={`nav ${showMobileMenu ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
        <div 
          className="nav-dropdown"
          onMouseEnter={handlePackageEnter}
          onMouseLeave={handlePackageLeave}
          onClick={() => showMobileMenu && setShowPackageDropdown(!showPackageDropdown)}
        >
          <a href="/#packages" className="nav-link">Packages ▾</a>
          {(showPackageDropdown || (showMobileMenu && showPackageDropdown)) && (
            <div 
              className="dropdown-menu"
              onMouseEnter={handlePackageEnter}
              onMouseLeave={handlePackageLeave}
            >
              <div className="dropdown-section">
                <div className="dropdown-title">Honeymoon</div>
                <Link to="/honeymoon" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                {!loading && honeymoon.slice(0, 3).map((item) => (
                  <Link key={item._id} to={`/honeymoon/${item._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="dropdown-section">
                <div className="dropdown-title">Family</div>
                <Link to="/family" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                {!loading && family.slice(0, 3).map((item) => (
                  <Link key={item._id} to={`/family/${item._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="dropdown-section">
                <div className="dropdown-title">LTC</div>
                <Link to="/ltc" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                {!loading && ltc.slice(0, 3).map((item) => (
                  <Link key={item._id} to={`/ltc/${item._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="dropdown-section">
                <div className="dropdown-title">Group</div>
                <Link to="/group" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                {!loading && group.slice(0, 3).map((item) => (
                  <Link key={item._id} to={`/group/${item._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div 
          className="nav-dropdown"
          onMouseEnter={handleActivityEnter}
          onMouseLeave={handleActivityLeave}
          onClick={() => showMobileMenu && setShowActivityDropdown(!showActivityDropdown)}
        >
          <Link to="/activities" className="nav-link">Activities ▾</Link>
          {(showActivityDropdown || (showMobileMenu && showActivityDropdown)) && activities.length > 0 && (
            <div 
              className="dropdown-menu dropdown-menu-activities"
              onMouseEnter={handleActivityEnter}
              onMouseLeave={handleActivityLeave}
            >
              <div className="dropdown-section">
                <Link to="/activities" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Activities</Link>
              </div>
              {!loading && activities.slice(0, 6).map((activity) => (
                <div key={activity._id} className="dropdown-section">
                  <Link to={`/activities/${activity._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {activity.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div 
          className="nav-dropdown"
          onMouseEnter={handleIslandEnter}
          onMouseLeave={handleIslandLeave}
          onClick={() => showMobileMenu && setShowIslandDropdown(!showIslandDropdown)}
        >
          <Link to="/islands" className="nav-link">Islands ▾</Link>
          {(showIslandDropdown || (showMobileMenu && showIslandDropdown)) && islands.length > 0 && (
            <div 
              className="dropdown-menu dropdown-menu-islands"
              onMouseEnter={handleIslandEnter}
              onMouseLeave={handleIslandLeave}
            >
              <div className="dropdown-section">
                <Link to="/islands" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Islands</Link>
              </div>
              {!loading && islands.slice(0, 4).map((island) => (
                <div key={island._id} className="dropdown-section">
                  <Link to={`/islands/${island._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {island.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div 
          className="nav-dropdown"
          onMouseEnter={handleFerryEnter}
          onMouseLeave={handleFerryLeave}
          onClick={() => showMobileMenu && setShowFerryDropdown(!showFerryDropdown)}
        >
          <Link to="/ferries" className="nav-link">Ferry ▾</Link>
          {(showFerryDropdown || (showMobileMenu && showFerryDropdown)) && ferry.length > 0 && (
            <div 
              className="dropdown-menu dropdown-menu-ferry"
              onMouseEnter={handleFerryEnter}
              onMouseLeave={handleFerryLeave}
            >
              <div className="dropdown-section">
                <Link to="/ferries" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Ferries</Link>
              </div>
              {!loading && ferry.slice(0, 5).map((ferryItem) => (
                <div key={ferryItem._id} className="dropdown-section">
                  <Link to={`/ferries/${ferryItem._id}`} className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
                    {ferryItem.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <a href="/#about" onClick={(e) => { e.preventDefault(); window.location.href = '/#about'; setShowMobileMenu(false); }}>About</a>
        <a href="/#contact" onClick={(e) => { e.preventDefault(); window.location.href = '/#contact'; setShowMobileMenu(false); }}>Contact</a>
      </nav>
      <div style={{ display: "flex", gap: 8 }}>
        {isAdmin && (
          <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>
        )}
        <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
      </div>
    </header>
  );
}