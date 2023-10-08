import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faSun } from '@fortawesome/free-solid-svg-icons';
import TimeDate from './TimeDate';
import Weather from './Weather';
import './App.css';
import Timer from './Timer';
import { faClock, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import StickyNote from './StickyNote';
import './StickyNote.css'
import Keyboard from "react-simple-keyboard";
import './keyboard.css'



function App() {
  const [isOn, setIsOn] = useState(true);

  const [placeholderText, setPlaceholderText] = useState('|');
  const [brightness, setBrightness] = useState(100);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const isAnyPanelOpen = () => {
    return isTimerVisible || isNotePanelVisible || isSliderVisible;
  };
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isNotePanelVisible, setIsNotePanelVisible] = useState(false);

  const toggleNotePanelVisibility = () => {
    if (isAnyPanelOpen() && !isNotePanelVisible) return;
    setIsNotePanelVisible(!isNotePanelVisible);
  };
  const [layoutName, setLayoutName] = useState('default');
  const keyboard = useRef();

  const handleShift = () => {
    setLayoutName(layoutName === 'default' ? 'shift' : 'default');
  };

  const onChange = (input) => {
    setNewNote(input);
  };

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
    if (button === "{ok}") handleAddNote();
  };

  const toggleKeyboardVisibility = () => {
    setIsKeyboardVisible(!isKeyboardVisible);
  };


  const toggleNoteInputVisibility = () => {
    setIsNoteInputVisible(!isNoteInputVisible);
  };

  const handleAddNote = () => {
    setNotes([...notes, newNote]);
    setNewNote('');
    keyboard.current.clearInput();
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const toggleTimerVisibility = () => {
    if (isAnyPanelOpen() && !isTimerVisible) return;
    setIsTimerVisible(!isTimerVisible);
  };
  const togglePower = () => {
    setIsOn(prevIsOn => !prevIsOn);
    if (isOn) {
      setIsTimerVisible(false);
      setIsNotePanelVisible(false);
      setIsSliderVisible(false);
    }
  };

  const toggleSliderVisibility = () => {
    if (isAnyPanelOpen() && !isSliderVisible) return;
    setIsSliderVisible(!isSliderVisible);
  };
  const brightnessToHex = (value) => {
    const hex = Math.floor((value / 100) * 255).toString(16).padStart(2, '0');
    return `#${hex}${hex}00`;
  };
  const customLayout = {
    'default': [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      '{lock} a s d f g h j k l ; \' {ok}',
      '{shift} z x c v b n m , . / {shift}',
      '{space}'
    ],
    'shift': [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {ok}',
      '{shift} Z X C V B N M < > ? {shift}',
      '{space}'
    ]
  };
  const newLayout = {
    ...customLayout,
    'default': customLayout.default.map(row => row.replace('{enter}', '{ok:OK}')),
    'shift': customLayout.shift.map(row => row.replace('{enter}', '{ok:OK}'))
  };
  useEffect(() => {
    const borderStyle = `
      body {
        border: 5px solid ${brightnessToHex(brightness)};
        box-shadow: 0 0 50px rgba(255, 223, 186, ${brightness / 200}),
                    inset 0 0 50px rgba(255, 223, 186, ${brightness / 200});
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = borderStyle;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [brightness]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderText((prev) =>
        prev.endsWith('|') ? '' : ' |'
      );
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcam-feed');
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam: ', error);
      }
    };
    getMedia();
  }, []);

  return (
    <div className="container">
      <video
        id="webcam-feed"
        autoPlay
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {isOn ? (
        <div className="top-section">
          <TimeDate />
          <Weather />

        </div>
      ) : null}

      <div className="controls-container">
        <div className="buttons-container">
          {isOn && (
            <>
              <div className="timer-button-container">
                <button onClick={toggleTimerVisibility}>
                  <FontAwesomeIcon icon={faClock} />
                </button>
              </div>
              <div className="note-input-toggle-button-container">
                <button
                  onClick={toggleNotePanelVisibility}
                  className="icon-button"
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </button>
              </div>
              <div className="brightness-control-container">
                {isSliderVisible && (
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(e.target.value)}
                      className="brightness-slider"
                    />
                  </div>
                )}
                <div className="brightness-button-container">
                  <button onClick={toggleSliderVisibility}>
                    <FontAwesomeIcon icon={faSun} />
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="power-button-container">
            <button onClick={togglePower}>
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
        </div>
        <Timer isTimerVisible={isTimerVisible} toggleTimerVisibility={toggleTimerVisibility} />
        {isNotePanelVisible && (
          <div className="note-keyboard-container">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}

              className="note-input"
            />
            <div className="keyboard-container">
              <Keyboard
                keyboardRef={(r) => (keyboard.current = r)}
                layoutName={layoutName}
                onChange={onChange}
                onKeyPress={onKeyPress}
                layout={customLayout}
                display={{
                  '{bksp}': '⌫',
                  '{space}': ' ',
                  '{ok}': 'OK',
                  '{tab}': 'Tab',
                  '{lock}': 'Caps',
                  '{shift}': 'Shift',

                }}
              />
            </div>

          </div>
        )}
        <div className="notes-container">
          {notes.map((note, index) => (
            <StickyNote
              key={index}
              note={note}
              onRemove={() => handleRemoveNote(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );






}

export default App;
