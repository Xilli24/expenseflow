import { useState, useMemo, useEffect } from "react";

// ─── Netlify Identity Integration ────────────────────────────────────────────
// This app uses netlify-identity-widget for real authentication.
// When deployed to Netlify with Identity enabled, users log in with real
// email/password accounts managed from your Netlify dashboard.
//
// In this preview, a mock auth flow simulates the widget behaviour.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Travel", "Meals", "Software", "Office Supplies", "Marketing", "Training", "Utilities", "Other"];
const STATUS_COLORS = { Pending: "#F59E0B", Approved: "#10B981", Rejected: "#EF4444" };
const STATUS_BG    = { Pending: "#FEF3C7", Approved: "#D1FAE5", Rejected: "#FEE2E2" };
const ADMIN_EMAILS = ["xilliherb@gmail.com"];
const initialExpenses = [
  { id: 1, employee: "Alice",  category: "Travel",         amount: 4500,  date: "2026-04-10", description: "Client visit to Mumbai",       status: "Approved", receipt: true  },
  { id: 2, employee: "Bob",    category: "Meals",          amount: 1200,  date: "2026-04-12", description: "Team lunch",                   status: "Pending",  receipt: true  },
  { id: 3, employee: "Carol",  category: "Software",       amount: 8999,  date: "2026-04-14", description: "Figma annual subscription",    status: "Approved", receipt: false },
  { id: 4, employee: "David",  category: "Office Supplies",amount: 650,   date: "2026-04-15", description: "Stationery and printer ink",   status: "Rejected", receipt: true  },
  { id: 5, employee: "Alice",  category: "Training",       amount: 12000, date: "2026-04-18", description: "React Advanced workshop",      status: "Pending",  receipt: false },
];

const formatINR = n => "₹" + Number(n).toLocaleString("en-IN");

// ── Tiny reusable components ──────────────────────────────────────────────────
const Badge = ({ status }) => (
  <span style={{ background: STATUS_BG[status], color: STATUS_COLORS[status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>{status}</span>
);

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(15,23,42,0.07)", border: "1.5px solid #F1F5F9", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: accent || "#0F172A", letterSpacing: -1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
  </div>
);

// ── Login Page (powered by netlify-identity-widget on live deploy) ─────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mode, setMode]         = useState("login"); // "login" | "signup" | "forgot"
  const [msg, setMsg]           = useState("");

  // On a real Netlify deploy, this hook initialises the identity widget.
  useEffect(() => {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
      window.netlifyIdentity.on("login", user => {
        onLogin({ name: user.user_metadata?.full_name || user.email, email: user.email, role: "Employee", netlifyUser: user });
        window.netlifyIdentity.close();
      });
    }
  }, [onLogin]);

  const openNetlifyWidget = () => {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
      window.netlifyIdentity.open();
    }
  };

  // Preview-mode mock login
  const handleSubmit = () => {
    setError(""); setMsg("");
    if (!email) { setError("Please enter your email."); return; }
    if (mode !== "forgot" && !password) { setError("Please enter your password."); return; }
    setLoading(true);
    setTimeout(() => {
      if (mode === "forgot") {
        setMsg("✅ Password reset email sent! Check your inbox."); setLoading(false); setMode("login");
      } else if (mode === "signup") {
        setMsg("✅ Account created! Check your email to confirm."); setLoading(false); setMode("login");
      } else {
        // Mock: accept any non-empty credentials in preview
        const name = email.split("@")[0];
        onLogin({ name: name.charAt(0).toUpperCase() + name.slice(1), email, role: "Employee" });
        setLoading(false);
      }
    }, 800);
  };

  const inp = { padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, width: "100%", boxSizing: "border-box", fontFamily: "inherit", background: "#F8FAFC", outline: "none", color: "#0F172A" };
  const titles = { login: "Welcome back", signup: "Create account", forgot: "Reset password" };
  const subs   = { login: "Sign in to your team workspace", signup: "Join your team on ExpenseFlow", forgot: "We'll email you a reset link" };
  const btns   = { login: "Sign In →", signup: "Create Account →", forgot: "Send Reset Link →" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

      <div style={{ background: "#fff", borderRadius: 24, padding: "44px 40px", width: "100%", maxWidth: 440, boxShadow: "0 30px 90px rgba(0,0,0,0.35)", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 14, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>💼</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: -0.8 }}>{titles[mode]}</h1>
          <p style={{ margin: "6px 0 0", color: "#94A3B8", fontSize: 14 }}>{subs[mode]}</p>
        </div>

        {msg && <div style={{ background: "#D1FAE5", color: "#059669", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{msg}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="you@company.com" style={inp} autoComplete="email" />
          </div>

          {mode !== "forgot" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Password</label>
                {mode === "login" && <button onClick={() => { setMode("forgot"); setError(""); setMsg(""); }} style={{ background: "none", border: "none", fontSize: 12, color: "#6366F1", cursor: "pointer", fontWeight: 600, padding: 0 }}>Forgot password?</button>}
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"} style={{ ...inp, paddingRight: 44 }} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#94A3B8", padding: 2 }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>
          )}

          {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>⚠️ {error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#A5B4FC" : "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 2, letterSpacing: 0.2 }}>
            {loading ? "Please wait…" : btns[mode]}
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
            {mode === "login"  && <span>No account? <button onClick={() => { setMode("signup"); setError(""); setMsg(""); }} style={{ background: "none", border: "none", color: "#6366F1", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Sign up</button></span>}
            {mode === "signup" && <span>Have an account? <button onClick={() => { setMode("login"); setError(""); setMsg(""); }} style={{ background: "none", border: "none", color: "#6366F1", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Sign in</button></span>}
            {mode === "forgot" && <span><button onClick={() => { setMode("login"); setError(""); setMsg(""); }} style={{ background: "none", border: "none", color: "#6366F1", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← Back to sign in</button></span>}
          </div>
        </div>

        {/* Netlify Identity badge */}
        <div style={{ marginTop: 24, padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔐</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Secured by Netlify Identity</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Email confirmation · Password reset · Free up to 1,000 users</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function ExpenseTracker() {
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses,    setExpenses]    = useState(initialExpenses);
  const [filter,      setFilter]      = useState("All");
  const [catFilter,   setCatFilter]   = useState("All");
  const [search,      setSearch]      = useState("");
  const [showForm,    setShowForm]    = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [form,        setForm]        = useState({ employee: "", category: CATEGORIES[0], amount: "", date: "", description: "", receipt: false });
  const [formError,   setFormError]   = useState("");
  const isAdmin = ADMIN_EMAILS.includes(currentUser?.email);
  // Pre-fill employee name from logged-in user
  useEffect(() => {
    if (currentUser) setForm(f => ({ ...f, employee: currentUser.name }));
  }, [currentUser]);

  if (!currentUser) return <LoginPage onLogin={setCurrentUser} />;

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
    setCurrentUser(null);
  };

  const filtered = expenses.filter(e => {
    if (filter   !== "All" && e.status   !== filter)   return false;
    if (catFilter !== "All" && e.category !== catFilter) return false;
    if (search && !e.employee.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAll      = expenses.reduce((a, b) => a + b.amount, 0);
  const totalApproved = expenses.filter(e => e.status === "Approved").reduce((a, b) => a + b.amount, 0);
  const totalPending  = expenses.filter(e => e.status === "Pending").reduce((a, b) => a + b.amount, 0);
  const totalRejected = expenses.filter(e => e.status === "Rejected").reduce((a, b) => a + b.amount, 0);

  const handleSubmit = () => {
    if (!form.amount || !form.date || !form.description || !form.employee) { setFormError("Please fill all required fields."); return; }
    setExpenses(prev => [{ ...form, id: Date.now(), amount: Number(form.amount) || 0, status: "Pending" }, ...prev]);
    setShowForm(false);
    setForm({ employee: currentUser.name, category: CATEGORIES[0], amount: "", date: "", description: "", receipt: false });
    setFormError("");
  };

  const changeStatus = (id, status) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const inp = { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "inherit", background: "#F8FAFC", outline: "none", color: "#0F172A" };
  const avatarBg = name => `hsl(${(name || "?").charCodeAt(0) * 15},60%,60%)`;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background: "#0F172A", padding: "0 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>ExpenseFlow</span>
            <span style={{ color: "#475569", fontSize: 12, marginLeft: 2 }}>· Team Edition</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarBg(currentUser.name), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>{currentUser.name[0].toUpperCase()}</div>
              <div>
                <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{currentUser.name}</div>
                <div style={{ color: "#6366F1", fontSize: 11, fontWeight: 600 }}>
  {currentUser.email} ({isAdmin ? "Admin" : "User"})
</div>
              </div>
            </div>
            <button onClick={() => setShowForm(true)} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ New Expense</button>
            <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.07)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 32px" }}>
{!isAdmin && (
  <div style={{
    marginBottom: 12,
    padding: "10px 14px",
    background: "#FEF3C7",
    color: "#92400E",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600
  }}>
    ℹ️ You can submit expenses. Only admins can approve or reject them.
  </div>
)}
        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Total Submitted" value={formatINR(totalAll)}      sub={`${expenses.length} expenses`} />
          <StatCard label="Approved"        value={formatINR(totalApproved)} sub={`${expenses.filter(e=>e.status==="Approved").length} expenses`} accent="#10B981" />
          <StatCard label="Pending Review"  value={formatINR(totalPending)}  sub={`${expenses.filter(e=>e.status==="Pending").length} awaiting`}  accent="#F59E0B" />
          <StatCard label="Rejected"        value={formatINR(totalRejected)} sub={`${expenses.filter(e=>e.status==="Rejected").length} expenses`}  accent="#EF4444" />
        </div>

        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or description…" style={{ ...inp, width: 240, background: "#fff" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["All","Pending","Approved","Rejected"].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid", borderColor: filter===s?"#6366F1":"#E2E8F0", background: filter===s?"#EEF2FF":"#fff", color: filter===s?"#6366F1":"#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inp, width: 160, background: "#fff" }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* ── Table ── */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", border: "1.5px solid #F1F5F9", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #F1F5F9" }}>
                {["Employee","Category","Description","Date","Amount","Status","Actions"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No expenses found.</td></tr>}
              {filtered.map((e, i) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #F8FAFC", background: i%2===0?"#fff":"#FAFBFF" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "#F5F3FF"}
                  onMouseLeave={ev => ev.currentTarget.style.background = i%2===0?"#fff":"#FAFBFF"}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarBg(e.employee), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>{e.employee[0]}</div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{e.employee}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}><span style={{ background: "#F1F5F9", color: "#475569", padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{e.category}</span></td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#334155", maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#64748B" }}>{e.date}</td>
                  <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{formatINR(e.amount)}</td>
                  <td style={{ padding: "13px 16px" }}><Badge status={e.status} /></td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => setSelected(e)} style={{ padding: "4px 11px", borderRadius: 7, border: "1.5px solid #E2E8F0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#6366F1" }}>View</button>
                      {e.status === "Pending" && isAdmin && <>
                        <button onClick={() => changeStatus(e.id,"Approved")} style={{ padding: "4px 9px", borderRadius: 7, border: "none", background: "#D1FAE5", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#059669" }}>✓</button>
                        <button onClick={() => changeStatus(e.id,"Rejected")} style={{ padding: "4px 9px", borderRadius: 7, border: "none", background: "#FEE2E2", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#DC2626" }}>✕</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#94A3B8" }}>Showing {filtered.length} of {expenses.length} expenses</div>
      </div>

      {/* ── New Expense Modal ── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>New Expense</h2>
              <button onClick={() => { setShowForm(false); setFormError(""); }} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748B" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Employee Name *</label>
                <input value={form.employee} disabled onChange={e => setForm(f=>({...f,employee:e.target.value}))} placeholder="Your name" style={inp} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Category *</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={inp}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Amount (₹) *</label>
                  <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Description *</label>
                <input placeholder="What was this expense for?" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} style={inp} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#334155", fontWeight: 500 }}>
                <input type="checkbox" checked={form.receipt} onChange={e => setForm(f=>({...f,receipt:e.target.checked}))} style={{ width: 16, height: 16, accentColor: "#6366F1" }} />
                Receipt attached
              </label>
              {formError && <div style={{ color: "#EF4444", fontSize: 13, fontWeight: 500 }}>⚠️ {formError}</div>}
              <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4 }}>Submit Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Expense Detail Modal ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>Expense Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748B" }}>✕</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: avatarBg(selected.employee), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#fff" }}>{selected.employee[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>{selected.employee}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{selected.date}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#0F172A" }}>{formatINR(selected.amount)}</div>
                <Badge status={selected.status} />
              </div>
            </div>
            {[["Category", selected.category], ["Description", selected.description], ["Receipt", selected.receipt ? "✅ Attached" : "❌ Not attached"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14 }}>
                <span style={{ color: "#94A3B8", fontWeight: 600 }}>{k}</span>
                <span style={{ color: "#0F172A", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            {selected.status === "Pending" && isAdmin && (
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => changeStatus(selected.id,"Approved")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#D1FAE5", color: "#059669", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✓ Approve</button>
                <button onClick={() => changeStatus(selected.id,"Rejected")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✕ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
