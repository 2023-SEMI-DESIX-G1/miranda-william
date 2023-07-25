const axios = require("axios");

module.exports = {
  async get(url) {
    if (url.includes("favico")) return;
    const rawResponse = await axios.get(url);
    return rawResponse.data;
  },
  async post(url, data) {
    const rawResponse = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rawResponse.data;
  },
};
