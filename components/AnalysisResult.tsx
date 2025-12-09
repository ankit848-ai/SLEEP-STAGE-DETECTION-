import React from "react";
import { AnalysisResult } from "../types";

interface Props {
  result: AnalysisResult | null;
  onRegenerate: () => void;
}

const AnalysisResultView: React.FC<Props> = ({ result, onRegenerate }) => {
  if (!result) {
    return (
      <div className="text-gray-400 text-center mt-10">
        No analysis yet. Upload data and click "Analyze Sleep".
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 mt-10 border border-gray-700">
      
      <h2 className="text-2xl font-bold text-white">Sleep Analysis Results</h2>

      {/* Summary */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Summary</h3>
        <p className="text-gray-200 mt-1">{result.summary}</p>
      </div>

      {/* Sleep Score */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Sleep Quality Score</h3>
        <p className="text-gray-200 mt-1 text-3xl font-bold">{result.score}/100</p>
      </div>

      {/* Environment Analysis */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Environment Analysis</h3>
        <p className="text-gray-200 mt-1">{result.environmentAnalysis}</p>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Stage Timeline</h3>
        <div className="mt-2 space-y-1">
          {result.timeline.map((item, i) => (
            <p key={i} className="text-gray-300">
              <strong>{item.time}</strong> — {item.stage} ({item.description})
            </p>
          ))}
        </div>
      </div>

      {/* Disruptions */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Disruptions Detected</h3>
        {result.disruptions.length === 0 ? (
          <p className="text-gray-400 mt-1">No major disruptions detected.</p>
        ) : (
          <ul className="list-disc pl-5 mt-2 text-gray-300">
            {result.disruptions.map((d, i) => (
              <li key={i}>
                <strong>{d.time}</strong>: {d.cause} — {d.impact}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Recommendations</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-300">
          {result.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      {/* Visualization Chart */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300">Visualization Chart</h3>
        <pre className="bg-black text-green-400 p-4 mt-2 rounded-lg overflow-auto whitespace-pre-wrap">
{result.chart || "No chart generated."}
        </pre>
      </div>

      {/* Regenerate */}
      <button
        onClick={onRegenerate}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Regenerate Analysis
      </button>
    </div>
  );
};

export default AnalysisResultView;
