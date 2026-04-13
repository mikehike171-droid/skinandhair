
const axios = require('axios');

async function checkServices() {
    try {
        const response = await axios.get('http://98.94.89.173:3002/api/service-product');
        console.log(JSON.stringify(response.data.slice(0, 10), null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkServices();
