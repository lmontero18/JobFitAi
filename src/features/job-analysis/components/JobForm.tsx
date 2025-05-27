"use client";

import { useState } from "react";
import ResultPlaceholder from "./ResultPlaceholder";
import { EncryptButton } from "@/shared/components/EncryptButton";

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export default function JobForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [cv, setCv] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCv(data.text);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleAnalyze = async () => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, cv }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      setShowResult(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong during analysis.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl space-y-10">
        <h1 className="text-4xl md:text-5xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-600">
          🧠 Job Fit AI
        </h1>
        <p className="text-center text-neutral-400 text-sm md:text-base">
          Analyze your resume against any job description using AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              📝 Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
              className="w-full bg-neutral-800 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                📄 Resume Parse
              </h2>
              <textarea
                value={cv}
                readOnly
                rows={10}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl p-4 text-sm text-gray-300 resize-none max-h-64 overflow-y-auto"
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 min-h-[440px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Analysis Result
            </h2>
            {showResult && analysis ? (
              <ResultPlaceholder analysis={analysis} />
            ) : (
              <p className="text-sm text-neutral-400">No analysis yet</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <label className="w-full sm:w-auto bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-center cursor-pointer">
            Upload CV
            <input
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              hidden
            />
          </label>

          <EncryptButton
            className="w-full sm:w-auto"
            onClick={() => {
              if (!jobDescription || !cv) {
                alert("Please fill in both the job description and CV.");
                return;
              }
            }}
            onSuccess={handleAnalyze}
          />
        </div>
      </div>
    </div>
  );
}
