function downloadComplaintPDF(c) {
  const w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <title>Complaint - ${c.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
          h1 { font-size: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
          .row { margin: 12px 0; }
          .label { font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>CivicAI — Formal Complaint</h1>
        <div class="row"><span class="label">Complaint ID:</span> ${c.id}</div>
        <div class="row"><span class="label">Department:</span> ${c.department}</div>
        <div class="row"><span class="label">Category:</span> ${c.category}</div>
        <div class="row"><span class="label">Priority:</span> ${c.priority}</div>
        <div class="row"><span class="label">Estimated Resolution:</span> ${c.estimatedResolution}</div>
        <div class="row"><span class="label">Status:</span> ${c.status}</div>
        <div class="row"><span class="label">Formal Complaint:</span><br/>${c.formalComplaint}</div>
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
}

function emailComplaint(c) {
  const subject = encodeURIComponent(`Complaint: ${c.category} - ${c.department}`);
  const body = encodeURIComponent(
    `Complaint ID: ${c.id}\nDepartment: ${c.department}\nCategory: ${c.category}\nPriority: ${c.priority}\nEstimated Resolution: ${c.estimatedResolution}\n\n${c.formalComplaint}`
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

const STATUS_FLOW = ["Registered", "Under Review", "In Progress", "Resolved"];

function nextStatus(current) {
  const idx = STATUS_FLOW.indexOf(current);
  return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : current;
}

export default function ComplaintTracker({ complaints, setComplaints }) {
  if (!complaints.length) return null;

  function advanceStatus(id) {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: nextStatus(c.status) } : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  }

  const stats = {
    total: complaints.length,
    high: complaints.filter((c) => c.priority === "High").length,
    medium: complaints.filter((c) => c.priority === "Medium").length,
    low: complaints.filter((c) => c.priority === "Low").length,
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Complaint Tracker</h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{stats.high}</p>
          <p className="text-xs text-slate-500">High</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
          <p className="text-xs text-slate-500">Medium</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.low}</p>
          <p className="text-xs text-slate-500">Low</p>
        </div>
      </div>

      {complaints.map((c) => (
        <div key={c.id} className="bg-slate-900 p-3 rounded-lg mb-2">
          <div className="flex justify-between items-start gap-2">
            <p className="font-semibold">{c.department} — {c.priority}</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => emailComplaint(c)}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
              >
                Email
              </button>
              <button
                onClick={() => downloadComplaintPDF(c)}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-400">{c.formalComplaint}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-blue-400">Status: {c.status}</p>
            {c.status !== "Resolved" && (
              <button
                onClick={() => advanceStatus(c.id)}
                className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-2 py-1 rounded"
                title="Admin: advance status"
              >
                Advance Status →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
