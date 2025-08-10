import  createRoot from 'react-dom/client'
import './index.css'
import App from './App.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; //custom styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot.createRoot(rootElement).render(
        <App />
)
