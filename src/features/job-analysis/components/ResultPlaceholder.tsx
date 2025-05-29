"use client";

import { motion } from "framer-motion";
import { getStatus } from "@/lib/scoreStatus";

type AnalysisResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  shouldApply: boolean;
  feedback: string;
};

type Props = {
  analysis: AnalysisResult;
};

export default function ResultPlaceholder({ analysis }: Props) {
  const { color, message } = getStatus(analysis.score, analysis.shouldApply);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 text-white p-6"
    >
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        🎯 Compatibility Score:{" "}
        <span className={`text-2xl ${color}`}>{analysis.score}%</span>
      </h2>

      <p className={`text-sm font-medium ${color}`}>{message}</p>

      <div>
        <h3 className="font-semibold text-white mb-1">✅ Strengths</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-white">
          {analysis.strengths.map((item, i) => (
            <li key={`strength-${i}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-1">⚠️ Weaknesses</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-white">
          {analysis.weaknesses.map((item, i) => (
            <li key={`weakness-${i}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-1">💡 Recommendations</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-white">
          {analysis.recommendations.map((item, i) => (
            <li key={`recommendation-${i}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-1">
          📌 Final Recommendation
        </h3>
        <p
          className={`text-sm font-medium ${
            analysis.shouldApply ? "text-green-400" : "text-red-500"
          }`}
        >
          {analysis.feedback}
        </p>
      </div>
    </motion.div>
  );
}
