import { useState, useEffect } from 'react';

function useScore() {
  const [score, setScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Optionally, handle timer and score changes here
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { score, setScore, elapsedTime, setElapsedTime };
}

export default useScore;
