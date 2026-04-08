import { useEffect, useMemo, useState } from "react";
import { createItem, deleteItem, fetchList, logout, updateItem } from "./api.js";
import { fallbackActivities, fallbackFamily, fallbackGroup, fallbackHoneymoon, fallbackIslands, fallbackLtc, fallbackPackages, fallbackFerry } from "./fallbackData.js";

const emptyForms = {
  packages:  { _id: "", title: "", duration: "", category: "", priceFrom: "", image: "", description: "", location: "", tags: "" },
  activities:{ _id: "", title: "", category: "", priceFrom: "", image: "", description: "", duration: "", location: "", tags: "" },
  islands:   { _id: "", name: "", tagline: "", image: "", description: "", highlights: "", tags: "" },
  honeymoon: { _id: "", title: "", subtitle: "", duration: "", priceFrom: "", image: "", description: "", highlights: "", offer: "", tags: "" },
  family:    { _id: "", title: "", subtitle: "", duration: "", priceFrom: "", image: "", description: "", highlights: "", tags: "" },
  ltc:       { _id: "", title: "", subtitle: "", duration: "", priceFrom: "", image: "", description: "", highlights: "", tags: "" },
  group:     { _id: "", title: "", subtitle: "", duration: "", priceFrom: "", image: "", description: "", highlights: "", tags: "" },
  ferry:     { _id: "", name: "", type: "", description: "", duration: "", image: "", features: "", priceFrom: "" }
};

const tabIcons = {
  packages:   "📦",
  activities: "🤿",
  islands:    "🏝️",
  honeymoon:  "💑",
  family:     "👨👩👧👦",
  ltc:        "🏛️",
  group:      "👥",
  ferry:      "⛴️"
};

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

function isRealId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function AdminPanel({ onLogout }) {
  const [packages,   setPackages]   = useState([]);
  const [activities, setActivities] = useState([]);
  const [islands,    setIslands]    = useState([]);
  const [honeymoon,  setHoneymoon]  = useState([]);
  const [family,     setFamily]     = useState([]);
  const [ltc,        setLtc]        = useState([]);
  const [group,      setGroup]      = useState([]);
  const [ferry,      setFerry]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [adminTab,   setAdminTab]   = useState("packages");
  const [adminForm,  setAdminForm]  = useState(emptyForms.packages);
  const [adminMessage, setAdminMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminConfig = useMemo(() => ({
    packages:  { title: "Packages",   path: "/api/packages" },
    activities:{ title: "Activities", path: "/api/activities" },
    islands:   { title: "Islands",    path: "/api/islands" },
    honeymoon: { title: "Honeymoon",  path: "/api/honeymoon" },
    family:    { title: "Family",     path: "/api/family" },
    ltc:       { title: "LTC",        path: "/api/ltc" },
    group:     { title: "Group",      path: "/api/group" },
    ferry:     { title: "Ferry",      path: "/api/ferry" }
  }), []);

  const counts = {
    packages: packages.length, activities: activities.length,
    islands: islands.length, honeymoon: honeymoon.length,
    family: family.length, ltc: ltc.length, group: group.length,
    ferry: ferry.length
  };

  async function loadAll() {
    setLoading(true);
    const [p, a, i, h, f, l, g, fe] = await Promise.all([
      fetchList("/api/packages",  {}, fallbackPackages),
      fetchList("/api/activities",{}, fallbackActivities),
      fetchList("/api/islands",   {}, fallbackIslands),
      fetchList("/api/honeymoon", {}, fallbackHoneymoon),
      fetchList("/api/family",    {}, fallbackFamily),
      fetchList("/api/ltc",       {}, fallbackLtc),
      fetchList("/api/group",     {}, fallbackGroup),
      fetchList("/api/ferry",     {}, fallbackFerry)
    ]);
    setPackages(p); setActivities(a); setIslands(i);
    setHoneymoon(h); setFamily(f); setLtc(l); setGroup(g); setFerry(fe);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { setAdminForm(emptyForms[adminTab]); setAdminMessage(""); }, [adminTab]);

  async function handleSubmit(e) {
    e.preventDefault();
    const config = adminConfig[adminTab];
    const { _id, ...rest } = adminForm;
    const payload = { ...rest };

    if (adminTab === "packages" || adminTab === "activities") {
      payload.priceFrom = payload.priceFrom ? Number(payload.priceFrom) : 0;
      payload.tags = payload.tags ? payload.tags.split(",").map((t) => t.trim()) : [];
    } else if (adminTab === "ferry") {
      payload.priceFrom = payload.priceFrom ? Number(payload.priceFrom) : 0;
      payload.features = payload.features ? payload.features.split(",").map((t) => t.trim()) : [];
    } else if (["honeymoon", "family", "ltc", "group"].includes(adminTab)) {
      payload.priceFrom  = payload.priceFrom ? Number(payload.priceFrom) : 0;
      payload.highlights = payload.highlights ? payload.highlights.split(",").map((t) => t.trim()) : [];
      payload.tags       = payload.tags ? payload.tags.split(",").map((t) => t.trim()) : [];
      if (adminTab === "honeymoon") payload.offer = payload.offer || "";
    } else {
      payload.highlights = payload.highlights ? payload.highlights.split(",").map((t) => t.trim()) : [];
      payload.tags       = payload.tags ? payload.tags.split(",").map((t) => t.trim()) : [];
    }

    try {
      if (_id) {
        await updateItem(config.path, _id, payload);
        setAdminMessage("✅ Updated successfully.");
      } else {
        await createItem(config.path, payload);
        setAdminMessage("✅ Created successfully.");
      }
      setAdminForm(emptyForms[adminTab]);
      await loadAll();
    } catch (err) {
      if (err.message.includes("Unauthorized") || err.message.includes("expired")) {
        setAdminMessage("⚠️ Session expired. Logging out...");
        setTimeout(() => { logout(); onLogout(); }, 1500);
      } else {
        setAdminMessage(`❌ ${err.message}`);
      }
    }
  }

  async function handleDelete(id) {
    if (!isRealId(id)) { setAdminMessage("⚠️ Cannot delete fallback data. Seed the database first."); return; }
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(adminConfig[adminTab].path, id);
      setAdminMessage("✅ Deleted successfully.");
      await loadAll();
    } catch (err) {
      if (err.message.includes("Unauthorized") || err.message.includes("expired")) {
        setAdminMessage("⚠️ Session expired. Logging out...");
        setTimeout(() => { logout(); onLogout(); }, 1500);
      } else {
        setAdminMessage(`❌ Delete failed: ${err.message}`);
      }
    }
  }

  function handleEdit(item) {
    if (!isRealId(item._id)) { setAdminMessage("⚠️ Cannot edit fallback data. Seed the database first."); return; }
    if (adminTab === "islands") {
      setAdminForm({ _id: item._id, name: item.name || "", tagline: item.tagline || "", image: item.image || "", description: item.description || "", highlights: Array.isArray(item.highlights) ? item.highlights.join(", ") : "", tags: Array.isArray(item.tags) ? item.tags.join(", ") : "" });
    } else if (adminTab === "ferry") {
      setAdminForm({ _id: item._id, name: item.name || "", type: item.type || "", description: item.description || "", duration: item.duration || "", image: item.image || "", features: Array.isArray(item.features) ? item.features.join(", ") : "", priceFrom: item.priceFrom || "" });
    } else if (["honeymoon", "family", "ltc", "group"].includes(adminTab)) {
      setAdminForm({ _id: item._id, title: item.title || "", subtitle: item.subtitle || "", duration: item.duration || "", priceFrom: item.priceFrom || "", image: item.image || "", description: item.description || "", highlights: Array.isArray(item.highlights) ? item.highlights.join(", ") : "", offer: adminTab === "honeymoon" ? (item.offer || "") : undefined, tags: Array.isArray(item.tags) ? item.tags.join(", ") : "" });
    } else {
      setAdminForm({ _id: item._id, title: item.title || "", duration: item.duration || "", category: item.category || "", priceFrom: item.priceFrom || "", image: item.image || "", description: item.description || "", location: item.location || "", tags: Array.isArray(item.tags) ? item.tags.join(", ") : "" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const adminItems =
    adminTab === "packages"   ? packages :
    adminTab === "activities" ? activities :
    adminTab === "honeymoon"  ? honeymoon :
    adminTab === "family"     ? family :
    adminTab === "ltc"        ? ltc :
    adminTab === "group"      ? group :
    adminTab === "ferry"      ? ferry : islands;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <aside style={{ width: sidebarOpen ? 240 : 64, background: "var(--accent-dark)", display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),var(--sun))", display: "grid", placeItems: "center", fontWeight: 700, color: "#fff", flexShrink: 0 }}>AB</span>
          {sidebarOpen && <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Andaman Treek Holidays</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Admin Panel</div></div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {Object.keys(adminConfig).map((key) => (
            <button key={key} onClick={() => setAdminTab(key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left", background: adminTab === key ? "rgba(255,255,255,0.15)" : "transparent", color: adminTab === key ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: adminTab === key ? 700 : 400, transition: "background 0.15s" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{tabIcons[key]}</span>
              {sidebarOpen && <span style={{ flex: 1, fontSize: 14 }}>{adminConfig[key].title}</span>}
              {sidebarOpen && <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "1px 8px", fontSize: 11, color: "#fff" }}>{counts[key]}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => { logout(); onLogout(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.65)", fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4 }}>☰</button>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: 18 }}>{adminConfig[adminTab].title}</span>
            <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 8 }}>{counts[adminTab]} items</span>
          </div>
          <a href="/" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>← Back to Site</a>
        </header>

        <main style={{ flex: 1, padding: 24 }}>
          {adminMessage && <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 13 }}>{adminMessage}</div>}

          {loading ? <div className="loading">Loading...</div> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", fontWeight: 700, fontSize: 14 }}>All {adminConfig[adminTab].title}</div>
                {adminItems.length === 0 && <div style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>No items yet. Create one →</div>}
                {adminItems.map((item, idx) => (
                  <div key={item._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: idx < adminItems.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                    {item.image && <div style={{ width: 48, height: 48, borderRadius: 10, backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title || item.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{item.subtitle || item.category || item.tagline || item.type || item.duration || ""}</div>
                    </div>
                    <div style={{ color: "var(--accent-dark)", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{formatPrice(item.priceFrom)}</div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleEdit(item)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(item._id)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff5f5", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#dc2626" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, boxShadow: "var(--shadow)", padding: 20, display: "grid", gap: 10, position: "sticky", top: 80 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, textTransform: "capitalize" }}>
                  {adminForm._id ? `Edit ${adminConfig[adminTab].title}` : `New ${adminConfig[adminTab].title}`}
                </div>

                {adminTab === "islands" ? (
                  <>
                    <input className="input" placeholder="Name" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
                    <input className="input" placeholder="Tagline" value={adminForm.tagline} onChange={(e) => setAdminForm({ ...adminForm, tagline: e.target.value })} />
                    <input className="input" placeholder="Image URL" value={adminForm.image} onChange={(e) => setAdminForm({ ...adminForm, image: e.target.value })} />
                    <textarea className="input" rows="3" placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })} />
                    <input className="input" placeholder="Highlights (comma separated)" value={adminForm.highlights} onChange={(e) => setAdminForm({ ...adminForm, highlights: e.target.value })} />
                    <input className="input" placeholder="Tags (comma separated)" value={adminForm.tags} onChange={(e) => setAdminForm({ ...adminForm, tags: e.target.value })} />
                  </>
                ) : adminTab === "ferry" ? (
                  <>
                    <input className="input" placeholder="Name" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
                    <input className="input" placeholder="Type (e.g. Luxury, Budget)" value={adminForm.type} onChange={(e) => setAdminForm({ ...adminForm, type: e.target.value })} />
                    <input className="input" placeholder="Duration (e.g. 2 Hours)" value={adminForm.duration} onChange={(e) => setAdminForm({ ...adminForm, duration: e.target.value })} />
                    <input className="input" placeholder="Price from" value={adminForm.priceFrom} onChange={(e) => setAdminForm({ ...adminForm, priceFrom: e.target.value })} />
                    <input className="input" placeholder="Image URL" value={adminForm.image} onChange={(e) => setAdminForm({ ...adminForm, image: e.target.value })} />
                    <textarea className="input" rows="3" placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })} />
                    <input className="input" placeholder="Features (comma separated, e.g. AC, WiFi, Meals)" value={adminForm.features} onChange={(e) => setAdminForm({ ...adminForm, features: e.target.value })} />
                  </>
                ) : adminTab === "honeymoon" ? (
                  <>
                    <input className="input" placeholder="Title" value={adminForm.title} onChange={(e) => setAdminForm({ ...adminForm, title: e.target.value })} />
                    <input className="input" placeholder="Subtitle" value={adminForm.subtitle} onChange={(e) => setAdminForm({ ...adminForm, subtitle: e.target.value })} />
                    <input className="input" placeholder="Duration" value={adminForm.duration} onChange={(e) => setAdminForm({ ...adminForm, duration: e.target.value })} />
                    <input className="input" placeholder="Price from" value={adminForm.priceFrom} onChange={(e) => setAdminForm({ ...adminForm, priceFrom: e.target.value })} />
                    <input className="input" placeholder="Image URL" value={adminForm.image} onChange={(e) => setAdminForm({ ...adminForm, image: e.target.value })} />
                    <textarea className="input" rows="3" placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })} />
                    <input className="input" placeholder="Highlights (comma separated)" value={adminForm.highlights} onChange={(e) => setAdminForm({ ...adminForm, highlights: e.target.value })} />
                    <input className="input" placeholder="Offer (e.g. 10% off, Free candle light dinner)" value={adminForm.offer || ""} onChange={(e) => setAdminForm({ ...adminForm, offer: e.target.value })} />
                    <input className="input" placeholder="Tags (comma separated)" value={adminForm.tags} onChange={(e) => setAdminForm({ ...adminForm, tags: e.target.value })} />
                  </>
                ) : ["family", "ltc", "group"].includes(adminTab) ? (
                  <>
                    <input className="input" placeholder="Title" value={adminForm.title} onChange={(e) => setAdminForm({ ...adminForm, title: e.target.value })} />
                    <input className="input" placeholder="Subtitle" value={adminForm.subtitle} onChange={(e) => setAdminForm({ ...adminForm, subtitle: e.target.value })} />
                    <input className="input" placeholder="Duration" value={adminForm.duration} onChange={(e) => setAdminForm({ ...adminForm, duration: e.target.value })} />
                    <input className="input" placeholder="Price from" value={adminForm.priceFrom} onChange={(e) => setAdminForm({ ...adminForm, priceFrom: e.target.value })} />
                    <input className="input" placeholder="Image URL" value={adminForm.image} onChange={(e) => setAdminForm({ ...adminForm, image: e.target.value })} />
                    <textarea className="input" rows="3" placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })} />
                    <input className="input" placeholder="Highlights (comma separated)" value={adminForm.highlights} onChange={(e) => setAdminForm({ ...adminForm, highlights: e.target.value })} />
                    <input className="input" placeholder="Tags (comma separated)" value={adminForm.tags} onChange={(e) => setAdminForm({ ...adminForm, tags: e.target.value })} />
                  </>
                ) : (
                  <>
                    <input className="input" placeholder="Title" value={adminForm.title} onChange={(e) => setAdminForm({ ...adminForm, title: e.target.value })} />
                    <input className="input" placeholder="Duration" value={adminForm.duration} onChange={(e) => setAdminForm({ ...adminForm, duration: e.target.value })} />
                    <input className="input" placeholder="Category" value={adminForm.category} onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value })} />
                    <input className="input" placeholder="Price from" value={adminForm.priceFrom} onChange={(e) => setAdminForm({ ...adminForm, priceFrom: e.target.value })} />
                    <input className="input" placeholder="Location" value={adminForm.location} onChange={(e) => setAdminForm({ ...adminForm, location: e.target.value })} />
                    <input className="input" placeholder="Image URL" value={adminForm.image} onChange={(e) => setAdminForm({ ...adminForm, image: e.target.value })} />
                    <textarea className="input" rows="3" placeholder="Description" value={adminForm.description} onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })} />
                    <input className="input" placeholder="Tags (comma separated)" value={adminForm.tags} onChange={(e) => setAdminForm({ ...adminForm, tags: e.target.value })} />
                  </>
                )}

                <button className="cta block" type="submit" style={{ marginTop: 4 }}>{adminForm._id ? "Update" : "Create"}</button>
                {adminForm._id && <button className="ghost block" type="button" onClick={() => setAdminForm(emptyForms[adminTab])}>Cancel Edit</button>}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
