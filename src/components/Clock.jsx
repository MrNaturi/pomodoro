import React, { useState, useRef, useEffect } from "react";

const Clock = () => {
  const [breakLength, setBreakLength] = useState(5); // Default: 5 minutes
  const [sessionLength, setSessionLength] = useState(25); // Default: 25 minutes
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false); // Tracks timer status
  const [isBreak, setIsBreak] = useState(false); // Tracks work/break phase
  const timerRef = useRef(null); // Stores interval ID
  const beepRef = useRef(null); // Ref to audio element

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle increment/decrement for break/session lengths
  const handleLengthChange = (type, operation) => {
    if (type === "break") {
      setBreakLength((prev) => {
        const newValue = operation === "increment" ? prev + 1 : prev - 1;
        return newValue >= 1 && newValue <= 60 ? newValue : prev;
      });
    } else if (type === "session") {
      setSessionLength((prev) => {
        const newValue = operation === "increment" ? prev + 1 : prev - 1;
        if (newValue >= 1 && newValue <= 60) {
          setTimeLeft(newValue * 60); // Update displayed time if session changes
        }
        return newValue >= 1 && newValue <= 60 ? newValue : prev;
      });
    }
  };

  // Timer control logic
  const toggleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            // Switch between session and break
            if (!isBreak) {
              setIsBreak(true);
              return breakLength * 60; // Start break
            } else {
              setIsBreak(false);
              return sessionLength * 60; // Start session again after break
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Reset functionality
  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsBreak(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0; // Reset audio
  };

  // Play beep sound at end of timer
  useEffect(() => {
    if (timeLeft === 0) {
      beepRef.current.play();
    }
  }, [timeLeft]);

  // Effect to reset the timeLeft after break
  useEffect(() => {
    if (isBreak) {
      setTimeLeft(breakLength * 60); // Set to break time when break starts
    } else {
      setTimeLeft(sessionLength * 60); // Reset to session time when switching back to session
    }
  }, [isBreak, breakLength, sessionLength]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Pomodoro Clock</h1>

        {/* Break Controls */}
        <div className="flex justify-between items-center mb-6">
          <div id="break-control">
            <h2 id="break-label" className="text-lg font-semibold text-center">
              Break Length
            </h2>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <button
                id="break-decrement"
                onClick={() => handleLengthChange("break", "decrement")}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                -
              </button>
              <span id="break-length" className="text-xl">
                {breakLength}
              </span>
              <button
                id="break-increment"
                onClick={() => handleLengthChange("break", "increment")}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                +
              </button>
            </div>
          </div>

          {/* Session Controls */}
          <div id="session-control">
            <h2 id="session-label" className="text-lg font-semibold text-center">
              Session Length
            </h2>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <button
                id="session-decrement"
                onClick={() => handleLengthChange("session", "decrement")}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                -
              </button>
              <span id="session-length" className="text-xl">
                {sessionLength}
              </span>
              <button
                id="session-increment"
                onClick={() => handleLengthChange("session", "increment")}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div id="timer" className="text-center">
          <h2 id="timer-label" className="text-xl font-semibold mb-2">
            {isBreak ? "Break" : "Session"}
          </h2>
          <div
            id="time-left"
            className="text-4xl font-bold bg-gray-700 py-4 rounded-lg"
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            id="start_stop"
            onClick={toggleStartStop}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            id="reset"
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>

        {/* Beep Sound */}
        <audio
          id="beep"
          ref={beepRef}
          src="./alarm-beep-34359.mp3"
        ></audio>
      </div>
    </div>
  );
};

export default Clock;
