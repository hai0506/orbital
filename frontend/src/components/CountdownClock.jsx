import { useEffect, useState } from 'react';

const CountdownClock = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
    return difference > 0 ? timeLeft : null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (!updated) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) {
    return <span className="text-red-600 font-medium">Fundraiser ended</span>;
  }

  return (
    <div className="flex gap-2 text-sm font-semibold text-gray-700 mt-2">
        <div>Fundraiser ends in: </div>
        <div>{timeLeft.days}d</div>
        <div>{timeLeft.hours}h</div>
        <div>{timeLeft.minutes}m</div>
        <div>{timeLeft.seconds}s</div>
    </div>
  );
};

export default CountdownClock;
