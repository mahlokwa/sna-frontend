export default function BookingUnavailable() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <h2>Booking is temporarily unavailable</h2>
      <p>We're making a few quick updates. Please check back soon!</p>
    </div>
  );
}