import { EMERGENCY_CONTACTS } from "../data/staticData";

export default function EmergencyContacts() {
  return (
    <div className="mt-10 pt-6 border-t border-slate-800">
      <h2 className="text-sm font-bold text-slate-400 mb-2">Emergency Contacts</h2>
      <div className="flex flex-wrap gap-2">
        {EMERGENCY_CONTACTS.map((e) => (
          <span key={e.name} className="text-xs bg-slate-900 px-3 py-1 rounded-full">
            {e.name}: <span className="text-blue-400 font-semibold">{e.number}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
