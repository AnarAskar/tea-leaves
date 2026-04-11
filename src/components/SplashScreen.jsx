import React from "react";

const SPLASH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
  body { margin:0; background:#000; font-family:'Plus Jakarta Sans',sans-serif; }
  .sp-root { position:relative; width:100%; max-width:430px; height:100vh; margin:0 auto; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; }
  .sp-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; }
  .sp-overlay { position:absolute; inset:0; z-index:1; background:linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.62) 65%, rgba(0,0,0,0.90) 100%); }
  .sp-content { position:relative; z-index:2; width:100%; padding:0 24px 44px; display:flex; flex-direction:column; align-items:center; }
  .sp-langs { display:flex; flex-direction:column; gap:8px; width:100%; margin-bottom:22px; }
  .sp-btn { width:100%; padding:13px 20px; background:rgba(30,61,47,0.82); border:1px solid rgba(82,183,136,0.4); border-radius:12px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; text-align:center; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); transition:background .2s, border-color .2s, transform .15s; }
  .sp-btn:hover { background:rgba(64,145,108,0.9); border-color:rgba(82,183,136,0.9); transform:translateY(-2px); }
  .sp-socials { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .sp-icon { width:42px; height:42px; border-radius:50%; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; color:#fff; text-decoration:none; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); transition:background .2s, transform .15s; }
  .sp-icon:hover { background:rgba(255,255,255,0.24); transform:scale(1.1); }
  .sp-powered { font-size:11px; color:rgba(255,255,255,0.35); letter-spacing:.04em; }
`;

export default function SplashScreen({ onPickLang }) {
  return (
    <>
      <style>{SPLASH_CSS}</style>
      <div className="sp-root">
        <video
          className="sp-video"
          src="https://r2.mynu.site/images/67c05717d8908969203b54ba/items/455959311.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="sp-overlay" />
        <div className="sp-content">
          <div className="sp-langs">
            <button className="sp-btn" onClick={() => onPickLang("en")}>
              English
            </button>
            <button className="sp-btn" onClick={() => onPickLang("ar")}>
              العربية
            </button>
            <button className="sp-btn" onClick={() => onPickLang("ku")}>
              کوردی
            </button>
          </div>
          <div className="sp-socials">
            <a
              href="https://instagram.com/tea.leaves.iq"
              target="_blank"
              rel="noreferrer"
              className="sp-icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://maps.app.goo.gl/yRDBcouVLgZEJjB4A"
              target="_blank"
              rel="noreferrer"
              className="sp-icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </a>
            <a
              href="https://www.snapchat.com/add/tealeaves.iq"
              target="_blank"
              rel="noreferrer"
              className="sp-icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.5 2 6 4.5 6 8v1c-.6.1-1.5.4-2 1 0 .7.5 1.3 1.3 1.5-.2.4-.5.8-1 1.1-.3.2-.3.6 0 .8.8.6 2 .6 2.7.5.5.8 1.5 1.7 3 2.1l-.5.5c-.4.4-.2 1 .3 1.2 1.3.4 2 1.3 2.2 1.3s.9-.9 2.2-1.3c.5-.2.7-.8.3-1.2l-.5-.5c1.5-.4 2.5-1.3 3-2.1.7.1 1.9.1 2.7-.5.3-.2.3-.6 0-.8-.5-.3-.8-.7-1-1.1C20.5 11.3 21 10.7 21 10c-.5-.6-1.4-.9-2-1V8c0-3.5-2.5-6-7-6z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@tea.leaves.iq"
              target="_blank"
              rel="noreferrer"
              className="sp-icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/Tea-Leaves/100094553839870/"
              target="_blank"
              rel="noreferrer"
              className="sp-icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
          <div className="sp-powered">Powered by mynu</div>
        </div>
      </div>
    </>
  );
}
