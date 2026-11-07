import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { ReadingListProvider, ShelvesProvider } from './context/AppProviders'

// On GitHub Pages there is no server to rewrite unknown paths to index.html,
// so a deep link such as /shelf/book/OL893414W returns 404. HashRouter keeps the
// route after the "#", which the browser never sends to the server. Locally we
// keep clean URLs with BrowserRouter.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ReadingListProvider>
        <ShelvesProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { borderRadius: '12px', background: '#1f1b16', color: '#fffdf8' },
            }}
          />
        </ShelvesProvider>
      </ReadingListProvider>
    </Router>
  </StrictMode>,
)
