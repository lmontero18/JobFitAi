"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import ResultPlaceholder from "./ResultPlaceholder";
import { Delete } from "@/shared/components/icons/Delete";
import { LoadingButton } from "@/shared/components/LoadingButton";
import mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = workerSrc;

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  shouldApply: boolean;
  feedback: string;
}

export default function JobForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [cv, setCv] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();

          const strings = content.items
            .filter((item): item is TextItem => "str" in item)
            .map((item) => item.str);

          extractedText += strings.join(" ") + "\n\n";
        }

        setCv(extractedText.trim());
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setCv(value.trim());
      } else {
        alert("Only PDF and DOCX files are supported.");
      }
    } catch (err) {
      console.error("Error extracting file:", err);
      alert("Failed to read the file.");
    } finally {
      setIsUploading(false);
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

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
      setShowResult(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleReset = () => {
    setJobDescription("");
    setCv("");
    setAnalysis(null);
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl md:text-5xl text-center font-bold">
          🧠 Job Fit AI
        </h1>
        <p className="text-center text-neutral-400 text-sm md:text-base">
          Analyze your resume against any job description using AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">📝 Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
              className="w-full bg-neutral-800 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <h2 className="text-lg font-semibold">📄 Your Resume</h2>
            <p className="text-xs text-neutral-400 mb-2">
              Supported formats: PDF, DOCX
            </p>
            <textarea
              value={cv}
              readOnly
              rows={10}
              className="w-full bg-neutral-800 border border-white/10 rounded-xl p-4 text-sm text-gray-300 resize-none max-h-64 overflow-y-auto"
            />
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 min-h-[440px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">📊 Analysis Result</h2>
              {showResult && (
                <div
                  onClick={handleReset}
                  title="Clear analysis"
                  className="cursor-pointer hover:text-red-400"
                >
                  <Delete />
                </div>
              )}
            </div>

            {showResult && analysis ? (
              <ResultPlaceholder analysis={analysis} />
            ) : (
              <p className="text-sm text-neutral-400">No analysis yet</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <LoadingButton
            className="w-full sm:w-auto"
            validate={() => false}
            onClick={triggerFilePicker}
            loading={isUploading}
            onSuccess={() => {}}
          >
            Upload CV
          </LoadingButton>

          <input
            type="file"
            accept=".pdf, .doc, .docx"
            ref={fileInputRef}
            onChange={handleFileUpload}
            hidden
          />

          <LoadingButton
            className="w-full sm:w-auto"
            validate={() => {
              if (!jobDescription || !cv) {
                alert("Please fill in both the job description and CV.");
                return false;
              }
              return true;
            }}
            onSuccess={handleAnalyze}
          />
        </div>
      </div>
    </div>
  );
}
