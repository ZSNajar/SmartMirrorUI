import React, { useState, useEffect } from 'react';
import './TimeDate.css';

const TimeDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60); 

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
  
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
  
    return `${hours}:${    minutes.toString().padStart(2, '0')
    }`;
  };

  return (
    <div className="time-date-container">
      <div className="date-display">
        {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="time-display">{formatTime(currentDate)}</div>
    </div>
  );
};

export default TimeDate;
