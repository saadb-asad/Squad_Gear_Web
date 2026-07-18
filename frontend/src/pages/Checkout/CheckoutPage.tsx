import { useState } from 'react';

export const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [payfastUrl, setPayfastUrl] = useState<string>('');

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Calls the FastAPI backend to generate a pending order and Payfast signature
      const res = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      
      setPaymentData(data.payment_data);
      setPayfastUrl(data.payfast_url);
    } catch (err) {
      console.error(err);
      alert('Failed to initiate checkout. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h1 className="heading-1 mb-8">Checkout</h1>
      
      <div style={{
        background: 'var(--color-surface-elevated)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        maxWidth: '500px',
      }}>
        <h2 className="heading-2 mb-4">Order Summary</h2>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          You are about to purchase 1x <strong>SquadGear Test Order</strong>.
        </p>
        <p className="mb-8" style={{ fontSize: '1.25rem' }}>
          Total: <strong style={{ color: 'var(--color-primary)' }}>R 150.00</strong>
        </p>

        {!paymentData ? (
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing Secure Checkout...' : 'Proceed to Secure Payment'}
          </button>
        ) : (
          <form action={payfastUrl} method="POST">
            {Object.keys(paymentData).map((key) => (
              <input key={key} type="hidden" name={key} value={paymentData[key]} />
            ))}
            <button className="btn btn-primary" type="submit" style={{ width: '100%', background: '#e3000f', color: '#fff' }}>
              Pay with Payfast
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
