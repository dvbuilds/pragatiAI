import { NEARBY_OFFICES } from "../data/staticData";

export default function NearbyOffices() {
  return (
    <div className="mt-6 pt-6 border-t border-slate-800">
      <h2 className="text-sm font-bold text-slate-400 mb-2">Nearby Government Offices</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {NEARBY_OFFICES.map((o) => (
          <div key={o.name} className="bg-slate-900 rounded-lg px-3 py-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{o.name}</p>
              <p className="text-xs text-slate-500">{o.type}</p>
            </div>
            <span className="text-xs text-blue-400">{o.distance}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
