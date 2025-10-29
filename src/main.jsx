import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Nota: rimosso import di builder-setup qui (se lo vuoi, importalo dinamicamente dentro App)
import App from './App.jsx'

// Carico font Roboto e qualche stile globale per garantire coerenza (dimensioni leggibili, focus accessibility, sfondo)
// Applico solo regole non invasive: non forzo il display del body, centro #root tramite margin auto e max-width
if (typeof document !== 'undefined') {
  const loadRobotoAndGlobals = () => {
    const fontId = 'roboto-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap';
      document.head.appendChild(link);
    }

    const styleId = 'app-global-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Global baseline for consistent typography and spacing */
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #070707; /* match app theme */
          color: #e0e0e0;
          font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * { box-sizing: border-box; }

        /* Do not force layout changes to body; keep app non-invasive */
        body {
          background: #070707;
        }
        #root {
          width: 100%;
          max-width: 1300px; /* match app container max */
          margin: 24px auto;
          padding: 0 16px;
        }

        /* Form elements sizing and focus for accessibility */
        input, select, textarea, button {
          font-family: inherit;
          font-size: 15px;
        }
        input:focus, select:focus, textarea:focus, button:focus {
          outline: 3px solid rgba(30,136,229,0.18);
          outline-offset: 2px;
          border-radius: 6px;
        }

        /* Improve visibility of placeholder text */
        ::placeholder {
          color: #a9a9a9;
          opacity: 1;
        }

        /* Ensure images/SVG scale nicely */
        img, svg { max-width: 100%; height: auto; display: block; }
      `;
      document.head.appendChild(style);
    }
  };
  loadRobotoAndGlobals();
}

if (process.env.NODE_ENV !== 'production') {
  console.log('>>> START main.jsx - file loaded')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)