import { useEffect, useState } from "react";

const DEMOS = [
    { src: "/demo.gif", ms: 3000 },
    { src: "/demo2.gif", ms: 2500 },
    { src: "/demo3.gif", ms: 4000 },
];

function DemoSlideshow() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const id = setTimeout(() => setIdx(i => (i + 1) % DEMOS.length), DEMOS[idx].ms);
        return () => clearTimeout(id);
    }, [idx]);

    return (
        <div className="lp-slides">
            {DEMOS.map((d, i) => (
                <img key={d.src} src={d.src} alt="" className={i === idx ? "active" : ""} />
            ))}
        </div>
    );
}

export default function LandingPage({ onNavigate }: { onNavigate: (mode: "playground" | "practice", opts?: { annotate?: boolean }) => void }) {
    return (
        <div className="lp">
            <style>{`
                .lp {
                    min-height: 100vh; background: var(--bg-base); color: var(--text-primary);
                    display: flex; flex-direction: column;
                }

                .lp-nav {
                    padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;
                    border-bottom: 1px solid var(--border);
                }
                .lp-logo {
                    display: inline-flex; align-items: center; gap: 7px;
                    font-size: 13px; font-weight: 700; letter-spacing: 0.3px;
                }
                .lp-beta {
                    font-size: 9px; background: var(--bg-active); color: var(--text-muted);
                    padding: 1px 5px; border-radius: 3px; font-weight: 600;
                }
                .lp-links { display: flex; gap: 16px; }
                .lp-links a {
                    font-size: 12px; color: var(--text-faint); text-decoration: none;
                }
                .lp-links a:hover { color: var(--text-secondary); }

                .lp-main {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; padding: 48px 20px 32px; gap: 24px;
                }

                .lp-desc {
                    font-size: 16px; color: var(--text-muted); text-align: center;
                    max-width: 500px; line-height: 1.5; margin: 0;
                }

                .lp-actions { display: flex; gap: 8px; }
                .lp-btn {
                    padding: 7px 20px; font-size: 13px; font-weight: 600;
                    border-radius: 5px; cursor: pointer; font-family: inherit;
                    border: 1px solid var(--border); transition: all 0.12s;
                    min-width: 160px; text-align: center;
                }
                .lp-btn:active { transform: scale(0.97); }
                .lp-btn-fill {
                    background: var(--accent); color: #fff; border-color: var(--accent);
                    box-shadow: 0 2px 12px var(--accent-glow);
                }
                .lp-btn-fill:hover {
                    background: #fff; color: var(--accent); border-color: #fff;
                    box-shadow: 0 4px 20px rgba(255,255,255,0.15);
                }
                .lp-btn-outline {
                    background: transparent; color: var(--text-secondary);
                }
                .lp-btn-outline:hover { background: var(--bg-hover); color: var(--text-primary); }

                .lp-secondary {
                    font-size: 14px; color: var(--text-muted); background: none;
                    border: none; cursor: pointer; font-family: inherit; padding: 0;
                }
                .lp-secondary:hover { color: var(--text-secondary); }

                .lp-demo {
                    max-width: 720px; width: 100%;
                    border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
                }
                .lp-demo-bar {
                    height: 28px; background: var(--bg-elevated);
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; padding: 0 10px; gap: 5px;
                }
                .lp-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-light); }

                .lp-slides {
                    position: relative; width: 100%;
                    background: var(--bg-surface);
                }
                .lp-slides img {
                    width: 100%; display: block;
                    opacity: 0; transition: opacity 0.8s ease;
                }
                .lp-slides img:first-child {
                    position: relative;
                }
                .lp-slides img:not(:first-child) {
                    position: absolute; top: 0; left: 0;
                }
                .lp-slides img.active { opacity: 1; }

                @media (max-width: 500px) {
                    .lp-actions { flex-direction: column; width: 100%; }
                    .lp-btn { width: 100%; text-align: center; }
                }
            `}</style>

            <nav className="lp-nav">
                <div className="lp-logo">
                    <img src="/logo-dark.svg" alt="" width={16} height={16} />
                    AlgoPad
                    <span className="lp-beta">BETA</span>
                </div>
                <div className="lp-links">
                    <a href="https://github.com/vish-chan/AlgoFlow" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://github.com/vish-chan/AlgoFlow/issues" target="_blank" rel="noopener noreferrer">Feedback</a>
                </div>
            </nav>

            <main className="lp-main">
                <p className="lp-desc">
                    Algorithm visualizer for Java and Python. Write code, run it, step through the execution.
                </p>

                <div className="lp-actions">
                    <button className="lp-btn lp-btn-outline" onClick={() => onNavigate("practice")}>Leetcode Practice</button>
                    <button className="lp-btn lp-btn-fill" onClick={() => onNavigate("playground")}>Playground</button>
                </div>

                <button className="lp-secondary" onClick={() => onNavigate("playground", { annotate: true })}>
                    create a lesson →
                </button>

                <div className="lp-demo">
                    <div className="lp-demo-bar">
                        <div className="lp-dot" /><div className="lp-dot" /><div className="lp-dot" />
                    </div>
                    <DemoSlideshow />
                </div>
            </main>
        </div>
    );
}
