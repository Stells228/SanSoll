import './axiosConfig'
import React from 'react'
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.toggle('light-theme', savedTheme === 'light');
import ReactDOM from 'react-dom/client'

import App from './App.jsx'


import './styles/common.css'
import './styles/animations.css'
import './styles/floating.css'
import './styles/nav.css'
import './styles/hero.css'
import './styles/about.css'
import './styles/science.css'
import './styles/products.css'
import './styles/catalog-filters.css'
import './styles/reviews.css'
import './styles/certificates.css'
import './styles/contact.css'
import './styles/admin.css'
import './styles/faq.css'
import './styles/modals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)