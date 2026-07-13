import React from "react";
function Icon({ name, className = "", fill = false, style }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "description", label: "Document", active: true, fill: true },
  { icon: "public", label: "Public Portal" },
  { icon: "account_balance", label: "Government Schemes" },
  { icon: "assessment", label: "Reports" },
  { icon: "report_problem", label: "Complains" },
];
const quickGuides = [
  {
    icon: "child_care",
    title: "Birth Certificate",
    sub: "Full application process",
    bg: "var(--color-p-tertiary-fixed-dim)",
    fg: "var(--color-p-on-tertiary-fixed)",
  },
  {
    icon: "fingerprint",
    title: "Update Aadhaar",
    sub: "Change address or photo",
    bg: "var(--color-p-secondary-fixed)",
    fg: "var(--color-p-on-secondary-fixed)",
  },
  {
    icon: "shopping_basket",
    title: "Ration Card",
    sub: "Apply for new card",
    bg: "var(--color-p-primary-fixed)",
    fg: "var(--color-p-on-primary-fixed)",
  },
  {
    icon: "payments",
    title: "Income Certificate",
    sub: "Verification requirements",
    bg: "var(--color-p-tertiary-fixed)",
    fg: "var(--color-p-on-tertiary-fixed)",
  },
];
export default function DocumentPage() {
  return (
    <div
      className="flex h-screen overflow-hidden font-body"
      style={{
        background: "var(--color-p-surface)",
        color: "var(--color-p-on-background)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        .ai-gradient-border { position: relative; background: #ffffff; border-radius: 1rem; }
        .ai-gradient-border::before {
          content: ""; position: absolute; inset: -1px; border-radius: 1.05rem; padding: 1px;
          background: linear-gradient(to right, #0d9488, #3b82f6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
        .p-scroll::-webkit-scrollbar { width: 6px; }
        .p-scroll::-webkit-scrollbar-thumb { background: #e0e3e5; border-radius: 10px; }
      `}</style>
      {/* SIDEBAR */}
      <aside
        className="hidden md:flex flex-col h-full w-72 py-6 px-4 gap-2 z-30 shadow-sm border-r"
        style={{
          background: "var(--color-p-surface-container-low)",
          borderColor: "var(--color-p-outline-variant)",
        }}
      >
        <div className="flex items-center gap-3 px-2 mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2"
            style={{
              background: "var(--color-p-primary)",
              boxShadow: "0 0 0 2px var(--color-p-primary-fixed)",
            }}
          >
            <img
              className="w-full h-full object-cover"
              alt="Pragati AI logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHEjcc-vxb4xKsnZCFac9OP4PUGqIy3MmuI3QlWAZzREx0m5NW4yC_dd5C-rbINPWCR52ppWnsE1EVsdTybYEFrgWZQH8PY9qU26uO_xlhSLeKFtQcz8KjXyPjU5-eh-DlsSey5n8yt8N5c9LuHTF9c7_Etynt_7JIuuKcm7FnGfi2Zk39AnlBIryR4qmBqWP8Bum0JNu1shfebA3-MJ-NctxUbmHXrNPV2NMT-n1Zy83BUoB2CnIMVg"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: "var(--color-p-primary)" }}>
              Pragati AI
            </h1>
            <p
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--color-p-on-surface-variant)" }}
            >
              Government Service Portal
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 active:scale-95"
              style={
                item.active
                  ? {
                      background: "var(--color-p-secondary-container)",
                      color: "var(--color-p-on-secondary-container)",
                      fontWeight: 600,
                    }
                  : { color: "var(--color-p-on-surface-variant)" }
              }
            >
              <Icon name={item.icon} fill={item.fill} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div
          className="mt-auto pt-6 border-t space-y-1"
          style={{ borderColor: "var(--color-p-outline-variant)" }}
        >
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
            style={{ color: "var(--color-p-on-surface-variant)" }}
          >
            <Icon name="settings" />
            <span className="font-medium">Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
            style={{ color: "var(--color-p-on-surface-variant)" }}
          >
            <Icon name="logout" />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>
      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: "var(--color-p-surface)" }}>
        {/* Top App Bar */}
        <header
          className="border-b z-20"
          style={{
            background: "var(--color-p-surface)",
            borderColor: "var(--color-p-outline-variant)",
          }}
        >
          <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1280px] mx-auto">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2" style={{ color: "var(--color-p-on-surface-variant)" }}>
                <Icon name="menu" />
              </button>
              <h2 className="text-xl font-bold" style={{ color: "var(--color-p-primary)" }}>
                Document AI Assistant
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="hidden sm:flex items-center rounded-full px-4 py-1.5 border transition-all"
                style={{
                  background: "var(--color-p-surface-container-low)",
                  borderColor: "var(--color-p-outline-variant)",
                }}
              >
                <Icon name="search" className="text-sm" style={{ color: "var(--color-p-outline)" }} />
                <input
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-48 lg:w-64 ml-2"
                  placeholder="Search documents..."
                  style={{ color: "var(--color-p-on-surface)" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full transition-colors hover:opacity-80"
                  style={{ color: "var(--color-p-on-surface-variant)" }}
                >
                  <Icon name="notifications" />
                </button>
                <button
                  className="p-2 rounded-full transition-colors hover:opacity-80"
                  style={{ color: "var(--color-p-on-surface-variant)" }}
                >
                  <Icon name="help" />
                </button>
                <div
                  className="w-8 h-8 rounded-full overflow-hidden border ml-2 cursor-pointer"
                  style={{ borderColor: "var(--color-p-outline-variant)" }}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="User avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpuJSlBzwFH-s_cQvk0f20OFfjCbajLT0SamnwH-svUHqRS360VT29MVrmyWix-jZ4tsjNZ-yo9Q6g1iqtBBfeihP5968Kk_rjfSIChrse-Q2bW65cCdftxDqkMHBwM2gtIiRNY4RwwIB2n4WFU_UE8QZ5IZdMQZN_8JsrDP_IZd9EVxHSjLpDsF18D9RZhOJ8JTnLQzPAahc_ZxYThv6Z_GxJY8zZRi4EIZXiMXT6ELx9y6XUvNTS3Q"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 flex overflow-hidden">
          {/* Center: Chat */}
          <section className="flex-1 flex flex-col min-w-0 h-full relative">
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth p-scroll">
              {/* AI intro */}
              <div className="flex items-start gap-4 max-w-3xl">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-p-on-tertiary-container)" }}
                >
                  <Icon name="auto_awesome" className="text-white text-sm" fill />
                </div>
                <div className="ai-gradient-border p-5 shadow-sm">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-p-on-surface)" }}>
                    Hello! I am your{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-p-on-tertiary-container)" }}
                    >
                      Pragati AI Companion
                    </span>
                    . I can help you find, manage, and apply for government documents.
                  </p>
                  <p className="text-sm mt-2" style={{ color: "var(--color-p-on-surface)" }}>
                    What can I help you with today? You can ask things like "How do I renew my passport?" or
                    "What documents are needed for a Ration Card?"
                  </p>
                </div>
              </div>
              {/* User message */}
              <div className="flex items-start gap-4 max-w-3xl ml-auto flex-row-reverse">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-p-primary-container)" }}
                >
                  <Icon name="person" className="text-white text-sm" />
                </div>
                <div
                  className="p-5 rounded-xl rounded-tr-none shadow-sm"
                  style={{ background: "var(--color-p-surface-container-high)" }}
                >
                  <p className="text-sm" style={{ color: "var(--color-p-on-surface)" }}>
                    I need to apply for a fresh Income Certificate for my scholarship application. What is
                    the process?
                  </p>
                </div>
              </div>
              {/* AI verified answer */}
              <div className="flex items-start gap-4 max-w-3xl">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-p-on-tertiary-container)" }}
                >
                  <Icon name="auto_awesome" className="text-white text-sm" fill />
                </div>
                <div className="ai-gradient-border p-5 shadow-sm">
                  <p
                    className="text-xs mb-2 flex items-center gap-1 font-semibold"
                    style={{ color: "var(--color-p-on-tertiary-container)" }}
                  >
                    <Icon name="verified" style={{ fontSize: 16 }} /> VERIFIED PROCESS
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-p-on-surface)" }}>
                    To apply for an Income Certificate, you will typically need the following:
                  </p>
                  <ul className="mt-3 space-y-2 list-none">
                    {[
                      "Identity Proof (Aadhaar, Voter ID)",
                      "Address Proof (Electricity Bill, Rent Agreement)",
                      "Salary Slips or IT Return (Form 16)",
                    ].map((line) => (
                      <li
                        key={line}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "var(--color-p-on-surface-variant)" }}
                      >
                        <Icon
                          name="check_circle"
                          className="text-sm"
                          style={{ color: "var(--color-p-on-tertiary-container)" }}
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      style={{ background: "var(--color-p-on-tertiary-container)" }}
                    >
                      Apply Now
                    </button>
                    <button
                      className="px-4 py-2 border text-sm font-semibold rounded-lg transition-colors"
                      style={{
                        borderColor: "var(--color-p-outline)",
                        color: "var(--color-p-on-surface)",
                      }}
                    >
                      Download Checklist
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Input */}
            <div
              className="p-6 border-t"
              style={{
                borderColor: "var(--color-p-outline-variant)",
                background: "var(--color-p-surface-bright)",
              }}
            >
              <div className="max-w-4xl mx-auto relative group">
                <div
                  className="relative flex items-center rounded-2xl p-2 pl-6 shadow-sm border transition-all"
                  style={{
                    background: "var(--color-p-surface-container-lowest)",
                    borderColor: "var(--color-p-outline)",
                  }}
                >
                  <textarea
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm resize-none py-2 h-12 leading-tight"
                    placeholder="Ask Pragati AI about any document..."
                    rows={1}
                  />
                  <div className="flex items-center gap-2 px-2">
                    <button
                      className="p-2 hover:opacity-70 transition-colors"
                      style={{ color: "var(--color-p-on-surface-variant)" }}
                    >
                      <Icon name="attach_file" />
                    </button>
                    <button
                      className="p-2 hover:opacity-70 transition-colors"
                      style={{ color: "var(--color-p-on-surface-variant)" }}
                    >
                      <Icon name="mic" />
                    </button>
                    <button
                      className="w-10 h-10 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shadow-lg"
                      style={{ background: "var(--color-p-primary)" }}
                    >
                      <Icon name="send" />
                    </button>
                  </div>
                </div>
              </div>
              <p
                className="text-center text-[10px] mt-3 uppercase tracking-widest font-bold"
                style={{ color: "var(--color-p-outline)" }}
              >
                Confidential &amp; Secure AI Portal
              </p>
            </div>
          </section>
          {/* Right pane */}
          <aside
            className="hidden lg:flex w-80 h-full flex-col p-6 gap-6 overflow-y-auto border-l p-scroll"
            style={{
              background: "var(--color-p-surface-container-low)",
              borderColor: "var(--color-p-outline-variant)",
            }}
          >
            <div>
              <h3
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: "var(--color-p-on-surface-variant)" }}
              >
                Quick Guides
              </h3>
              <div className="space-y-3">
                {quickGuides.map((g) => (
                  <button
                    key={g.title}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left group hover:shadow-md"
                    style={{
                      background: "var(--color-p-surface-container-lowest)",
                      borderColor: "var(--color-p-outline-variant)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: g.bg, color: g.fg }}
                    >
                      <Icon name={g.icon} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-bold leading-tight"
                        style={{ color: "var(--color-p-on-surface)" }}
                      >
                        {g.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-p-on-surface-variant)" }}>
                        {g.sub}
                      </p>
                    </div>
                    <Icon
                      name="chevron_right"
                      className="text-sm"
                      style={{ color: "var(--color-p-outline)" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div
              className="mt-4 p-5 rounded-2xl relative overflow-hidden group"
              style={{ background: "var(--color-p-primary-container)" }}
            >
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"
                style={{ background: "rgba(12,148,136,0.2)" }}
              />
              <h4 className="text-white font-bold mb-2 relative z-10">Smart Vault</h4>
              <p
                className="text-xs leading-relaxed relative z-10"
                style={{ color: "var(--color-p-on-primary-container)" }}
              >
                Keep your documents digitally signed and encrypted with Pragati's Secure Vault.
              </p>
              <button
                className="mt-4 w-full py-2 text-white text-xs font-bold rounded-lg relative z-10 hover:brightness-110"
                style={{ background: "var(--color-p-on-tertiary-container)" }}
              >
                Open Vault
              </button>
            </div>
            <div className="mt-auto">
              <div
                className="rounded-xl p-4 flex items-center justify-between border"
                style={{
                  background: "var(--color-p-surface-container-high)",
                  borderColor: "var(--color-p-outline-variant)",
                }}
              >
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--color-p-on-surface)" }}>
                    Cloud Storage
                  </p>
                  <div
                    className="w-24 h-1.5 rounded-full mt-2 overflow-hidden"
                    style={{ background: "var(--color-p-outline-variant)" }}
                  >
                    <div
                      className="w-3/4 h-full"
                      style={{ background: "var(--color-p-on-tertiary-container)" }}
                    />
                  </div>
                </div>
                <p
                  className="text-[10px] font-bold uppercase tracking-tighter"
                  style={{ color: "var(--color-p-on-surface-variant)" }}
                >
                  7.5 / 10 GB
                </p>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}