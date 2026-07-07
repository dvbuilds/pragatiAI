export default function ResultView({ result }) {
  if (!result) return null;
  return (
    <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
