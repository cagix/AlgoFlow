import { useEffect, useRef, useState, useCallback } from "react";
import { getEngine, subscribe } from "./visualizerEngine";

function ChildPane({ child, renderer }: { child: any; renderer: any }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const paint = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth;
        const h = renderer.calcChildHeight(child);
        const newW = Math.round(w * dpr);
        const newH = Math.round(h * dpr);
        if (canvas.width !== newW || canvas.height !== newH) {
            canvas.width = newW;
            canvas.height = newH;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
        }
        renderer.renderChildToCanvas(canvas, child);
    }, [child, renderer]);

    useEffect(() => {
        paint();
        const ro = new ResizeObserver(paint);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [paint]);

    // Repaint on swap animation frames for array panes
    useEffect(() => {
        if (child?.type !== 'array') return;
        const prev = renderer.onSwapFrame;
        renderer.setSwapFrameCallback(() => {
            prev?.();
            paint();
        });
        return () => renderer.setSwapFrameCallback(prev);
    }, [child, renderer, paint]);

    return (
        <div
            ref={containerRef}
            style={{
                flex: "0 0 auto",
                minHeight: 60,
                overflowX: "hidden",
                borderBottom: "1px solid #333",
            }}
        >
            <canvas ref={canvasRef} style={{ display: "block", background: "#111" }} />
        </div>
    );
}

export default function VisualizerCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useState({});
    const [panelOpen, setPanelOpen] = useState(false);

    const engine = getEngine();
    const layoutChildren = engine.getLayoutChildren();
    const isLayout = engine.isLayoutRoot();

    useEffect(() => {
        if (!containerRef.current) return;
        engine.mount(containerRef.current);
        const unsubscribe = subscribe(() => forceUpdate({}));
        return () => {
            unsubscribe();
            engine.unmount();
        };
    }, []);

    const renderer = engine.getRenderer();
    const grouped = isLayout ? renderer.groupLayoutChildren(engine.getLayoutData()) : [];

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
                            {layoutChildren.map(({ key, title, dsType }) => {
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
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        {dsType && (
                                            <span style={{
                                                background: "#2a4a3a",
                                                color: "#4CAF50",
                                                fontSize: 10,
                                                fontWeight: "bold",
                                                padding: "1px 4px",
                                                borderRadius: 3,
                                            }}>{dsType}</span>
                                        )}
                                        {title}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            {isLayout && grouped.length > 0 ? (
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", background: "#111" }}>
                    {grouped.map((child: any, i: number) => (
                        <ChildPane key={i} child={child} renderer={renderer} />
                    ))}
                </div>
            ) : null}
            <div
                ref={containerRef}
                style={{ flex: 1, width: "100%", minHeight: 0, background: "#111", display: isLayout && grouped.length > 0 ? "none" : undefined }}
            />
        </div>
    );
}
