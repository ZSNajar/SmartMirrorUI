import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';
import audioFile from './bedside-clock-alarm-95792.mp3'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faForward,faStop } from '@fortawesome/free-solid-svg-icons';


const Timer = ({ isTimerVisible, toggleTimerVisibility }) => {
    const [digits, setDigits] = useState(['0', '0', ':', '0', '0']);
    const [position, setPosition] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef(null);

  const increment = () => {
   
    if (!isRunning) {
      const newDigits = [...digits];
      const newValue = parseInt(newDigits[position], 10) + 1;
     
      if (position < 2) {
        const newMinuteValue = parseInt(newDigits.slice(0, 2).join(''), 10) + (position === 0 ? 10 : 1);
        
        if (newMinuteValue <= 59) {
          newDigits[position] = String(newValue % 10);
          setDigits(newDigits);
        }
      
      } else if (position > 2) {
        const newSecondValue = parseInt(newDigits.slice(3, 5).join(''), 10) + (position === 3 ? 10 : 1);
        
        if (newSecondValue <= 59) {
          newDigits[position] = String(newValue % 10);
          setDigits(newDigits);
        }
      }
    }
  };

  const decrement = () => {
    
    if (!isRunning) {
      const newDigits = [...digits];
      const newValue = parseInt(newDigits[position], 10) - 1;
      
      if (newValue >= 0) {
        newDigits[position] = String((newValue + 10) % 10);
        setDigits(newDigits);
      }
    }
  };

  const nextDigit = () => {
    setPosition(prevPosition => (prevPosition + 1) % 5 === 2 ? (prevPosition + 2) % 5 : (prevPosition + 1) % 5);
  };

  const resetTimer = () => {
    setDigits(['0', '0', ':', '0', '0']);
    setPosition(0);
    setTimeRemaining(0);
  };

  const startTimer = () => {
    const minutes = parseInt(digits[0] + digits[1], 10);
    const seconds = parseInt(digits[3] + digits[4], 10);
    const totalSeconds = minutes * 60 + seconds;

   
    if (!isRunning && totalSeconds > 0) {
        setTimeRemaining(totalSeconds);
        setIsRunning(true);
    }
};

  const cancelTimer = () => {
    setIsRunning(false);
    setIsAudioPlaying(false); 
    resetTimer();
    toggleTimerVisibility();
  };
 
  useEffect(() => {
    let intervalId;
    try {
      if (isRunning && timeRemaining > 0) {
        intervalId = setInterval(() => {
          setTimeRemaining((prev) => prev - 1);
        }, 1000);
     
      } else if (isRunning && timeRemaining === 0) {
        setIsRunning(false);
        setIsAudioPlaying(true);
       
        setDigits(['0', '0', ':', '0', '0']);
      }
   
    } catch (error) {
      console.error('Error in timer interval:', error);
    }
   
    return () => clearInterval(intervalId);
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    const audio = audioRef.current;
  
    if (isAudioPlaying) {
      audio.play()
        .then(() => {
          
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isAudioPlaying]);
 
  const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
  const seconds = (timeRemaining % 60).toString().padStart(2, '0');
  const displayDigits = isAudioPlaying
  ? ['0', '0', ':', '0', '0']
  : [...minutes, ':', ...seconds];
  const buttonText = position < 4 ? 'Next' : 'Start';
  const buttonAction = position < 4 ? nextDigit : startTimer;

  return (
    <div
      className="timer-panel"
      style={{ display: isTimerVisible ? 'block' : 'none' }}
    >
     
      <audio ref={audioRef} src={audioFile} />
      <div className={`timer-display${isAudioPlaying ? ' blinking' : ''}`}>
        {isRunning ? (
          displayDigits.map((digit, index) => (
            <span key={index}>{digit}</span>
          ))
        ) : (
          digits.map((digit, index) => (
            <span key={index} className={position === index ? 'blinking' : ''}>
              {digit}
            </span>
          ))
        )}
      </div>
     
      <div className="timer-controls">
        {isAudioPlaying ? (
          <button onClick={cancelTimer}>Stop</button>
        ) : isRunning ? (
            <button onClick={cancelTimer}>
            <FontAwesomeIcon icon={faStop} /> 
          </button>
        ) : (
          <>
            <button onClick={increment}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button onClick={decrement}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <button onClick={buttonAction}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </>
        )}
      </div>
    </div>
  );
        };

        export default Timer;
