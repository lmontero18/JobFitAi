"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";

type LoadingButtonProps = {
  onSuccess: () => void | Promise<void>;
  validate: () => boolean;
  children?: React.ReactNode;
  className?: string;
};

export const LoadingButton = ({
  onSuccess,
  validate,
  children = "Analyze",
  className = "",
}: LoadingButtonProps) => {
  const [variant, setVariant] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  const baseStyle =
    "relative rounded-md px-6 py-2 font-medium transition-all text-center";

  const variantStyle =
    variant === "neutral"
      ? "bg-white text-black hover:bg-gray-200"
      : variant === "error"
      ? "bg-red-500 text-white"
      : variant === "success"
      ? "bg-green-500 text-white"
      : "bg-blue-400 pointer-events-none text-white";

  const handleClick = () => {
    if (variant !== "neutral") return;
    if (!validate()) return;

    setVariant("loading");
    setTimeout(() => {
      const success = true;
      if (success) {
        setVariant("success");
        onSuccess();
      } else {
        setVariant("error");
      }

      setTimeout(() => {
        setVariant("neutral");
      }, 2000);
    }, 1500);
  };

  return (
    <motion.button
      disabled={variant !== "neutral"}
      onClick={handleClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      <motion.span
        animate={{
          y: variant === "neutral" ? 0 : 6,
          opacity: variant === "neutral" ? 1 : 0,
        }}
        className="inline-block"
      >
        {children}
      </motion.span>

      <IconOverlay Icon={FiLoader} visible={variant === "loading"} spin />
      <IconOverlay Icon={FiX} visible={variant === "error"} />
      <IconOverlay Icon={FiCheck} visible={variant === "success"} />
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
