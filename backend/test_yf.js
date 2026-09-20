import yahooFinance from 'yahoo-finance2';
yahooFinance.search('AAPL').then(res => console.log(res.quotes[0].symbol)).catch(console.error);
