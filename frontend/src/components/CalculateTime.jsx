import { useEffect, useState } from "react";

const CalculateTime = ({ time }) => {
  const [calculatedTime, setCalculatedTime] = useState("0s");

  const getTime = () => {
    const timeDifference = Date.now() - new Date(time).getTime();

    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  useEffect(() => {
    setCalculatedTime(getTime());

    const timer = setInterval(() => {
      setCalculatedTime(getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return calculatedTime;
};

export default CalculateTime;
