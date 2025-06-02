import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, ArrowUpCircle, ArrowDownCircle, MinusCircle, RefreshCw, LogOut, User } from 'lucide-react';
import ChatPopup from './ChatPopup';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Logo from '../assets/ezoptions_logo.png';

const Grapher = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const { user, startSubscription, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubscription = async () => {
    try {
      await startSubscription();
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout method from AuthContext
    navigate('/login'); // Redirect to login page
  };

  const SubscriptionStatus = () => {

    if (user?.subscription?.type === 'pro') {
      return (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span>Pro Subscription Active</span>
            <span className="text-sm ml-4">
              Expires: {new Date(user.subscription.expires_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            {/* Removed red logout button from here */}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="mr-2" />
          <span>Upgrade to Pro for Full Access</span>
        </div>
        <div className="flex items-center">
          <Link to="/pricing">
            <button
              // onClick={handleSubscription}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded mr-2"
            >
              Upgrade
            </button>
          </Link>
          {/* Removed red logout button from here */}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Initial load of RSI data
    fetchStockData();
    setIsFirstVisit(false);

    // Set up the interval for checking conditions - only for RSI endpoint
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const currentMinute = currentDate.getMinutes();

      // Check if we should update based on the condition
      const shouldUpdate = isFirstVisit || currentMinute % 5 === 3;

      if (shouldUpdate) {
        fetchStockData();
      }
    }, 60000); // Check every minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Removed selectedStock dependency since we don't auto-update graph

  // Modify fetchStockData to check subscription
  const fetchStockData = async () => {
    // Check if user has active subscription
    // if (user?.subscription?.type !== 'pro') {
    //   // Show upgrade prompt or limit functionality
    //   return;
    // }

    setLoading(true);
    try {
      const response = await fetch('https://ezoptionsai.com/api3/rsi', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStocks(data.message);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
    setLoading(false);
  };

  const fetchGraphData = async (symbol) => {
    try {
      const response = await fetch('https://ezoptionsai.com/api3/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });
      const data = await response.json();
      setGraphData(data.message);
      setSelectedStock(symbol);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.stock.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || stock.signal === filter;
    return matchesSearch && matchesFilter;
  });

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'BUY': return 'text-green-600';
      case 'SELL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'BUY': return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case 'SELL': return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      default: return <MinusCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img src={Logo} alt="EzOptions Logo"  className='w-20'/>
            </div>

            {/* Navigation */}
            <nav className="flex gap-6">
              {/* <Link to="/dashboard" className="text-blue-600 font-semibold">
                Signals
              </Link> */}
              <Link to="/daytrading" className="text-gray-600 hover:text-blue-600">
                Day Trading
              </Link>
              <Link to="/swingtrading" className="text-gray-600 hover:text-blue-600">
                Swing Trading
              </Link>
              <Link to="/evergreen" className="text-gray-600 hover:text-blue-600">
                Evergreen Stocks
              </Link>
            </nav>

            {/* Profile Section */}
            <div className="relative" onClick={handleProfileClick}>
              <User className="w-6 h-6 text-gray-600 cursor-pointer" />
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">
                    Profile Name
                  </div>
                  <Link to="/edit-profile" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <span>-Edit Profile</span>
                  </Link>
                  <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    {user?.username}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    {user?.email}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    Change Password
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    {user?.subscription?.type === 'pro' ? 'Active' : 'Inactive'} Subscription
                  </div>
                  {/* <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    -Device Login
                  </div> */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Add SubscriptionStatus component near the top */}
        <SubscriptionStatus />
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">S&P 500 Dashboard</h1>
            <button
              onClick={fetchStockData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="pl-10 w-full p-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded-lg bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Signals</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="gap-6">
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px]">
                <h2 className="text-xl font-semibold mb-4">Stock List</h2>
                <div className="space-y-2">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.stock}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => fetchGraphData(stock.stock)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{stock.stock}</h3>
                          <p className="text-gray-600">${stock.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSignalIcon(stock.signal)}
                          <span className={`font-medium ${getSignalColor(stock.signal)}`}>
                            {stock.signal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">RSI Analysis</h2>
                {selectedStock ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="rsi" 
                        stroke="#2563eb" 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    Select a stock to view RSI analysis
                  </div>
                )}
              </div> */}
            </div>
          )}
          <ChatPopup />
        </div>
      </div>
    </div>
  );
};

export default Grapher;