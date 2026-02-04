import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // This points to your code
import './index.css'     // This imports your Tailwind styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
