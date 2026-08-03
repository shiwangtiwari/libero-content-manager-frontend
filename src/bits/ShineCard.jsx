/**
 * Shine Border Card — React Bits
 * Card with a rotating gradient border shine effect
 */
import { useRef, useEffect } from 'react'

export default function ShineCard({ children, active = false, style = {}, className = '' }) {
  return (
    <>
      <style>{`
        .shine-card {
          position: relative;
          border-radius: 14px;
          background: #0f1729;
          border: 1px solid #1e2d45;
        }
        .shine-card.shine-active {
          border-color: transparent;
          background: #0f1729;
        }
        .shine-card.shine-active::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 15px;
          background: conic-gradient(
            from var(--shine-angle, 0deg),
            #6366f1,
            #8b5cf6,
            #06b6d4,
            #6366f1
          );
          animation: shine-rotate 3s linear infinite;
          z-index: 0;
        }
        .shine-card.shine-active::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 13px;
          background: #0f1729;
          z-index: 1;
        }
        .shine-card-inner {
          position: relative;
          z-index: 2;
        }
        @keyframes shine-rotate {
          0%   { --shine-angle: 0deg; }
          100% { --shine-angle: 360deg; }
        }
        @property --shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
      <div
        className={`shine-card${active ? ' shine-active' : ''} ${className}`}
        style={style}
      >
        <div className="shine-card-inner">
          {children}
        </div>
      </div>
    </>
  )
}
