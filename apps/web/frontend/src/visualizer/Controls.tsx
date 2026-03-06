import { useState, useEffect } from "react";
import {
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    subscribeToPlaying,
    subscribe,
    getEngine,
    setSpeed,
} from "./visualizerEngine";

export default function Controls() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [cursor, setCursor] = useState(0);
    const [total, setTotal] = useState(0);
    const [speed, setSpeedState] = useState(500);

    useEffect(() => {
        const unsubscribePlaying = subscribeToPlaying(setIsPlaying);
        const unsubscribe = subscribe(() => {
            const engine = getEngine();
            setCursor(engine.getCursor());
            setTotal(engine.getLength());
        });
        return () => {
            unsubscribePlaying();
            unsubscribe();
        };
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) pause();
        else play();
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = 2100 - Number(e.target.value);
        setSpeedState(newSpeed);
        setSpeed(newSpeed);
    };

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        pause();
        getEngine().setCursor(Number(e.target.value));
    };

    return (
        <div style={{ background: "#1e1e1e", borderTop: "1px solid #333", padding: "6px 10px" }}>
            {total > 0 && (
                <input
                    type="range"
                    min={0}
                    max={total}
                    value={cursor}
                    onChange={handleScrub}
                    style={{ width: "100%", margin: "0 0 6px", cursor: "pointer" }}
                />
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={reset}>⏮</button>
                <button onClick={stepBackward}>⏪</button>
                <button onClick={handlePlayPause}>{isPlaying ? "⏸" : "▶"}</button>
                <button onClick={stepForward}>⏩</button>
                <span style={{ marginLeft: 8, color: "#aaa", fontSize: 13 }}>
                    {cursor}/{total}
                </span>
                <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12 }}>🐢</span>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={2100 - speed}
                        onChange={handleSpeedChange}
                        style={{ width: 80 }}
                    />
                    <span style={{ fontSize: 12 }}>🐇</span>
                </div>
            </div>
        </div>
    );
}
