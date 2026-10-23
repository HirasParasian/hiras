import React from 'react';
import Contact from '../components/Contact';

export default function ContactPage({ profile }) {
  return (
    <div style={{ paddingTop: '2.5rem' }}>
      <Contact profile={profile} />
    </div>
  );
}
