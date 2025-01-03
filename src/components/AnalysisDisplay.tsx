export default function AnalysisDisplay({ analysis }: { analysis: string }) {
  return (
    <div className="rounded-lg bg-blue-50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-blue-900">AI Analysis</h2>
      <div className="bg-gray-100 p-4 rounded prose max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
        {analysis}
      </div>
      <p className="mt-4 leading-relaxed text-blue-800">
        Keep honing your strategies and may favorable winds guide your future battles!
      </p>
    </div>
  );
}
