// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/daytrading');
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account? {' '}
          <a 
            href="/register" 
            className="text-emerald-400 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

// src/components/Register.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to register');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 border-gray-400 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              I accept the{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-emerald-400 hover:underline"
              >
                Terms and Conditions
              </button>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-400 hover:underline">
            Login
          </a>
        </p>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Terms and Conditions for EzoptionaAi.com</h2>
            <div className="space-y-4 text-gray-300">
              <p className="italic">Effective Date: {formattedDate}<br/>Last Updated: 18 Feb, 2025</p>
              
              <p>Welcome to EzoptionaAi.com ("the Platform"). These Terms and Conditions ("Terms") govern your use of the website and its services. By accessing or using EzoptionaAi.com, you agree to comply with these Terms. If you do not agree, you must discontinue use immediately.</p>

              <h3 className="text-xl font-semibold">1. General Disclaimer</h3>
              <p>EzoptionaAi.com provides market insights, algorithmic trading alerts, and trading-related educational content based on technical analysis, historical data, and artificial intelligence models. We do NOT provide financial, investment, or trading advice. All information is for educational and informational purposes only.</p>

              <h4 className="text-lg font-semibold">1.1 No Investment Advice</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Platform does not provide personalized investment, financial, legal, or tax advice.</li>
                <li>Any trade signals, alerts, or information provided by EzoptionaAi.com should not be interpreted as financial recommendations.</li>
                <li>Users should consult with a licensed financial advisor before making any investment decisions.</li>
              </ul>

              <h4 className="text-lg font-semibold">1.2 No Guarantees on Profitability</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Past performance does not guarantee future results.</li>
                <li>Trading is inherently risky, and users acknowledge that losses are possible.</li>
                <li>EzoptionaAi.com does not assume responsibility for any financial gains or losses incurred by users.</li>
              </ul>

              <h3 className="text-xl font-semibold">2. Trading and Risk Disclosure</h3>
              <p>Trading in stocks, options, forex, and cryptocurrencies involves significant risk and is not suitable for everyone. You may lose all or more than your initial investment. You acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Market conditions fluctuate, and there is no guarantee of profit.</li>
                <li>You alone are responsible for your trading decisions.</li>
                <li>Algorithmic trading, AI-based signals, or copy trading do not remove trading risks.</li>
                <li>You should never invest money that you cannot afford to lose.</li>
              </ul>

              <h3 className="text-xl font-semibold">3. Use of AI-Powered Alerts and Copy Trading</h3>
              <p>EzoptionaAi.com provides AI-driven alerts, signals, and trade analysis for educational purposes only.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No automatic trading execution – Users must manually execute trades at their own discretion.</li>
                <li>Copy trading feature disclaimer – Any copy trading or strategy replication is done at the user's own risk. We do not guarantee identical results across different traders.</li>
              </ul>

              <h3 className="text-xl font-semibold">4. Payments, Subscriptions, and Refund Policy</h3>
              
              <h4 className="text-lg font-semibold">4.1 Payment Terms</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>EzoptionaAi.com offers subscription-based services that grant access to trading alerts, AI analysis, and other platform features.</li>
                <li>Users agree to pay all fees associated with their selected plan before accessing premium content.</li>
                <li>Payments are processed securely through third-party payment processors.</li>
              </ul>

              <h4 className="text-lg font-semibold">4.2 No Refund Policy</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>All payments are final, and there are no refunds.</li>
                <li>Once a user subscribes and pays for a service, they will not be eligible for a refund, regardless of dissatisfaction, performance, or trading outcomes.</li>
                <li>By making a payment, you acknowledge that EzoptionaAi.com does not guarantee financial gains or profitable trading results.</li>
              </ul>

              <h4 className="text-lg font-semibold">4.3 Auto-Renewal & User Responsibility</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>All subscriptions are automatically renewed at the end of each billing cycle unless canceled by the user.</li>
                <li>It is the user's responsibility to cancel the subscription before the renewal date to avoid future charges.</li>
                <li>EzoptionaAi.com is not responsible for unintended renewals due to user negligence.</li>
              </ul>

              <h4 className="text-lg font-semibold">4.4 Chargebacks and Disputes</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Filing a chargeback or payment dispute without a valid reason may result in account termination.</li>
                <li>If you have any payment-related concerns, contact [Insert Support Email] before filing a dispute.</li>
              </ul>

              <h3 className="text-xl font-semibold">5. Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, EzoptionaAi.com, its owners, employees, partners, and affiliates are not liable for any direct, indirect, incidental, special, or consequential damages resulting from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Losses incurred from trading decisions based on platform alerts.</li>
                <li>System outages, technical failures, or data inaccuracies.</li>
                <li>Unauthorized access or security breaches.</li>
                <li>Market changes or unforeseen financial events.</li>
              </ul>

              <h3 className="text-xl font-semibold">6. No Endorsement or Affiliation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>EzoptionaAi.com does not endorse any broker, exchange, or financial institution.</li>
                <li>The Platform is not affiliated with any financial regulatory bodies and does not require a financial services license since it does not provide financial advisory services.</li>
              </ul>

              <h3 className="text-xl font-semibold">7. Account Registration and User Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users must be 18 years or older to use EzoptionaAi.com.</li>
                <li>You are responsible for keeping your account information secure.</li>
                <li>Any unauthorized use of the Platform must be reported immediately.</li>
              </ul>

              <h3 className="text-xl font-semibold">8. Termination of Use</h3>
              <p>EzoptionaAi.com reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Terminate accounts found to be violating our policies.</li>
                <li>Modify, suspend, or discontinue the platform at any time without prior notice.</li>
              </ul>

              <h3 className="text-xl font-semibold">9. Governing Law and Dispute Resolution</h3>
              <p>These Terms shall be governed by the laws of [Insert Jurisdiction]. Any disputes arising from the use of the Platform shall be resolved through arbitration or legal proceedings in [Insert Jurisdiction].</p>

              <h3 className="text-xl font-semibold">10. Updates to These Terms</h3>
              <p>EzoptionaAi.com may update these Terms periodically. Continued use of the Platform after updates constitutes acceptance of the revised Terms.</p>

              <h3 className="text-xl font-semibold">11. Contact Information</h3>
              <p>If you have any questions about these Terms, please contact us at:<br/>
              📧 info@ezoptionsai.com<br/>
              📍 [Insert Company Address]</p>

              <p className="font-semibold mt-6">By using EzoptionaAi.com, you acknowledge and agree to these Terms and Conditions. If you do not accept these terms, do not use our services.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default { Login, Register };