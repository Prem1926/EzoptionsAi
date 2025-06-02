import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

const FearGreedBar = () => {
  const [currentValue, setCurrentValue] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [weekAgoValue, setWeekAgoValue] = useState(null);
  const [monthAgoValue, setMonthAgoValue] = useState(null);
  const [yearAgoValue, setYearAgoValue] = useState(null);
  const [sentiment, setSentiment] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch data from API
  const fetchFearGreedIndex = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('https://ezoptionsai.com/api3/fear-greed-index');
      
      // Process the response according to the structure you provided
      const data = response.data.data;

      console.log("Fear and Greed", data);
      
      setCurrentValue(data.fgi.now.value);
      setSentiment(data.fgi.now.valueText);
      setPreviousValue(data.fgi.previousClose.value);
      setWeekAgoValue(data.fgi.oneWeekAgo.value);
      setMonthAgoValue(data.fgi.oneMonthAgo.value);
      setYearAgoValue(data.fgi.oneYearAgo.value);
      
      // Convert the timestamp to a Date object
      setLastUpdated(new Date(data.lastUpdated.humanDate));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching fear and greed index:', err);
      setError('Failed to load data. Please try again later.');
      
      // For demo purposes, set a default value when API fails
      if (currentValue === null) {
        setCurrentValue(47);
        setSentiment('Neutral');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchFearGreedIndex();
    
    // Set up polling interval (e.g., every 5 minutes)
    const intervalId = setInterval(fetchFearGreedIndex, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Get sentiment text based on value
  const getSentiment = (value) => {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
  };
  
  // Calculate marker position as percentage
  const markerPosition = currentValue !== null ? currentValue + '%' : '50%';
  
  if (loading && currentValue === null) {
    return <div className="flex items-center gap-2 text-gray-600">Fear & Greed Index: Loading...</div>;
  }
  
  if (error && currentValue === null) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span>Fear & Greed Index: Error</span>
        <button 
          onClick={fetchFearGreedIndex}
          className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    );
  }
  
  // Display a simplified horizontal bar instead of the gauge
  return (
    <div className="flex items-center space-x-2">
      <div className="font-bold whitespace-nowrap">Fear & Greed Index:</div>
      
      <div className="relative flex-grow h-8">
        {/* Gradient background */}
        <div 
          className="w-full h-full rounded-md overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #ff6666, #ff9966, #FFCC33, #d3f0d3, #66cc66)'
          }}
        />
        
        {/* Black vertical line indicating current value */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-black"
          style={{ 
            left: markerPosition,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
      
      <div className="font-bold whitespace-nowrap">
        {currentValue} ({sentiment || getSentiment(currentValue)})
      </div>
      
      <button 
        onClick={fetchFearGreedIndex}
        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        disabled={loading}
      >
        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
  );
};

export default FearGreedBar;