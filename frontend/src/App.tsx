import { useState } from 'react';
import Search from './components/Search';
import Chart from './components/Chart';
import { LineChart, LayoutDashboard, Settings, Bell } from 'lucide-react';
import './index.css';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC-USD'); // Default to BTC

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <LineChart className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  TradeView
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <a href="#" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Markets
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Screener
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  News
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <LayoutDashboard className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Explorer</h1>
          <p className="text-gray-500">Search for Crypto, Stocks, or Argentine assets (e.g., YPF.BA, PAMP.BA).</p>
        </div>

        <div className="mb-8">
          <Search onSelect={setSelectedSymbol} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <Chart symbol={selectedSymbol} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
             <div className="space-y-3">
               <button
                 onClick={() => setSelectedSymbol('BTC-USD')}
                 className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex justify-between items-center"
               >
                 <span className="font-semibold">Bitcoin (BTC)</span>
                 <span className="text-sm text-gray-500">Crypto</span>
               </button>
               <button
                 onClick={() => setSelectedSymbol('AAPL')}
                 className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex justify-between items-center"
               >
                 <span className="font-semibold">Apple Inc. (AAPL)</span>
                 <span className="text-sm text-gray-500">US Stock</span>
               </button>
               <button
                 onClick={() => setSelectedSymbol('YPF.BA')}
                 className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex justify-between items-center"
               >
                 <span className="font-semibold">YPF S.A. (YPF.BA)</span>
                 <span className="text-sm text-gray-500">Arg Stock</span>
               </button>
               <button
                 onClick={() => setSelectedSymbol('GGAL.BA')}
                 className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex justify-between items-center"
               >
                 <span className="font-semibold">Grupo Galicia (GGAL.BA)</span>
                 <span className="text-sm text-gray-500">Arg Stock</span>
               </button>
             </div>

             <div className="mt-8 pt-6 border-t border-gray-100">
               <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About TradeView</h4>
               <p className="text-sm text-gray-600">
                 A modern, fluid web application for tracking global markets, including local Argentine stocks, US markets, and cryptocurrencies. Powered by lightweight-charts and Yahoo Finance data.
               </p>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
