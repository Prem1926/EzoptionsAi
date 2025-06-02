import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const StripePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Plan details
  const plans = {
    monthly: {
      name: 'Monthly Plan',
      priceId: 'price_1Qw4E1H8ydpW9nUPCsnRbt4Y',
      amount: 50,
      interval: 'month'
    },
    annual: {
      name: 'Annual Plan',
      priceId: 'price_1Qw4EuH8ydpW9nUPzGXRTed6',
      amount: 600,
      interval: 'year'
    }
  };

  // Check if plan was passed as a URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan && plans[plan]) {
      setSelectedPlan(plan);
    }
  }, [location]);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('');

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    if (error) {
      setPaymentStatus(error.message);
      setIsProcessing(false);
      return;
    }

    // Send payment method to backend
    try {
      const response = await fetch('https://ezoptionsai.com/api3/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          userId: user.id,
          priceId: plans[selectedPlan].priceId
        })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('Subscription successful!');
        // Redirect to success page after a delay
        setTimeout(() => {
          navigate('/subscription/success');
        }, 2000);
      } else {
        setPaymentStatus(result.message || 'Payment failed');
      }
    } catch (err) {
      setPaymentStatus('Network error. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Subscribe to Premium
        </h2>
        
        {/* Plan Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Choose your plan:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => handlePlanChange('monthly')}
            >
              <div className="font-medium text-gray-800">Monthly</div>
              <div className="text-2xl font-bold text-gray-900">${plans.monthly.amount}</div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === 'annual' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => handlePlanChange('annual')}
            >
              <div className="font-medium text-gray-800">Annual</div>
              <div className="text-2xl font-bold text-gray-900">${plans.annual.amount}</div>
              <div className="text-sm text-gray-500">per year</div>
              <div className="text-xs font-semibold text-green-600 mt-1">Save 16%</div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          
          {paymentStatus && (
            <div className={`p-3 rounded ${
              paymentStatus.includes('successful') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {paymentStatus}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Subscribe - $${plans[selectedPlan].amount}/${plans[selectedPlan].interval}`}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          <p>Secure payment with Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;