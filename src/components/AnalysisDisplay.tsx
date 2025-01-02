export default function AnalysisDisplay({ analysis }: { analysis: string }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">AI Analysis</h2>
        <div className="bg-gray-100 p-4 rounded prose max-w-none">
          {analysis}
        </div>
      </div>
    );
  }