import React from "react";
import { motion } from "framer-motion";

interface Props {
    text: string;
    className?: string;
}

const AnimatedTextWord = ({ text, className } : Props) => {
  const words = text.split(" ");

// Variants for Container of words.
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

// Variants for each word.

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", fontSize: "2rem" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className ? className : ""}
    >
      {words.map((word, index) => (
        <motion.p
          variants={child}
          style={{ marginRight: "5px" }}
          key={index}
          className={"text-black text-2xl sm:text-3xl md:text-4xl"}
        >
          {word}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default AnimatedTextWord;

