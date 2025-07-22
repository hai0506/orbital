import { useEffect, useState } from 'react';

const CountdownClock = ({ startTime, endTime }) => {
  const [tillEnd, setTillEnd] = useState(true);
  const calculateTimeLeft = () => {
    const now = new Date();
    let difference;

    if (new Date(startTime) > now) {
      difference = new Date(startTime) - now;
    } else {
      difference = new Date(endTime) - now;
    }
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
      const now = new Date();
      const isBeforeStart = new Date(startTime) > now;
      setTillEnd(!isBeforeStart);
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
      {tillEnd ? (
        <div>Fundraiser ends in: </div>
      ) : (
        <div>Fundraiser starts in: </div>
      )}
        <div>{timeLeft.days}d</div>
        <div>{timeLeft.hours}h</div>
        <div>{timeLeft.minutes}m</div>
        <div>{timeLeft.seconds}s</div>
    </div>
  );
};

export default CountdownClock;
