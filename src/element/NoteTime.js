import { useEffect, useState } from "react";

const MinuteInMs = 1_000 * 60;
const HourInMs = MinuteInMs * 60;
const DayInMs = HourInMs * 24;

export default function NoteTime({ from }) {
    const [time, setTime] = useState("");

    function calcTime() {
        let fromDate = new Date(from);
        let ago = (new Date().getTime()) - from;
        let absAgo = Math.abs(ago);
        if (absAgo > DayInMs) {
            return fromDate.toLocaleDateString(undefined, { year: "2-digit", month: "short", day: "2-digit", weekday: "short" });
        } else if (absAgo > HourInMs) {
            return `${fromDate.getHours().toString().padStart(2, '0')}:${fromDate.getMinutes().toString().padStart(2, '0')}`;
        } else if (absAgo < MinuteInMs) {
          return 'Just now'
        } else {
            let mins = parseInt(absAgo / MinuteInMs);
            let minutes = mins === 1 ? 'min' : 'mins'
            return `${mins} ${minutes} ago`;
        }
    }

    useEffect(() => {
        setTime(calcTime());
        let t = setInterval(() => {
            setTime(s => {
                let newTime = calcTime();
                if (newTime !== s) {
                    return newTime;
                }
                return s;
            })
        }, MinuteInMs);
        return () => clearInterval(t);
    }, [from]);

    return <>{time}</>
}