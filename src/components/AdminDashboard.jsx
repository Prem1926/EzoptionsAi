import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [dayTrades, setDayTrades] = useState([]);
    const [swingTrades, setSwingTrades] = useState([]);
    const [evergreenStocks, setEvergreenStocks] = useState([]);

    // Day Trades State
    const [newDayTrade, setNewDayTrade] = useState({
        ticker: '', strikePrice: '', type: '', expiry: '', qty: '', amount: '', executed: '', longShort: '', openClosed: '', premiumAmount: '',
    });
    const [editingDayTrade, setEditingDayTrade] = useState(null);

    // Swing Trades State
    const [newSwingTrade, setNewSwingTrade] = useState({
        ticker: '', strikePrice: '', type: '', expiry: '', qty: '', amount: '', executed: '', longShort: '', openClosed: '', premiumAmount: '',
    });
    const [editingSwingTrade, setEditingSwingTrade] = useState(null);

    // Evergreen Stocks State
    const [newStock, setNewStock] = useState({
        ticker: '', name: '', sector: '', price: '', marketCap: '',
    });
    const [editingStock, setEditingStock] = useState(null);

    // Fetch Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const dayTradesRes = await axios.get('https://ezoptionsai.com/api3/day-trades');
            setDayTrades(dayTradesRes.data);

            const swingTradesRes = await axios.get('https://ezoptionsai.com/api3/swing-trades');
            setSwingTrades(swingTradesRes.data);

            const evergreenStocksRes = await axios.get('https://ezoptionsai.com/api3/evergreen-stocks');
            setEvergreenStocks(evergreenStocksRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Day Trades Handlers
    const handleDayTradeChange = (e) => {
        setNewDayTrade({ ...newDayTrade, [e.target.name]: e.target.value });
    };

    const handleAddDayTrade = async () => {
        try {
            await axios.post('https://ezoptionsai.com/api3/day-trades', newDayTrade);
            setNewDayTrade({
                ticker: '', strikePrice: '', type: '', expiry: '', qty: '', amount: '', executed: '', longShort: '', openClosed: '', premiumAmount: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error adding day trade:', error);
        }
    };

    const handleEditDayTrade = (trade) => {
        setEditingDayTrade(trade);
    };

    const handleUpdateDayTrade = async () => {
        try {
            await axios.put(`https://ezoptionsai.com/api3/day-trades/${editingDayTrade._id}`, editingDayTrade);
            setEditingDayTrade(null);
            fetchData();
        } catch (error) {
            console.error('Error updating day trade:', error);
        }
    };

    const handleDeleteDayTrade = async (id) => {
        try {
            await axios.delete(`https://ezoptionsai.com/api3/day-trades/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting day trade:', error);
        }
    };

    // Swing Trades Handlers
    const handleSwingTradeChange = (e) => {
        setNewSwingTrade({ ...newSwingTrade, [e.target.name]: e.target.value });
    };

    const handleAddSwingTrade = async () => {
        try {
            await axios.post('https://ezoptionsai.com/api3/swing-trades', newSwingTrade);
            setNewSwingTrade({
                ticker: '', strikePrice: '', type: '', expiry: '', qty: '', amount: '', executed: '', longShort: '', openClosed: '', premiumAmount: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error adding swing trade:', error);
        }
    };

    const handleEditSwingTrade = (trade) => {
        setEditingSwingTrade(trade);
    };

    const handleUpdateSwingTrade = async () => {
        try {
            await axios.put(`https://ezoptionsai.com/api3/swing-trades/${editingSwingTrade._id}`, editingSwingTrade);
            setEditingSwingTrade(null);
            fetchData();
        } catch (error) {
            console.error('Error updating swing trade:', error);
        }
    };

    const handleDeleteSwingTrade = async (id) => {
        try {
            await axios.delete(`https://ezoptionsai.com/api3/swing-trades/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting swing trade:', error);
        }
    };

    // Evergreen Stocks Handlers
    const handleStockChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
    };

    const handleAddStock = async () => {
        try {
            await axios.post('https://ezoptionsai.com/api3/evergreen-stocks', newStock);
            setNewStock({
                ticker: '', name: '', sector: '', price: '', marketCap: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    const handleEditStock = (stock) => {
        setEditingStock(stock);
    };

    const handleUpdateStock = async () => {
        try {
            await axios.put(`https://ezoptionsai.com/api3/evergreen-stocks/${editingStock._id}`, editingStock);
            setEditingStock(null);
            fetchData();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleDeleteStock = async (id) => {
        try {
            await axios.delete(`https://ezoptionsai.com/api3/evergreen-stocks/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    return (
        <div className="p-4">
            {/* Day Trades Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Day Trades</h2>
                <div className="mb-4">
                    <input type="text" name="ticker" placeholder="Ticker" value={newDayTrade.ticker} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="strikePrice" placeholder="Strike Price" value={newDayTrade.strikePrice} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="type" placeholder="Type" value={newDayTrade.type} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="expiry" placeholder="Expiry" value={newDayTrade.expiry} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="number" name="qty" placeholder="Quantity" value={newDayTrade.qty} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="amount" placeholder="Amount" value={newDayTrade.amount} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="executed" placeholder="Executed" value={newDayTrade.executed} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <select name="longShort" value={newDayTrade.longShort} onChange={handleDayTradeChange} className="border p-2 mr-2">
                        <option value="">Long/Short</option>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                    </select>
                    <select name="openClosed" value={newDayTrade.openClosed} onChange={handleDayTradeChange} className="border p-2 mr-2">
                        <option value="">Open/Closed</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <input type="text" name="premiumAmount" placeholder="Premium Amount" value={newDayTrade.premiumAmount} onChange={handleDayTradeChange} className="border p-2 mr-2" />
                    <button onClick={handleAddDayTrade} className="bg-blue-500 text-white p-2 rounded">Add Trade</button>
                </div>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border p-2">Ticker</th>
                            <th className="border p-2">Strike Price</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Expiry</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Executed</th>
                            <th className="border p-2">Long/Short</th>
                            <th className="border p-2">Open/Closed</th>
                            <th className="border p-2">Premium Amount</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayTrades.map((trade) => (
                            <tr key={trade._id}>
                                <td className="border p-2">{trade.ticker}</td>
                                <td className="border p-2">{trade.strikePrice}</td>
                                <td className="border p-2">{trade.type}</td>
                                <td className="border p-2">{trade.expiry}</td>
                                <td className="border p-2">{trade.qty}</td>
                                <td className="border p-2">{trade.amount}</td>
                                <td className="border p-2">{trade.executed}</td>
                                <td className="border p-2">{trade.longShort}</td>
                                <td className="border p-2">{trade.openClosed}</td>
                                <td className="border p-2">{trade.premiumAmount}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleEditDayTrade(trade)} className="bg-yellow-500 text-white p-2 rounded mr-1">Edit</button>
                                    <button onClick={() => handleDeleteDayTrade(trade._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editingDayTrade && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Edit Day Trade</h3>
                        <input type="text" name="ticker" value={editingDayTrade.ticker} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, ticker: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="strikePrice" value={editingDayTrade.strikePrice} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, strikePrice: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="type" value={editingDayTrade.type} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, type: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="expiry" value={editingDayTrade.expiry} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, expiry: e.target.value })} className="border p-2 mr-2" />
                        <input type="number" name="qty" value={editingDayTrade.qty} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, qty: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="amount" value={editingDayTrade.amount} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, amount: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="executed" value={editingDayTrade.executed} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, executed: e.target.value })} className="border p-2 mr-2" />
                        <select name="longShort" value={editingDayTrade.longShort} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, longShort: e.target.value })} className="border p-2 mr-2">
                            <option value="">Long/Short</option>
                            <option value="Long">Long</option>
                            <option value="Short">Short</option>
                        </select>
                        <select name="openClosed" value={editingDayTrade.openClosed} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, openClosed: e.target.value })} className="border p-2 mr-2">
                            <option value="">Open/Closed</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <input type="text" name="premiumAmount" value={editingDayTrade.premiumAmount} onChange={(e) => setEditingDayTrade({ ...editingDayTrade, premiumAmount: e.target.value })} className="border p-2 mr-2" />
                        <button onClick={handleUpdateDayTrade} className="bg-blue-500 text-white p-2 rounded">Update</button>
                        <button onClick={() => setEditingDayTrade(null)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
                    </div>
                )}
            </div>

            {/* Swing Trades Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Swing Trades</h2>
                <div className="mb-4">
                    <input type="text" name="ticker" placeholder="Ticker" value={newSwingTrade.ticker} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="strikePrice" placeholder="Strike Price" value={newSwingTrade.strikePrice} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="type" placeholder="Type" value={newSwingTrade.type} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="expiry" placeholder="Expiry" value={newSwingTrade.expiry} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="number" name="qty" placeholder="Quantity" value={newSwingTrade.qty} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="amount" placeholder="Amount" value={newSwingTrade.amount} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <input type="text" name="executed" placeholder="Executed" value={newSwingTrade.executed} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <select name="longShort" value={newSwingTrade.longShort} onChange={handleSwingTradeChange} className="border p-2 mr-2">
                        <option value="">Long/Short</option>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                    </select>
                    <select name="openClosed" value={newSwingTrade.openClosed} onChange={handleSwingTradeChange} className="border p-2 mr-2">
                        <option value="">Open/Closed</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <input type="text" name="premiumAmount" placeholder="Premium Amount" value={newSwingTrade.premiumAmount} onChange={handleSwingTradeChange} className="border p-2 mr-2" />
                    <button onClick={handleAddSwingTrade} className="bg-blue-500 text-white p-2 rounded">Add Trade</button>
                </div>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border p-2">Ticker</th>
                            <th className="border p-2">Strike Price</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Expiry</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Executed</th>
                            <th className="border p-2">Long/Short</th>
                            <th className="border p-2">Open/Closed</th>
                            <th className="border p-2">Premium Amount</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {swingTrades.map((trade) => (
                            <tr key={trade._id}>
                                <td className="border p-2">{trade.ticker}</td>
                                <td className="border p-2">{trade.strikePrice}</td>
                                <td className="border p-2">{trade.type}</td>
                                <td className="border p-2">{trade.expiry}</td>
                                <td className="border p-2">{trade.qty}</td>
                                <td className="border p-2">{trade.amount}</td>
                                <td className="border p-2">{trade.executed}</td>
                                <td className="border p-2">{trade.longShort}</td>
                                <td className="border p-2">{trade.openClosed}</td>
                                <td className="border p-2">{trade.premiumAmount}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleEditSwingTrade(trade)} className="bg-yellow-500 text-white p-2 rounded mr-1">Edit</button>
                                    <button onClick={() => handleDeleteSwingTrade(trade._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editingSwingTrade && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Edit Swing Trade</h3>
                        <input type="text" name="ticker" value={editingSwingTrade.ticker} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, ticker: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="strikePrice" value={editingSwingTrade.strikePrice} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, strikePrice: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="type" value={editingSwingTrade.type} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, type: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="expiry" value={editingSwingTrade.expiry} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, expiry: e.target.value })} className="border p-2 mr-2" />
                        <input type="number" name="qty" value={editingSwingTrade.qty} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, qty: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="amount" value={editingSwingTrade.amount} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, amount: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="executed" value={editingSwingTrade.executed} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, executed: e.target.value })} className="border p-2 mr-2" />
                        <select name="longShort" value={editingSwingTrade.longShort} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, longShort: e.target.value })} className="border p-2 mr-2">
                            <option value="">Long/Short</option>
                            <option value="Long">Long</option>
                            <option value="Short">Short</option>
                        </select>
                        <select name="openClosed" value={editingSwingTrade.openClosed} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, openClosed: e.target.value })} className="border p-2 mr-2">
                            <option value="">Open/Closed</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <input type="text" name="premiumAmount" value={editingSwingTrade.premiumAmount} onChange={(e) => setEditingSwingTrade({ ...editingSwingTrade, premiumAmount: e.target.value })} className="border p-2 mr-2" />
                        <button onClick={handleUpdateSwingTrade} className="bg-blue-500 text-white p-2 rounded">Update</button>
                        <button onClick={() => setEditingSwingTrade(null)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
                    </div>
                )}
            </div>

            {/* Evergreen Stocks Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Evergreen Stocks</h2>
                <div className="mb-4">
                    <input type="text" name="ticker" placeholder="Ticker" value={newStock.ticker} onChange={handleStockChange} className="border p-2 mr-2" />
                    <input type="text" name="name" placeholder="Name" value={newStock.name} onChange={handleStockChange} className="border p-2 mr-2" />
                    <input type="text" name="sector" placeholder="Sector" value={newStock.sector} onChange={handleStockChange} className="border p-2 mr-2" />
                    <input type="text" name="price" placeholder="Price" value={newStock.price} onChange={handleStockChange} className="border p-2 mr-2" />
                    <input type="text" name="marketCap" placeholder="Market Cap" value={newStock.marketCap} onChange={handleStockChange} className="border p-2 mr-2" />
                    <button onClick={handleAddStock} className="bg-blue-500 text-white p-2 rounded">Add Stock</button>
                </div>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border p-2">Ticker</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Sector</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Market Cap</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evergreenStocks.map((stock) => (
                            <tr key={stock._id}>
                                <td className="border p-2">{stock.ticker}</td>
                                <td className="border p-2">{stock.name}</td>
                                <td className="border p-2">{stock.sector}</td>
                                <td className="border p-2">{stock.price}</td>
                                <td className="border p-2">{stock.marketCap}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleEditStock(stock)} className="bg-yellow-500 text-white p-2 rounded mr-1">Edit</button>
                                    <button onClick={() => handleDeleteStock(stock._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editingStock && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Edit Stock</h3>
                        <input type="text" name="ticker" value={editingStock.ticker} onChange={(e) => setEditingStock({ ...editingStock, ticker: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="name" value={editingStock.name} onChange={(e) => setEditingStock({ ...editingStock, name: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="sector" value={editingStock.sector} onChange={(e) => setEditingStock({ ...editingStock, sector: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="price" value={editingStock.price} onChange={(e) => setEditingStock({ ...editingStock, price: e.target.value })} className="border p-2 mr-2" />
                        <input type="text" name="marketCap" value={editingStock.marketCap} onChange={(e) => setEditingStock({ ...editingStock, marketCap: e.target.value })} className="border p-2 mr-2" />
                        <button onClick={handleUpdateStock} className="bg-blue-500 text-white p-2 rounded">Update</button>
                        <button onClick={() => setEditingStock(null)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;