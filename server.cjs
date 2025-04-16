/* const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/fatsecret-search", async (req, res) => {
  try {
    const { query, max_results } = req.body;

    const clientId = process.env.VITE_FASTSECRET_CLIENT_ID;
    const clientSecret = process.env.VITE_FASTSECRET_CONSUMER_SECRET;

    // Get token
    const tokenResponse = await axios.post(
      "https://oauth.fatsecret.com/connect/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;

    // Call FatSecret search API
    const searchResponse = await axios.get(
      `https://platform.fatsecret.com/rest/server.api`,
      {
        params: {
          method: "foods.search",
          search_expression: query,
          format: "json",
          max_results: max_results || 4,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(searchResponse.data);
  } catch (err) {
    console.error("Search error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
 */
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const fatsecretSearchHandler = require("./api/fatsecret-search.cjs");

app.post("/api/fatsecret-search", fatsecretSearchHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`✅ Proxy server running on http://localhost:${PORT}`)
);
