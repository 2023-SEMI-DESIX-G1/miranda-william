const axios = require("axios");

module.exports = {
  async get(url) {
    if (url.includes("favico")) return;
    const response = await axios.get(url);
    return response.data;
  },
  async post(url, data) {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};
