import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Calendar, FileText, Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardImage from '../assets/Leonardo_Phoenix_09_Design_a_sleek_modern_dashboard_for_a_stoc_0.jpg';

const FinancialDashboard = () => {
  const [marketData, setMarketData] = useState({
    crypto: [
      { symbol: 'BTC/USD', price: 97694.73, change: -0.52, changeAmount: -515.12, lastPrice: 97694.73 },
      { symbol: 'ETH/USD', price: 3624.29, change: -0.88, changeAmount: -32.11, lastPrice: 3624.29 }
    ],
    forex: [
      { symbol: 'EUR/USD', price: 1.0309, change: 0.41, changeAmount: 0.0042, lastPrice: 1.0309 },
      { symbol: 'GBP/USD', price: 1.2422, change: 0.33, changeAmount: 0.0041, lastPrice: 1.2422 }
    ],
    stocks: [
      { symbol: 'AAPL', price: 243.36, change: -0.20, changeAmount: -0.9, lastPrice: 243.36 },
      { symbol: 'MSFT', price: 423.35, change: 1.14, changeAmount: 4.77, lastPrice: 423.35 }
    ]
  });

  // Sample profit chart data
  const [profitChartData, setProfitChartData] = useState([
    { date: '2024-05-01', profit: 20000 },
    { date: '2024-06-01', profit: 10000 },
    { date: '2024-07-01', profit: -30000 },
    { date: '2024-08-01', profit: -100000 },
    { date: '2024-09-01', profit: -60000 },
    { date: '2024-10-01', profit: -30000 },
    { date: '2024-11-01', profit: 40000 },
    { date: '2024-12-01', profit: 80000 },
    { date: '2025-01-01', profit: 60000 },
    { date: '2025-02-01', profit: 50000 },
    { date: '2025-03-01', profit: 70000 },
    { date: '2025-04-01', profit: 71784 }
  ]);

  // Sample latest trades data
  const [latestTrades, setLatestTrades] = useState([
    { id: 1, date: '2025-05-01', ticker: 'AAPL', type: 'Call', strike: '$100', result: 'Profit', pl: '$45' },
    { id: 2, date: '2025-04-30', ticker: 'TSLA', type: 'Put', strike: '$110', result: 'Loss', pl: '$-80' },
    { id: 3, date: '2025-04-29', ticker: 'SPY', type: 'Call', strike: '$120', result: 'Loss', pl: '$75' },
    { id: 4, date: '2025-04-28', ticker: 'AMD', type: 'Put', strike: '$130', result: 'Profit', pl: '$-93' },
    { id: 5, date: '2025-04-27', ticker: 'NVDA', type: 'Call', strike: '$140', result: 'Profit', pl: '$-64' }
  ]);

  // Function to generate random price movement
  const generateNewPrice = (currentPrice) => {
    const changePercent = (Math.random() - 0.5) * 0.002;
    return currentPrice * (1 + changePercent);
  };

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => {
        const updateSection = (section) => {
          return section.map(item => {
            const newPrice = generateNewPrice(item.price);
            const priceChange = ((newPrice - item.lastPrice) / item.lastPrice) * 100;
            const changeAmount = newPrice - item.lastPrice;

            return {
              ...item,
              price: newPrice,
              change: priceChange,
              changeAmount: changeAmount,
              isIncreasing: newPrice > item.price,
              isDecreasing: newPrice < item.price,
            };
          });
        };

        return {
          crypto: updateSection(prevData.crypto),
          forex: updateSection(prevData.forex),
          stocks: updateSection(prevData.stocks),
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Price display component with animation
  const PriceDisplay = ({ price, isIncreasing, isDecreasing }) => {
    return (
      <span
        className={`transition-colors duration-500 ${isIncreasing ? 'text-green-500' :
          isDecreasing ? 'text-red-500' : ''
          }`}
      >
        {price.toFixed(2)}
      </span>
    );
  };

  // Ticker Item Component
  const TickerItem = ({ item }) => (
    <div className="flex items-center space-x-2 min-w-fit px-4">
      <span className="font-semibold">{item.symbol}</span>
      <PriceDisplay
        price={item.price}
        isIncreasing={item.isIncreasing}
        isDecreasing={item.isDecreasing}
      />
      <div className={`flex items-center ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {item.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{Math.abs(item.change).toFixed(2)}%</span>
        <span className="text-sm">({item.changeAmount.toFixed(2)})</span>
      </div>
    </div>
  );

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
          <p className="text-white">{`Date: ${label}`}</p>
          <p className="text-green-500">{`Profit: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Ticker Container with Horizontal Scroll */}
      <div className="w-full bg-gray-800 overflow-hidden">
        <div className="relative">
          <div className="flex whitespace-nowrap animate-ticker">
            {/* First set of items */}
            {[...marketData.crypto, ...marketData.forex, ...marketData.stocks].map((item, index) => (
              <TickerItem key={`first-${index}`} item={item} />
            ))}
            {/* Duplicate set for seamless loop */}
            {[...marketData.crypto, ...marketData.forex, ...marketData.stocks].map((item, index) => (
              <TickerItem key={`second-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center items-center px-4 lg:px-20 mb-8">
        {/* <h1 className="text-5xl font-bold mb-4">Financial Data API</h1>
        <p className="text-xl text-gray-300 mb-6">
          Democratize Financial Data with the most powerful financial API on the market.
        </p>

        <h2 className="text-3xl font-bold mb-4">
          Real-Time RESTful APIs and Websocket for Stocks, Currencies, and Crypto.
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Access real-time financial API, institutional-grade fundamental and alternative data to supercharge your investment for FREE.
        </p> */}

        {/* <div className="flex gap-4 items-center justify-center flex-wrap">
          <Link to="/login">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Sign-In
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Dashboard
            </button>
          </Link>
          <Link to="/pricing">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Pricing
            </button>
          </Link>
        </div> */}
        {/* <div className='my-5'>
          <img src={DashboardImage} className='mx-auto' />
        </div> */}
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 lg:px-8">
        {/* Branding Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-200 p-2 rounded mr-2">
            <div className="text-green-600 font-bold text-lg">📈</div>
          </div>
          <h1 className="text-4xl font-bold text-green-600">EzOptions: Trusted Profits in Real Time</h1>
        </div>

        <div className="flex gap-4 items-center justify-center flex-wrap my-10">
          <Link to="/login">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Sign-In
            </button>
          </Link>
          <Link to="/daytrading">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Dashboard
            </button>
          </Link>
          <Link to="/pricing">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md">
              Pricing
            </button>
          </Link>
        </div>

        {/* Profit Banner */}
        <div className="bg-gray-950 text-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-center text-xl text-gray-200 font-medium mb-2">
            Total Profit This Year from Our Alerts
          </h2>
          <div className="text-center">
            <div className="text-green-600 text-6xl font-bold mb-2">$71,784</div>
            <p className="text-gray-200 italic">Generated from real strategy-backed option alerts</p>
          </div>
        </div>

        {/* Profit Chart */}
        <div className="bg-gray-950 text-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="text-green-600 mr-2" />
            <h2 className="text-xl font-bold">Zig-Zag Daily Profit Overview (Full Year)</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitChartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                  }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4 text-green-600">
            <span className="inline-flex items-center">
              ⓘ Hover or click to explore real profit/loss movement toward total gains.
            </span>
          </div>
        </div>

        {/* Join Button */}
        <div className="text-center mb-8">
          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-xl inline-flex items-center">
              <Rocket className="mr-2" size={20} />
              Join EzOptions Now & Start Winning
            </button>
          </Link>
        </div>

        {/* Latest Trades */}
        <div className="bg-gray-950 text-gray-200 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <FileText className="text-gray-600 mr-2" />
            <h2 className="text-xl font-bold">Latest Trades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Strike</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">P/L</th>
                </tr>
              </thead>
              <tbody>
                {latestTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">{trade.id}</td>
                    <td className="py-3 px-4">{trade.date}</td>
                    <td className="py-3 px-4">{trade.ticker}</td>
                    <td className="py-3 px-4">{trade.type}</td>
                    <td className="py-3 px-4">{trade.strike}</td>
                    <td className={`py-3 px-4 ${trade.result === 'Profit' ? 'text-green-600' : 'text-red-500'}`}>
                      {trade.result}
                    </td>
                    <td className="py-3 px-4">{trade.pl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Original API Section */}

      </div>

      {/* CSS for animation */}
      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 30s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default FinancialDashboard;