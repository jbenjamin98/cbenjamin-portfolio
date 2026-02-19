import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const VisitorCounter = () => {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCount = async () => {
      try {
        const apiKey = import.meta.env.VITE_COUNTER_API_KEY;
        const response = await fetch(
          `https://api.counterapi.dev/v2/christian-benjamin-portfolio/cb-visitor-counter/up?token=${apiKey}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCount(data.data.up_count);
      } catch (err) {
        console.error("Error fetching hit count:", err);
        setError(err); // Set error state on failure
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  const countString = error
    ? "ERROR"
    : (count != null ? count.toString().padStart(6, '0') : '...');

  if (isLoading) {
      return (
        <div className="flex items-center space-x-2 font-['Space_Mono'] text-sm text-[#ff9a14]">
            <div className="relative">
                <span className="absolute -top-2 left-2 bg-[#222337] px-1 text-[10px] leading-none text-[#ff9a14]/80">VISITORS</span>
                <div className="bg-[#222337] px-2 py-1 rounded-md border-2 border-[#ff9a14]/50 shadow-inset-deep min-w-[3rem] text-center">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex items-center space-x-2 font-['Space_Mono'] text-sm text-[#ff9a14]">
      <div className="relative">
        <span className="absolute -top-2 left-2 bg-[#222337] px-1 text-[10px] leading-none text-[#ff9a14]/80">VISITORS</span>
        <div className="bg-[#222337] px-2 py-1 rounded-md border-2 border-[#ff9a14]/50 shadow-inset-deep">
        <motion.div>
            {countString.split('').map((char, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {char}
              </motion.span>
            ))}
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
