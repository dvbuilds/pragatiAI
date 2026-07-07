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

export default function ComplaintTracker({ complaints }) {
  if (!complaints.length) return null;
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Complaint Tracker</h2>
      {complaints.map((c) => (
        <div key={c.id} className="bg-slate-900 p-3 rounded-lg mb-2">
          <div className="flex justify-between items-start">
            <p className="font-semibold">{c.department} — {c.priority}</p>
            <button
              onClick={() => downloadComplaintPDF(c)}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
            >
              Download PDF
            </button>
          </div>
          <p className="text-sm text-slate-400">{c.formalComplaint}</p>
          <p className="text-xs text-blue-400 mt-1">Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
}
