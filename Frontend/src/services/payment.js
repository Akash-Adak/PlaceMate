import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "";

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Razorpay script failed to load'));
  document.body.appendChild(script);
});

export const payWithRazorpay = async ({ user, amount, plan = 'pro' }) => {
  if (!user || !user.uid) throw new Error('User must be signed in to pay');
  await loadRazorpayScript();

  // Razorpay expects amount in paisa (INR * 100)
  const amountInPaisa = Math.round((Number(amount)*95 || 0) * 100);

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: amountInPaisa,
      currency: 'INR',
      name: 'PlaceMate',
      description: `Subscribe: ${plan}`,
      handler: async function (response) {
        try {
          // Mark user as subscribed in Firestore (client-side flag). In production,
          // verify payment on server using Razorpay secret before granting access.
          await setDoc(doc(db, 'placemate-user-profile', user.uid), {
            subscription: {
              plan,
              status: 'active',
              activatedAt: new Date().toISOString(),
              razorpay: response,
            },
            tier: plan === 'pro' || plan === 'Pro' ? 'Pro' : plan === 'enterprise' || plan === 'Enterprise' ? 'Enterprise' : 'Basic'
          }, { merge: true });

          resolve({ success: true, razorpay: response });
        } catch (err) {
          console.error('Error saving subscription:', err);
          reject(err);
        }
      },
      prefill: {
        name: user.displayName || '',
        email: user.email || ''
      },
      theme: { color: '#4f46e5' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};

export default { payWithRazorpay };
