import { useEffect, useRef, useState } from "react";
import { getEngine, subscribe } from "./visualizerEngine";

export default function VisualizerCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useState({});
    const [panelOpen, setPanelOpen] = useState(false);

    const engine = getEngine();
    const layoutChildren = engine.getLayoutChildren();

    useEffect(() => {
        if (!containerRef.current) return;

        engine.mount(containerRef.current);

        const unsubscribe = subscribe(() => {
            forceUpdate({});
        });

        return () => {
            unsubscribe();
            engine.unmount();
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            {layoutChildren.length > 0 && (
                <div style={{ background: "#1a1a1a", borderBottom: "1px solid #333" }}>
                    <button
                        onClick={() => setPanelOpen(!panelOpen)}
                        style={{
                            padding: "4px 10px",
                            fontSize: 12,
                            background: "transparent",
                            color: "#888",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                        }}
                    >
                        ⚙ Panels {panelOpen ? "▾" : "▸"}
                    </button>
                    {panelOpen && (
                        <div style={{ display: "flex", gap: 6, padding: "4px 10px 8px", flexWrap: "wrap" }}>
                            {layoutChildren.map(({ key, title }) => {
                                const hidden = engine.isChildHidden(key);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => engine.toggleChild(key)}
                                        style={{
                                            padding: "2px 10px",
                                            fontSize: 12,
                                            background: hidden ? "#333" : "#444",
                                            color: hidden ? "#666" : "#ddd",
                                            border: `1px solid ${hidden ? "#444" : "#666"}`,
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            textDecoration: hidden ? "line-through" : "none",
                                        }}
                                    >
                                        {title}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            <div
                ref={containerRef}
                style={{
                    flex: 1,
                    width: "100%",
                    minHeight: 0,
                    background: "#111",
                }}
            />
        </div>
    );
}
