import {useEffect, useState} from "react";
import {getCurrentTimestamp} from "utils/time";
import {submissionDeadline, votingDeadline, votingStart} from "constants/index";

export default function useDeadlines() {
  const [now, setNow] = useState(getCurrentTimestamp())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getCurrentTimestamp())
    }, 1000);
    // Clear interval if the component is unmounted
    return () => clearInterval(timer);
  }, []);

  return {
    now,
    votingStartDifference: Math.max(votingStart - now, 0),
    votingDeadlineDifference: Math.max(votingDeadline - now, 0),
    submissionDeadlineDifference: Math.max(submissionDeadline - now, 0),
  }
}
