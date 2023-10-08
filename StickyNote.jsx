import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const StickyNote = ({ note, onRemove }) => {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setDateTime(formattedDateTime);
  }, []); 

  return (
    <Draggable handle=".header">
      <div style={styles.note}>
        <div style={styles.header} className="header">
          <div style={styles.dateTime}>{dateTime}</div>
          <button onClick={onRemove} style={styles.removeButton}>x</button>
        </div>
        <div style={styles.body}>
          {note}
        </div>
      </div>
    </Draggable>
  );
};

const styles = {
  note: {
    width: 200,
    minHeight: 200,
    backgroundColor: 'rgba(0, 153, 255, 0.219)',
    position: 'fixed',
    borderRadius: '8px',
    padding: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    boxSizing: 'border-box',
    overflow: 'visible',
    wordWrap: 'break-word',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dateTime: {
    fontSize: '0.75rem',
  },
  removeButton: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '16px',
    cursor: 'pointer',
  },
  body: {
    overflow: 'visible',
    wordWrap: 'break-word',
  },
};

export default StickyNote;
