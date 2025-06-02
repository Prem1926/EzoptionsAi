import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PricingScreen = () => {
  const [selectedInterval, setSelectedInterval] = useState('monthly'); // 'monthly' or 'annual'
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Monthly Plan',
      description: 'AI-powered stock recommendations with real-time insights.',
      price: 50,
      interval: 'month',
      features: [
        'Real-time market data',
        'AI-powered stock recommendations',
        'Expert-curated stock picks',
        'Personalized alerts',
        'Trading signals'
      ],
      priceId: 'price_1Qw4E1H8ydpW9nUPCsnRbt4Y',
      productId: 'prod_RpjhOzKRbDNFsv',
      highlight: false
    },
    {
      name: 'Annual Plan',
      description: 'Save 16% with our annual subscription.',
      price: 600,
      interval: 'year',
      features: [
        'All Monthly Plan features',
        '16% savings vs monthly plan',
        'Priority customer support',
        'Advanced portfolio analysis',
        'Extended historical data access'
      ],
      priceId: 'price_1Qw4EuH8ydpW9nUPzGXRTed6',
      productId: 'prod_RpjixP0tHcz7yR',
      highlight: true
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://ezoptionsai.com/api3/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id
        })
      });

      const result = await response.json();

      if (result.success && result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        alert(result.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Get access to premium financial data and AI-powered recommendations to make smarter investment decisions.
        </p>

        {/* Toggle between monthly and annual */}
        <div className="inline-flex items-center bg-gray-800 rounded-full p-1 mb-12">
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              selectedInterval === 'monthly' ? 'bg-emerald-600 text-white' : 'text-gray-300'
            }`}
            onClick={() => setSelectedInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              selectedInterval === 'annual' ? 'bg-emerald-600 text-white' : 'text-gray-300'
            }`}
            onClick={() => setSelectedInterval('annual')}
          >
            Annual <span className="text-xs font-semibold text-emerald-400">SAVE 16%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans
            .filter(plan => 
              (selectedInterval === 'monthly' && plan.interval === 'month') || 
              (selectedInterval === 'annual' && plan.interval === 'year')
            )
            .map((plan, index) => (
              <div 
                key={index}
                className={`bg-gray-800 rounded-xl p-8 shadow-lg border-2 ${
                  plan.highlight ? 'border-emerald-500' : 'border-gray-700'
                } relative`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/{plan.interval}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
            <p className="text-gray-300">Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your billing period.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Do you offer a free trial?</h3>
            <p className="text-gray-300">We currently don't offer a free trial, but we do have a satisfaction guarantee. If you're not satisfied with our service, contact us within 7 days for a full refund.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">How accurate are the recommendations?</h3>
            <p className="text-gray-300">Our AI-powered recommendations are based on sophisticated algorithms and real-time market data. While we strive for high accuracy, all investments involve risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingScreen;