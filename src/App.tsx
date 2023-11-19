import React, {useMemo} from "react";
import Project from 'pages/project/_id';
import Home from 'pages';
import {Route, Routes} from 'react-router-dom';
import useDeadlines from "hooks/useDeadlines";
import Taco from "pages/taco";

function Countdown({difference}: { difference: number }) {
  const timeLeft = useMemo(() => {
    let timeLeft = {hours: "00", minutes: "00", seconds: "00"};

    let updatedTime = {
      hours: Math.floor(difference / 3600),
      minutes: Math.floor((difference / 60) % 60),
      seconds: Math.floor(difference % 60),
    };

    for (let interval in updatedTime) {
      const key = interval as keyof typeof timeLeft;
      timeLeft[key] =
        updatedTime[key] < 10
          ? "0" + updatedTime[key]
          : updatedTime[key].toString();
    }

    return timeLeft;
  }, [difference]);
  return (
    <span className="ml-1 bg-blue-600 text-white font-semibold py-1 px-3 rounded">
      {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </span>
  );
}

function Header() {
  const {
    submissionDeadlineDifference,
    votingStartDifference,
    votingDeadlineDifference
  } = useDeadlines()
  return <header className="flex justify-between items-center flex-col sm:flex-row p-4 bg-gray-800 text-white">
    {
      votingStartDifference > 0 ? <>
          <div className="text-center sm:text-left mb-4 sm:mb-0">Submission Deadline in: <Countdown
            difference={submissionDeadlineDifference}/></div>
          <div className="text-center sm:text-left">Voting Starts in: <Countdown
            difference={votingStartDifference}/></div>
        </> :
        submissionDeadlineDifference > 0 ? <>
          <div className="text-center sm:text-left mb-4 sm:mb-0">Submission Deadline in: <Countdown
            difference={submissionDeadlineDifference}/></div>
          <div className="text-center sm:text-left">Voting Ends in: <Countdown
            difference={votingDeadlineDifference}/></div>
        </> : votingDeadlineDifference > 0 ? <div className="text-center sm:text-left">Voting Ends in: <Countdown
          difference={votingDeadlineDifference}/></div> : <div className="text-center sm:text-left">Voting Ended!</div>
    }
  </header>
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/taco' element={<Taco/>}/>
          <Route path='/p/:projectSlug' element={<Project/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
