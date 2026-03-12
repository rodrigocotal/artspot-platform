'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'system-ui' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: '1px solid #333',
              borderRadius: '6px',
              background: '#333',
              color: '#fff',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
