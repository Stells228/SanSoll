import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Certificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    axios.get('/api/certificates').then(res => setCerts(res.data));
  }, []);

  return (
    <section id="certificates" className="certificates">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-badge glass-card">Сертификаты</span>
          <h2>Вся наша продукция прошла гос регистрацию</h2>
        </div>
        <div className="certificates-slider" id="certificates-slider">
          {certs.map(cert => (
            <div className="certificate-slide" key={cert.id}>
              <img src={cert.imageUrl} alt={cert.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}