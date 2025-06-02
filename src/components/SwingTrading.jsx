import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, User, Filter, Newspaper } from 'lucide-react';
import FearGreedGauge from './FearGreedGauge';
import Logo from '../assets/ezoptions_logo.png';
import axios from 'axios';

const SwingTrading = () => {
  const [trades, setTrades] = useState([]);
  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const { user, logout } = useAuth();

  const fetchSwingTrades = async(isManualRefresh = false) => {
    if (isManualRefresh) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await axios.get('https://ezoptionsai.com/api3/swing-trades');
      setTrades(response.data);
    } catch (err) {
      console.error('Error fetching swing trades:', err);
      setError('Failed to load trade data. Please try again.');
    } finally {
      if (isManualRefresh) {
        setLoading(false);
      }
    }
  }

  // Function to fetch news from API
  const fetchNews = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setNewsLoading(true);
    }
    setNewsError(null);
    try {
      const response = await axios.get('https://ezoptionsai.com/api3/news');
      // Assuming the news data is in response.data.results
      const newsData = response.data.data.results || [];
      setNews(newsData);
      
      // Extract the latest breaking news (news from last hour)
      const currentTime = new Date();
      const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
      
      const latestBreakingNews = newsData
        .filter(item => {
          const publishDate = new Date(item.published_utc);
          return publishDate > oneHourAgo && item.title.includes('BREAKING');
        })
        .slice(0, 3); // Get max 3 breaking news items
      
      setBreakingNews(latestBreakingNews);
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError('Failed to load news data. Please try again.');
    } finally {
      if (isManualRefresh) {
        setNewsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchSwingTrades(true);
    fetchNews(true);

    // Set up interval to refresh data every 5 seconds
    const tradesIntervalId = setInterval(() => {
      fetchSwingTrades();
    }, 5000);

    // Set up interval to refresh news every 30 seconds
    const newsIntervalId = setInterval(() => {
      fetchNews();
    }, 30000);

    // Cleanup the intervals on component unmount
    return () => {
      clearInterval(tradesIntervalId);
      clearInterval(newsIntervalId);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    // Redirect logic would go here
  };

  const handleRefresh = () => {
    fetchSwingTrades(true);
    fetchNews(true);
  };

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || filter === trade.status;
    return matchesSearch && matchesFilter;
  });

  // Function to determine the styling for P/L and return values
  const getProfitLossColor = (value) => {
    if (value.startsWith('+')) return 'text-green-500';
    if (value.startsWith('-')) return 'text-red-500';
    return '';
  };

  // Helper function to format date as time only (HH:MM AM/PM)
  const formatNewsTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Function to get sentiment icon
  const getSentimentIcon = (sentiment) => {
    if (!sentiment) return '⚪';
    switch(sentiment.toLowerCase()) {
      case 'positive':
        return '🟢';
      case 'negative':
        return '🔴';
      default:
        return '⚪';
    }
  };

  // Get a ticker's sentiment from insights
  const getTickerSentiment = (article, ticker) => {
    if (!article.insights) return null;
    const insight = article.insights.find(
      insight => insight.ticker === ticker
    );
    return insight ? insight.sentiment : null;
  };

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Function to get the latest breaking news text for the banner
  const getBreakingNewsText = () => {
    if (breakingNews.length === 0) return null;
    
    return breakingNews.map(news => {
      // Extract ticker if available
      const ticker = news.tickers && news.tickers.length > 0 ? news.tickers[0] : '';
      // Truncate title to make it concise for the banner
      const title = truncateText(news.title, 60);
      return ticker ? `${ticker}: ${title}` : title;
    }).join(' | ');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img src={Logo} alt="EzOptions Logo" className='w-20' />
            </div>

            {/* Navigation */}
            <nav className="flex gap-6">
              {/* <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                Signals
              </Link> */}
              <Link to="/daytrading" className="text-gray-600 hover:text-blue-600">
                Day Trading
              </Link>
              <Link to="/swingtrading" className="text-blue-600 font-semibold">
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
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
        
        {/* Breaking News Banner - Only show if there's breaking news */}
        {breakingNews.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 rounded-lg shadow-lg p-4 flex justify-between items-center">
            <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
              <span className="font-bold text-white">BREAKING: </span>
              <span className="text-white">{getBreakingNewsText()}</span>
            </div>
            <button 
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ml-4"
            >
              <RefreshCw className={`w-4 h-4 ${loading || newsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Swing Trading Dashboard */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              {/* Fear & Greed Gauge Component */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-5">
                <FearGreedGauge />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Swing Trading Dashboard</h1>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by ticker..."
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
                      <option value="ALL">All Trades</option>
                      <option value="ACTIVE">Active</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => fetchSwingTrades(true)}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">📈 Swing Trade Positions</h2>
                      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-purple-600 text-white">
                          <tr>
                            <th className="py-3 px-4 text-left">Ticker</th>
                            <th className="py-3 px-4 text-left">Strike Price</th>
                            <th className="py-3 px-4 text-left">Type</th>
                            <th className="py-3 px-4 text-left">Expiry</th>
                            <th className="py-3 px-4 text-center">Qty</th>
                            <th className="py-3 px-4 text-right">Amount</th>
                            <th className="py-3 px-4 text-center">Entry Date</th>
                            <th className="py-3 px-4 text-center">Exit Date</th>
                            <th className="py-3 px-4 text-right">Current Value</th>
                            <th className="py-3 px-4 text-right">Return (%)</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredTrades.map(trade => (
                            <tr key={trade.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{trade.ticker}</td>
                              <td className="py-3 px-4">{trade.strikePrice}</td>
                              <td className="py-3 px-4">{trade.type}</td>
                              <td className="py-3 px-4">{trade.expiry}</td>
                              <td className="py-3 px-4 text-center">{trade.qty}</td>
                              <td className="py-3 px-4 text-right">{trade.amount}</td>
                              <td className="py-3 px-4 text-center">{trade.executed}</td>
                              <td className="py-3 px-4 text-center">{trade.closing}</td>
                              <td className={`py-3 px-4 text-right font-semibold ${trade.livePL.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                                {trade.livePL}
                              </td>
                              <td className={`py-3 px-4 text-right ${getProfitLossColor(trade.returnPercentage)}`}>
                                {trade.returnPercentage}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${trade.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {trade.status}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-center font-semibold ${trade.result === 'Profit' ? 'text-green-500' : trade.result === 'Loss' ? 'text-red-500' : ''}`}>
                                {trade.result}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - News */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Live Market Events</h2>
                <Newspaper className="w-6 h-6 text-gray-600" />
              </div>
              
              {newsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : newsError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{newsError}</span>
                  <button
                    className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => fetchNews(true)}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {news.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No news available at the moment.
                    </div>
                  ) : (
                    news.slice(0, 5).map((article) => (
                      <li key={article.id} className="border-b pb-3 last:border-0">
                        <div className="flex items-start gap-2">
                          {article.tickers && article.tickers.length > 0 && (
                            <span className="text-2xl" title={`Sentiment: ${getTickerSentiment(article, article.tickers[0])}`}>
                              {getSentimentIcon(getTickerSentiment(article, article.tickers[0]))}
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {article.tickers && article.tickers.length > 0 && (
                                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2">
                                  {article.tickers[0]}
                                </span>
                              )}
                              {formatNewsTime(article.published_utc)}
                            </p>
                            <a 
                              href={article.article_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-800 hover:text-blue-600"
                            >
                              {truncateText(article.title, 100)}
                            </a>
                            <p className="text-gray-600 text-sm mt-1">
                              {truncateText(article.description, 120)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwingTrading;