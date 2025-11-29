const axios = require("axios");

function getAirtableClient(token) {
  return {
    async createRecord(baseId, tableId, fields) {
      const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
      const response = await axios.post(
        url,
        { fields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      return response.data;
    }
  };
}

module.exports = { getAirtableClient };
