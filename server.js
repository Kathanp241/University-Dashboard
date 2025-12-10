// server.js
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const University = require("./models/University");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 1. CONNECT TO MONGODB
mongoose
  .connect("mongodb://127.0.0.1:27017/universities_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error", err));

// 🔹 2. DATA INGESTION ROUTE (LEVEL 1)
//    Fetch from public API and store in DB
app.post("/ingest", async (req, res) => {
  try {
    const { country } = req.body; // e.g. { "country": "India" }

    if (!country) {
      return res.status(400).json({ message: "country is required in body" });
    }

    // Fetch from public API
    const apiRes = await axios.get(
      `http://universities.hipolabs.com/search?country=${country}`
    );
    const data = apiRes.data;

    // Prepare docs
    const docs = data.map((u) => ({
      name: u.name,
      country: u.country,
      stateProvince: u["state-province"],
      webPages: u.web_pages,
      domains: u.domains,
      alphaTwoCode: u["alpha_two_code"]
    }));

    // Optional: clear old records of that country
    await University.deleteMany({ country });

    // Insert new docs
    await University.insertMany(docs);

    res.json({
      message: `Ingested ${docs.length} universities for ${country}`,
      count: docs.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ingesting data" });
  }
});

// 🔹 3. SEARCH API (FOR FRONTEND)
//    GET /universities?country=India&state=Gujarat
app.get("/universities", async (req, res) => {
  try {
    const { country, state } = req.query;
    const query = {};

    if (country) query.country = country;
    if (state) query.stateProvince = state;

    const universities = await University.find(query).sort({ name: 1 });

    res.json(universities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching universities" });
  }
});

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("University API running ✅");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
