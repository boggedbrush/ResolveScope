import { useEffect, useRef } from "react";

export function CodexBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const binaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const binaryLayer = binaryRef.current;
    if (!banner || !binaryLayer) return;

    let hovering = false;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;

    function activate() {
      if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
      hovering = true;
      banner!.classList.add("is-animated");
    }

    function deactivate() {
      hovering = false;
      leaveTimer = setTimeout(() => {
        if (!hovering) banner!.classList.remove("is-animated");
      }, 400);
    }

    function generate(rows: number, cols: number): string {
      let out = "";
      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let c = 0; c < cols; c++) {
          const roll = Math.random();
          if (roll > 0.86) line += " ";
          else if (roll > 0.43) line += "1";
          else line += "0";
          line += " ";
        }
        out += line.trimEnd() + "\n";
      }
      return out.trimEnd();
    }

    function populate() {
      const rect = banner!.getBoundingClientRect();
      const cols = Math.max(Math.ceil(rect.width / 26), 40);
      const rows = Math.max(Math.ceil(rect.height / 30), 16);
      binaryLayer!.textContent = generate(rows, cols);
    }

    populate();

    const HOVER_INTERVAL = 4500;
    const IDLE_INTERVAL = 22000;

    let tickTimer: ReturnType<typeof setTimeout>;

    function tick() {
      if (!document.hidden && (hovering || Math.random() > 0.72)) {
        populate();
      }
      tickTimer = setTimeout(tick, hovering ? HOVER_INTERVAL : IDLE_INTERVAL);
    }

    tickTimer = setTimeout(tick, IDLE_INTERVAL);

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(populate, 200);
    }

    if (window.matchMedia("(hover: hover)").matches) {
      banner.addEventListener("mouseenter", activate);
      banner.addEventListener("mouseleave", deactivate);
    } else {
      setTimeout(activate, 600);
    }

    window.addEventListener("resize", onResize);

    return () => {
      banner.removeEventListener("mouseenter", activate);
      banner.removeEventListener("mouseleave", deactivate);
      window.removeEventListener("resize", onResize);
      clearTimeout(tickTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="codex-banner" ref={bannerRef}>
      <div className="orb orb--left" />
      <div className="orb orb--right" />
      <div className="binary-layer" ref={binaryRef} />
      <div className="center-fade" />

      <div className="banner-content">
        <div className="brand-row">
          <span className="brand">OpenAI</span>
          <span className="brand-divider" />
          <em className="brand brand--italic">Handshake</em>
        </div>
        <h2 className="banner-title">Codex Creator Challenge — 2026 Entry</h2>

        <p className="banner-desc">
          Build something real, enter the challenge, and put your AI skills
          in front of employers across the country.
        </p>

        <div className="cta-group">
          <a
            href="https://chatgpt.com/codex/students?partner_id=handshake"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Claim $100 in Codex credits
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          <a
            href="https://joinhandshake.com/students/codex-creator-challenge/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Learn more
          </a>
        </div>

        <div className="sponsors">
          <span className="sponsors-label">Get seen by:</span>
          <div className="sponsors-list">
            <span>ZS</span>·<span>GEICO</span>·<span>L'Oréal</span>·<span>KPFF</span>·<span>Uber</span>
          </div>
        </div>

        <p className="fine-print">
          Available to currently enrolled university students in the United States and Canada.
        </p>
      </div>
    </div>
  );
}
