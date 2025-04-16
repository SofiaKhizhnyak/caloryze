import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { query } = req.body;

      const clientId = process.env.FATSECRET_CLIENT_ID;
      const clientSecret = process.env.FATSECRET_CONSUMER_SECRET;

      if (!clientId || !clientSecret) {
        return res.status(500).json({ error: "Missing API credentials" });
      }

      // Get OAuth token
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

      // Fetch food data using the token
      const searchResponse = await axios.get(
        "https://platform.fatsecret.com/rest/server.api",
        {
          params: {
            method: "foods.search",
            search_expression: query,
            format: "json",
            max_results: 4,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.status(200).json(searchResponse.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      return res.status(500).json({
        error: "Failed to fetch food data",
        details: err.message,
      });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
