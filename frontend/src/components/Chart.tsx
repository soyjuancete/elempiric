import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, LineData, CandlestickData, Time } from 'lightweight-charts';

interface ChartProps {
  symbol: string;
}

const Chart: React.FC<ChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [smaData, setSmaData] = useState<LineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:3001/api/history?symbol=${symbol}&range=1y`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        // Data is expected to have { time, open, high, low, close }
        const candleData: CandlestickData[] = data.map((d: any) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        // Calculate SMA 20
        const smaPeriod = 20;
        const sData: LineData[] = [];
        for (let i = smaPeriod - 1; i < candleData.length; i++) {
          let sum = 0;
          for (let j = 0; j < smaPeriod; j++) {
            sum += candleData[i - j].close;
          }
          sData.push({ time: candleData[i].time, value: sum / smaPeriod });
        }

        setChartData(candleData);
        setSmaData(sData);
      } catch (err: any) {
        setError(err.message || 'Error fetching chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#ffffff' } as any,
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    const smaSeries = chart.addLineSeries({
      color: 'rgba(4, 111, 232, 1)',
      lineWidth: 2,
    });

    lineSeriesRef.current = smaSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current && chartData.length > 0) {
      // Need to filter out duplicate times, lightweight-charts expects unique sorted times
      // We assume data is sorted, but ensure uniqueness
      const uniqueData = chartData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.time === item.time
        ))
      );
      // Ensure sorted by time
      uniqueData.sort((a, b) => (a.time as number) - (b.time as number));
      candlestickSeriesRef.current.setData(uniqueData);
    }

    if (lineSeriesRef.current && smaData.length > 0) {
      const uniqueSmaData = smaData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.time === item.time
        ))
      );
      uniqueSmaData.sort((a, b) => (a.time as number) - (b.time as number));
      lineSeriesRef.current.setData(uniqueSmaData);
    }
  }, [chartData, smaData]);

  if (!symbol) return <div className="text-gray-500 text-center p-8">Search for a symbol to display chart</div>;
  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{symbol} <span className="text-sm font-normal text-gray-500">1D, 1Y (SMA 20)</span></h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
             <span className="text-sm text-gray-600">SMA 20</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default Chart;
