import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check, AlertCircle, PhoneCall } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { sendContactMessage } from '../services/firebase';

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setStatusMsg('Mohon lengkapi nama, email, dan pesan Anda.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await sendContactMessage(formData);
      setStatus('success');
      setStatusMsg('Terima kasih! Pesan Anda telah berhasil terkirim dan tersimpan di database.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact error:', err);
      setStatus('error');
      setStatusMsg('Gagal mengirim pesan: ' + (err.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ background: 'rgba(7, 9, 14, 0.7)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <MessageSquare size={13} />
            <span>Hubungi Saya</span>
          </div>
          <h2>
            Punya Ide Proyek? <span className="text-gradient-cyan">Mari Wujudkan</span>
          </h2>
          <p className="section-subtitle">
            Saya selalu terbuka untuk berdiskusi seputar peluang kerja sama, project freelance, atau sekadar bertukar wawasan teknis.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Direct Contact Info */}
          <div className="contact-info-panel">
            <a href={`mailto:${profile.email}`} className="contact-card-box">
              <div className="contact-card-icon">
                <Mail size={22} />
              </div>
              <div>
                <div className="contact-card-title">Email Langsung</div>
                <div className="contact-card-value">{profile.email}</div>
              </div>
            </a>

            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-card-box">
                <div className="contact-card-icon" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff' }}>
                  <Github size={22} />
                </div>
                <div>
                  <div className="contact-card-title">GitHub Profile</div>
                  <div className="contact-card-value">github.com/HirasParasian</div>
                </div>
              </a>
            )}

            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-box">
                <div className="contact-card-icon" style={{ background: 'rgba(10, 102, 194, 0.15)', color: '#0a66c2' }}>
                  <Linkedin size={22} />
                </div>
                <div>
                  <div className="contact-card-title">LinkedIn Connection</div>
                  <div className="contact-card-value">Hiras Parasian</div>
                </div>
              </a>
            )}

            {profile.whatsapp && (
              <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-card-box">
                <div className="contact-card-icon" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25d366' }}>
                  <PhoneCall size={22} />
                </div>
                <div>
                  <div className="contact-card-title">WhatsApp Chat</div>
                  <div className="contact-card-value">Hubungi Langsung</div>
                </div>
              </a>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="glass-card contact-form-panel">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Nama Anda</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Contoh: John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Alamat Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subjek / Topik</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Diskusi Proyek Web / Penawaran Kolaborasi"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Pesan Anda</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  placeholder="Ceritakan detail proyek atau pertanyaan yang ingin Anda sampaikan..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              {status && (
                <div style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.9rem',
                  background: status === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${status === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: status === 'success' ? '#34d399' : '#f87171'
                }}>
                  {status === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                id="btn-submit-message"
              >
                {loading ? (
                  <span>Mengirim pesan...</span>
                ) : (
                  <>
                    <span>Kirim Pesan Sekarang</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
