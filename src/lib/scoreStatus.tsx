export function getStatus(score: number, shouldApply: boolean) {
  if (!shouldApply) {
    return {
      color: "text-red-500",
      message:
        "✘ Compatibility concerns: recommended to improve before applying.",
    };
  }

  if (score >= 85) {
    return {
      color: "text-green-500",
      message: "✔ High compatibility: you should definitely apply.",
    };
  } else if (score >= 70) {
    return {
      color: "text-yellow-400",
      message: "⚠ Good compatibility: worth applying, but review the details.",
    };
  } else if (score >= 50) {
    return {
      color: "text-orange-400",
      message: "❌ Low compatibility: consider improving your profile first.",
    };
  } else {
    return {
      color: "text-red-600",
      message: "✘ Not recommended: there are significant gaps for this role.",
    };
  }
}
