"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";

type LoadingButtonProps = {
  onSuccess: () => void | Promise<void>;
  validate: () => boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
};

export const LoadingButton = ({
  onSuccess,
  validate,
  onClick,
  children = "Analyze",
  className = "",
  loading = false,
}: LoadingButtonProps) => {
  const [variant, setVariant] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  const baseStyle =
    "relative rounded-md px-6 py-2 font-medium transition-all text-center";

  const effectiveVariant =
    loading && variant === "neutral" ? "loading" : variant;

  const variantStyle =
    effectiveVariant === "neutral"
      ? "bg-white text-black hover:bg-gray-200"
      : effectiveVariant === "error"
      ? "bg-red-500 text-white"
      : effectiveVariant === "success"
      ? "bg-green-500 text-white"
      : "bg-blue-400 pointer-events-none text-white";

  const handleClick = async () => {
    if (variant !== "neutral" || loading) return;

    onClick?.();

    if (!validate()) return;

    setVariant("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await onSuccess();
      setVariant("success");
    } catch {
      setVariant("error");
    } finally {
      setTimeout(() => {
        setVariant("neutral");
      }, 2000);
    }
  };

  return (
    <motion.button
      disabled={variant !== "neutral" || loading}
      onClick={handleClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      <motion.span
        animate={{
          y: effectiveVariant === "neutral" ? 0 : 6,
          opacity: effectiveVariant === "neutral" ? 1 : 0,
        }}
        className="inline-block"
      >
        {children}
      </motion.span>

      <IconOverlay
        Icon={FiLoader}
        visible={effectiveVariant === "loading"}
        spin
      />
      <IconOverlay Icon={FiX} visible={effectiveVariant === "error"} />
      <IconOverlay Icon={FiCheck} visible={effectiveVariant === "success"} />
    </motion.button>
  );
};

const IconOverlay = ({
  Icon,
  visible,
  spin = false,
}: {
  Icon: IconType;
  visible: boolean;
  spin?: boolean;
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          className="absolute inset-0 grid place-content-center"
        >
          <Icon className={`text-xl ${spin ? "animate-spin" : ""}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
