import { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

const TARGET_TEXT = "Analyze";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

type EncryptButtonProps = {
  onClick: () => void;
  onSuccess?: () => void;
  className?: string;
};

export const EncryptButton = ({
  onClick,
  onSuccess,
  className = "",
}: EncryptButtonProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  const handleClick = () => {
    onClick();
    // Simulamos delay antes de ejecutar onSuccess
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1200); // Podés ajustar este tiempo
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      className={`group relative overflow-hidden rounded-lg border border-neutral-500 bg-neutral-700 px-6 py-2 font-mono font-medium uppercase text-neutral-300 transition-colors hover:text-indigo-300 ${className}`}
    >
      <div className="relative z-10 flex items-center gap-2">
        <FiSearch />
        <span>{text}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400 to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};
