import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <XCircle size={80} className="text-red-500" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Subscription Cancelled
        </h2>
        
        <p className="text-gray-600 mb-8">
          Your subscription process was cancelled. No charges have been made.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link to="/pricing" className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Return to Pricing
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;