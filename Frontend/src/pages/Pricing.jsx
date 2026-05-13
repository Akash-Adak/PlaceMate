import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Shield, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { payWithRazorpay } from '../services/payment';
import { getUserProfile } from '../services/resume';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [currentTier, setCurrentTier] = useState('Basic');
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      try {
        const p = await getUserProfile(user.uid);
        setCurrentTier(p?.tier || (p?.subscription?.plan ? (p.subscription.plan === 'pro' ? 'Pro' : p.subscription.plan) : 'Basic'));
      } catch (e) {
        console.warn('Could not load profile for pricing', e);
      }
    };
    loadProfile();
  }, [user]);

  const plans = [
    {
      name: 'Basic',
      icon: Shield,
      price: 'Free',
      description: 'Perfect for exploring your career options.',
      features: [
        'AI Resume Parsing',
        'Top 5 Company Matches',
        'Unlock 1 Detailed Company Prep Plan',
        'Basic Progress Tracking'
      ],
      isPopular: false,
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$10',
      period: '/month',
      description: 'For serious candidates ready to crack top tier interviews.',
      features: [
        'Everything in Basic',
        'Unlimited Detailed Company Prep Plans',
        'Advanced Mock Interview Generation',
        'Priority AI Processing',
        'Direct HR Referrals (Coming Soon)'
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      description: 'For universities and placement agencies.',
      features: [
        'Everything in Pro',
        'Bulk Resume Processing',
        'Custom Company Workflows',
        'API Access',
        'Dedicated Account Manager'
      ],
      isPopular: false,
    }
  ];

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white selection:bg-amber-500/30"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800 selection:bg-indigo-500/30",
    
    title: isDark
      ? "text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase italic text-white"
      : "text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase italic text-slate-800",
    
    titleAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    subtitle: isDark
      ? "text-slate-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto"
      : "text-slate-400 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto",
    
    card: (isPopular) => {
      if (isDark) {
        return `relative bg-[#0a0a0a] rounded-[2.5rem] p-8 flex flex-col ${
          isPopular 
            ? 'border-2 border-amber-500 transform md:-translate-y-4 shadow-2xl shadow-amber-500/10' 
            : 'border border-white/5'
        }`;
      }
      return `relative bg-white rounded-[2.5rem] p-8 flex flex-col ${
        isPopular 
          ? 'border-2 border-indigo-500 transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20' 
          : 'border border-indigo-100 shadow-md hover:shadow-lg transition-shadow'
      }`;
    },
    
    popularBadge: isDark
      ? "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
      : "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md",
    
    iconWrapper: (isPopular) => isDark
      ? `w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isPopular ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-slate-400'}`
      : `w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isPopular ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-50 text-indigo-500'}`,
    
    planName: isDark
      ? "text-xl font-black uppercase italic tracking-wide mb-2 text-white"
      : "text-xl font-black uppercase italic tracking-wide mb-2 text-slate-800",
    
    planDesc: isDark
      ? "text-slate-500 text-xs font-medium leading-relaxed"
      : "text-slate-500 text-xs font-medium leading-relaxed",
    
    price: isDark
      ? "text-4xl font-black tracking-tight text-white"
      : "text-4xl font-black tracking-tight text-slate-800",
    
    pricePeriod: isDark
      ? "text-slate-500 text-sm font-bold uppercase tracking-widest ml-1"
      : "text-slate-400 text-sm font-bold uppercase tracking-widest ml-1",
    
    featureIcon: (isPopular) => isDark
      ? `mt-0.5 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0`
      : `mt-0.5 w-5 h-5 rounded-full ${isPopular ? 'bg-indigo-100' : 'bg-indigo-50'} flex items-center justify-center shrink-0`,
    
    featureCheck: (isPopular) => isDark
      ? isPopular ? 'text-amber-500' : 'text-slate-400'
      : isPopular ? 'text-indigo-600' : 'text-indigo-500',
    
    featureText: isDark
      ? "text-xs font-bold text-slate-300 leading-relaxed"
      : "text-xs font-bold text-slate-600 leading-relaxed",
    
    button: (isPopular) => isDark
      ? `w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 ${
          isPopular 
            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
        }`
      : `w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 ${
          isPopular 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20' 
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
        }`,
  };

  return (
    <div className={T.pageBg}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className={`w-14 h-14 rounded-2xl ${isDark ? "bg-amber-500/20" : "bg-gradient-to-br from-indigo-100 to-purple-100"} flex items-center justify-center`}>
              <Sparkles size={24} className={isDark ? "text-amber-500" : "text-indigo-600"} />
            </div>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={T.title}
          >
            Invest in Your <span className={T.titleAccent}>Future.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={T.subtitle}
          >
            Choose the plan that accelerates your career placement journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => {
            const isCurrent = currentTier && currentTier.toLowerCase() === plan.name.toLowerCase();
            const buttonAction = async () => {
              if (isCurrent) return navigate('/dashboard');
              if (plan.name === 'Pro') {
                try {
                  if (!user) return navigate('/login');
                  const res = await payWithRazorpay({ user, amount: 10, plan: 'Pro' });
                  if (res?.success) navigate('/profile');
                } catch (err) {
                  console.error('Payment failed', err);
                  alert('Payment failed. Please try again.');
                }
                return;
              }
              if (plan.name === 'Enterprise') return alert('Contact us for Enterprise plans');
              return navigate('/dashboard');
            };

            const buttonText = isCurrent ? 'Current Plan' : plan.name === 'Pro' ? 'Upgrade to Pro' : plan.buttonText || 'Choose';

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={T.card(plan.isPopular)}
              >
                {plan.isPopular && (
                  <div className={T.popularBadge}>
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={T.iconWrapper(plan.isPopular)}>
                    <plan.icon size={24} />
                  </div>
                  <h3 className={T.planName}>{plan.name}</h3>
                  <p className={T.planDesc}>{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className={T.price}>{plan.price}</span>
                  {plan.period && <span className={T.pricePeriod}>{plan.period}</span>}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={T.featureIcon(plan.isPopular)}>
                        <Check size={12} className={T.featureCheck(plan.isPopular)} />
                      </div>
                      <span className={T.featureText}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={buttonAction}
                  className={T.button(plan.isPopular)}
                >
                  {buttonText}
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-full ${isDark ? "bg-white/5 border-white/10" : "bg-indigo-50 border-indigo-100"} border`}>
            <Shield size={16} className={isDark ? "text-amber-400" : "text-indigo-600"} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              30-day money-back guarantee • Cancel anytime
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Pricing;