import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'kart.krd — Kurdish Business Card Maker';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D9488 0%, #115E59 50%, #134E4A 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#A7F3D0',
            }}
          />
          <span
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            kart.krd
          </span>
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#A7F3D0',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: 1.4,
          }}
        >
          Create Professional Business Cards in Kurdish, Arabic &amp; English
        </div>
        <div
          style={{
            marginTop: '24px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Free — No Registration — Download PDF
        </div>
      </div>
    ),
    { ...size }
  );
}
