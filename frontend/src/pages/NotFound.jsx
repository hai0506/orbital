import React from 'react'
import { Link } from 'react-router-dom'
import PV2 from '../styles/PV2.png'

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0818 0%, #1e1045 50%, #150d35 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* orbs */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:0.35, width:400, height:400, background:'radial-gradient(circle,#7c3aed,#4f46e5)', top:-100, left:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:0.3, width:300, height:300, background:'radial-gradient(circle,#db2777,#9333ea)', bottom:-80, right:-80, pointerEvents:'none' }} />

      <img src={PV2} alt="ProjectVendor" style={{ width: 160, filter: 'drop-shadow(0 0 14px rgba(167,139,250,0.4))', position:'relative', zIndex:1 }} />

      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{
          fontSize: '7rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 60%, #6d28d9 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
        }}>404</div>
        <h2 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:700, marginTop:'0.5rem' }}>Page not found</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', marginTop:'0.4rem', fontSize:'0.95rem' }}>
          This page doesn't exist or has been moved.
        </p>
      </div>

      <Link to="/" className="pv-btn" style={{ fontSize:'0.95rem', padding:'0.7rem 1.75rem', position:'relative', zIndex:1 }}>
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
