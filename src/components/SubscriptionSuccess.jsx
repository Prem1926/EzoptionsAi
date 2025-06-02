import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SubscriptionSuccess = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('https://ezoptionsai.com/api3/subscription-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        
        if (data.success && data.hasActiveSubscription) {
          setSubscriptionDetails(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  // Format date from unix timestamp
  const formatDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Subscription Successful!
        </h2>
        
        {isLoading ? (
          <p className="text-gray-600 mb-6">Loading your subscription details...</p>
        ) : subscriptionDetails ? (
          <div className="mb-8 text-left">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Subscription Details:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium">Status:</span>{' '}
                  <span className="text-green-600 font-medium">Active</span>
                </li>
                <li>
                  <span className="font-medium">Plan:</span>{' '}
                  {subscriptionDetails.plan.interval === 'month' ? 'Monthly' : 'Annual'} Plan
                </li>
                <li>
                  <span className="font-medium">Price:</span>{' '}
                  ${subscriptionDetails.plan.amount}/{subscriptionDetails.plan.interval}
                </li>
                <li>
                  <span className="font-medium">Current period ends:</span>{' '}
                  {formatDate(subscriptionDetails.currentPeriodEnd)}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            Your subscription has been processed. It may take a moment for your account to be updated.
          </p>
        )}
        
        <p className="text-gray-600 mb-8">
          Thank you for subscribing! You now have access to all premium features.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link to="/daytrading" className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Dashboard
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;