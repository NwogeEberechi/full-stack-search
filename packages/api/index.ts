import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  await import("./db/startAndSeedMemoryDB");
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hotels", async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();
    const collection = db.collection("hotels");
    res.send(await collection.find().toArray());
  } finally {
    await mongoClient.close();
  }
});

app.get("/search", async (req, res) => {
  const { query } = req.query;
  const escapedQuery = (query as string)?.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
  const regex = new RegExp(escapedQuery, "i");
  if (!query || typeof query !== "string") {
    return res.status(400).send("Query parameter is required");
  }

  const mongoClient = new MongoClient(DATABASE_URL);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();

    const [hotels, cities, countries] = await Promise.all([
      db
        .collection("hotels")
        .find({
          $or: [{ hotel_name: regex }, { city: regex }, { country: regex }],
        })
        .toArray(),
      db
        .collection("cities")
        .find({
          name: regex,
        })
        .toArray(),
      db
        .collection("countries")
        .find({
          country: regex,
        })
        .toArray(),
    ]);
    res.send({ hotels, cities, countries });
  } finally {
    await mongoClient.close();
  }
});

app.get("/hotels/:id", async (req, res) => {
  const { id } = req.params;
  const mongoClient = new MongoClient(DATABASE_URL);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection("hotels");
    const hotel = await collection.findOne({ _id: new ObjectId(id) });
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).send("Hotel not found");
    }
  } finally {
    await mongoClient.close();
  }
});

app.get("/cities/:name", async (req, res) => {
  const { name } = req.params;
  const mongoClient = new MongoClient(DATABASE_URL);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection("cities");
    const city = await collection.findOne({ name: name });
    if (city) {
      res.json(city);
    } else {
      res.status(404).send("City not found");
    }
  } finally {
    await mongoClient.close();
  }
});

app.get("/countries/:country", async (req, res) => {
  const { country } = req.params;
  const mongoClient = new MongoClient(DATABASE_URL);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection("countries");
    const countryDetails = await collection.findOne({ country: country });
    if (countryDetails) {
      res.json(countryDetails);
    } else {
      res.status(404).send("Country not found");
    }
  } finally {
    await mongoClient.close();
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
