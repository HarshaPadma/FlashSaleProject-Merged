const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const app = express();

// Add CORS headers to all responses
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/', async (req, res) => {
    try {
        // Make a call to the third-party API
        const response = await axios.get('https://venia-hackthon-liyptoy-sgwkmfw5dcndm.ap-4.magentosite.cloud/graphql?query=query%20%7B%0A%20%20availableStores(useCurrentGroup%3A%20true)%20%7B%0A%20%20%20%20store_code%0A%20%20%20%20store_name%0A%20%20%20%20%7D%0A%7D%0A&variables=%7B%7D');
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Could not fetch data from the stores API' });
    }
});
// Start the server
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
