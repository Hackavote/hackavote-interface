import React, {useEffect, useState} from "react";
import Project from 'pages/project/_id';
import Home from 'pages';
import {Route, Routes} from 'react-router-dom';

function Countdown({targetTimestamp}: { targetTimestamp: number }) {
  const calculateTimeLeft = () => {
    const difference = Math.max(targetTimestamp - +new Date(), 0);
    let timeLeft = {hours: "00", minutes: "00", seconds: "00"};

    let updatedTime = {
      hours: Math.floor((difference / (1000 * 60 * 60))),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    for (let interval in updatedTime) {
      const key = interval as keyof typeof timeLeft;
      timeLeft[key] =
        updatedTime[key] < 10
          ? "0" + updatedTime[key]
          : updatedTime[key].toString();
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());

      if (
        timeLeft.hours === "00" &&
        timeLeft.minutes === "00" &&
        timeLeft.seconds === "00"
      ) {
        clearInterval(timer);
      }
    }, 1000);

    // Clear interval if the component is unmounted
    return () => clearInterval(timer);
  }, [calculateTimeLeft, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  return (
    <>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center flex-col sm:flex-row p-4 bg-gray-800 text-white">
        <div className="text-center sm:text-left mb-2 sm:mb-0">Submission Deadline in: <Countdown
          targetTimestamp={1700399272000}/></div>
        <div className="text-center sm:text-left">Voting Starts in: <Countdown
          targetTimestamp={1700399272000}/></div>
      </header>
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/project/:projectId' element={<Project/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
