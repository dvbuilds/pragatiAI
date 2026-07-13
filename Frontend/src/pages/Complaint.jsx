import React from "react";
// Single-page Complaints & Grievances screen.
// NOTE: Class names use a Material 3 token system (bg-surface-container-lowest,
// text-on-tertiary-container, etc.). Ensure those tokens are defined in your
// Tailwind theme, and include Material Symbols in your document <head>:
//   <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" />
export default function Complaint() {
  const complaints = [
    {
      id: "#PR-8291",
      title: "Pothole repair required on MG Road",
      meta: "Infrastructure • Ward 12",
      date: "Oct 24, 2023",
      status: "in_progress",
    },
    {
      id: "#PR-8288",
      title: "Water supply interruption since 48h",
      meta: "Utilities • Ward 05",
      date: "Oct 23, 2023",
      status: "urgent",
    },
    {
      id: "#PR-8275",
      title: "Garbage collection delay reported",
      meta: "Sanitation • Ward 09",
      date: "Oct 22, 2023",
      status: "resolved",
    },
    {
      id: "#PR-8260",
      title: "Street light flickering near Metro Station",
      meta: "Public Safety • Ward 12",
      date: "Oct 21, 2023",
      status: "pending",
    },
  ];
  const renderStatus = (status) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container"></span>
            In Progress
          </span>
        );
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-on-error-container"></span>
            Urgent
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            Resolved
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
            Pending
          </span>
        );
    }
  };
  return (
    <div className="bg-background text-on-background min-h-screen">
      <main className="ml-64 min-h-screen flex flex-col">
        <div className="p-10 max-w-7xl mx-auto w-full flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-display-lg-mobile md:text-headline-md font-black text-primary tracking-tight">
                Complaints &amp; Grievances
              </h2>
              <p className="text-on-surface-variant mt-1 max-w-xl">
                Monitor, manage, and resolve citizen issues across all municipal departments with AI-assisted prioritization.
              </p>
            </div>
            <button className="bg-on-tertiary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(13,148,136,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(13,148,136,0.5)] transition-all active:scale-95 group">
              <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
              New Complaint
            </button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32">
              <span className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">Total Filed</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-primary">1,284</span>
                <span className="text-on-tertiary-container text-xs font-bold bg-on-tertiary-container/10 px-2 py-1 rounded-full">+12%</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32">
              <span className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">In Progress</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-primary">412</span>
                <div className="w-16 h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-on-tertiary-container"></div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32">
              <span className="text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider">Resolved</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-primary">856</span>
                <span
                  className="material-symbols-outlined text-on-tertiary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>
            <div className="bg-tertiary-container p-6 rounded-xl border border-on-tertiary-container/20 shadow-xl flex flex-col justify-between h-32 relative overflow-hidden group">
              <span className="text-tertiary-fixed text-label-sm font-semibold uppercase tracking-wider relative z-10">AI Optimization</span>
              <div className="flex items-end justify-between relative z-10">
                <span className="text-3xl font-black text-tertiary-fixed">88%</span>
                <span className="text-[10px] text-tertiary-fixed-dim bg-white/10 px-2 py-1 rounded-md backdrop-blur-md">Efficiency Up</span>
              </div>
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-6 border-b border-outline-variant">
            <div className="flex gap-8">
              <button className="pb-4 text-label-sm font-bold border-b-2 border-on-tertiary-container text-on-surface transition-all">All Complaints</button>
              <button className="pb-4 text-label-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Active</button>
              <button className="pb-4 text-label-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Pending Action</button>
              <button className="pb-4 text-label-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Resolved</button>
            </div>
            <div className="flex items-center gap-2 pb-4">
              <span className="text-body-md text-on-surface-variant">Sort by:</span>
              <select className="bg-transparent border-none text-label-sm font-bold focus:ring-0 cursor-pointer">
                <option>Newest First</option>
                <option>Priority (AI)</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>
          {/* Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Complaint ID</th>
                  <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Summary</th>
                  <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Date Submitted</th>
                  <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5 font-bold text-on-surface">{c.id}</td>
                    <td className="px-6 py-5">
                      <div className="max-w-xs">
                        <p className="text-body-md font-semibold text-on-surface truncate">{c.title}</p>
                        <p className="text-[12px] text-on-surface-variant/80 mt-1">{c.meta}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant text-body-md">{c.date}</td>
                    <td className="px-6 py-5">{renderStatus(c.status)}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors active:scale-95 text-on-surface-variant group-hover:text-on-tertiary-container">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <p className="text-label-sm text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">1-4</span> of 1,284 complaints
              </p>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                  disabled
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          {/* AI Insight */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-on-tertiary-container/5 to-white border border-on-tertiary-container/10 flex items-start gap-6 relative overflow-hidden group">
            <div className="p-3 rounded-full bg-on-tertiary-container text-white shrink-0 shadow-lg relative z-10">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="relative z-10">
              <h4 className="text-body-lg font-black text-on-tertiary-container tracking-tight mb-2">Pragati AI Insight</h4>
              <p className="text-on-surface-variant text-body-md leading-relaxed max-w-2xl">
                Based on complaint trends in <span className="font-bold">Ward 12</span>, there is a 14% increase in public infrastructure reports this week. I recommend relocating Maintenance Team B to the Metro corridor for faster resolution.
              </p>
              <div className="mt-4 flex gap-4">
                <button className="text-on-tertiary-container font-bold text-label-sm flex items-center gap-1 hover:underline underline-offset-4">
                  Optimize Resource Allocation
                  <span className="material-symbols-outlined text-sm">north_east</span>
                </button>
                <button className="text-on-surface-variant font-bold text-label-sm hover:text-on-surface">Dismiss</button>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-on-tertiary-container/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        </div>
      </main>
      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-on-tertiary-container transition-all active:scale-90 z-50 group">
        <span className="material-symbols-outlined">support_agent</span>
        <span className="absolute right-full mr-4 bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
          Support Center
        </span>
      </button>
    </div>
  );
}
