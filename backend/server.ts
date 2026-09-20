import express from 'express';
import cors from 'cors';
const yahooFinance = require('yahoo-finance2').default;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      res.status(400).json({ error: 'Missing query parameter q' });
      return;
    }
    const yf = new yahooFinance();
    const results: any = await yf.search(q as string);
    res.json(results.quotes || results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search symbols' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const symbol = req.query.symbol as string;
    const interval = req.query.interval;
    const range = req.query.range as string || '1y';

    if (!symbol) {
      res.status(400).json({ error: 'Missing query parameter symbol' });
      return;
    }

    const queryOptions: any = {
      interval: interval || '1d',
    };

    // To use range we use period1 and period2
    const now = new Date();
    let period1 = new Date();

    if (range.endsWith('d')) {
       period1.setDate(now.getDate() - parseInt(range));
    } else if (range.endsWith('mo')) {
       period1.setMonth(now.getMonth() - parseInt(range));
    } else if (range.endsWith('y')) {
       period1.setFullYear(now.getFullYear() - parseInt(range));
    } else {
       period1.setFullYear(now.getFullYear() - 1);
    }

    queryOptions.period1 = period1;
    queryOptions.period2 = now;

    const yf = new yahooFinance();
    const results: any = await yf.chart(symbol, queryOptions);
    const data = results.quotes || [];

    const formattedData = data.filter((item: any) => item.open !== null && item.close !== null).map((item: any) => ({
      time: item.date.getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
