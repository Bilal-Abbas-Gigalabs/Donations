const axios = require('axios');

class CurrencyService {
    async getCurrencies() {
        const response = await axios.get(`http://${process.env.NEXT_PUBLIC_APP_HOST}:${process.env.NEXT_PUBLIC_APP_PORT}/api/currencies`);

        return response.data;
    }

    async exchangeCurrency(amount, from, to = 'USD') {
        const response = await axios.get(`https://api.apilayer.com/exchangerates_data/convert?amount=${amount}&from=${from}&to=${to}`, {
            headers: {
                apikey: process.env.COINBASE_API_KEY,
            }
        });

        return response.data;
    }
}

module.exports = new CurrencyService();