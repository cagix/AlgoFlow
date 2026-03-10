import { useState, useCallback, useRef } from "react";
import JavaEditor from "./JavaEditor";
import AlgorithmVisualizerPane from "./visualizer/AlgorithmVisualizerPane";

export default function App() {
    const [splitPercent, setSplitPercent] = useState(40);
    const dragging = useRef(false);

    const onMouseDown = useCallback(() => {
        dragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            const pct = (e.clientX / window.innerWidth) * 100;
            setSplitPercent(Math.min(70, Math.max(20, pct)));
        };
        const onMouseUp = () => {
            dragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <div style={{ background: "#f59e0b", color: "#000", textAlign: "center", padding: "4px 0", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, flexShrink: 0 }}>
                🚧 BETA — This is an early version. Expect bugs and rough edges!
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            <div style={{ width: `${splitPercent}%` }}>
                <JavaEditor />
            </div>
            <div
                onMouseDown={onMouseDown}
                style={{
                    width: 4,
                    cursor: "col-resize",
                    background: "#333",
                    flexShrink: 0,
                }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <AlgorithmVisualizerPane />
            </div>
            </div>
        </div>
    );
}
