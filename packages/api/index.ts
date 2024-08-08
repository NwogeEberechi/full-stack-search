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

const mongoClient = new MongoClient(DATABASE_URL);
console.log("Connecting to MongoDB...");
try {
  await mongoClient.connect();
  console.log("Successfully connected to MongoDB!");
} catch (error) {
  console.error(`Error connecting to MongoDB: ${error}`);
  process.exit(1);
}
const db = mongoClient.db();

app.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).send("Query parameter is required");
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "i");

  try {
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
  } catch (error) {
    console.error(`Error fetching search results: ${error}`);
    res.status(500).send("Error fetching search results");
  }
});

app.get("/hotels/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await db
      .collection("hotels")
      .findOne({ _id: new ObjectId(id) });

    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).send("Hotel not found");
    }
  } catch (error) {
    console.error(`Error fetching hotel with id: ${id}. Error: ${error}`);
    res.status(500).send(`Error fetching hotel with id: ${id}`);
  }
});

app.get("/cities/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const city = await db.collection("cities").findOne({ name: name });

    if (city) {
      res.send(city);
    } else {
      res.status(404).send("City not found");
    }
  } catch (error) {
    console.error(`Error fetching city with name ${name}. Error: ${error}`);
    res.status(500).send(`Error fetching city with name: ${name}`);
  }
});

app.get("/countries/:country", async (req, res) => {
  const { country } = req.params;

  try {
    const countryDetails = await db
      .collection("countries")
      .findOne({ country: country });

    if (countryDetails) {
      res.send(countryDetails);
    } else {
      res.status(404).send("Country not found");
    }
  } catch (error) {
    console.error(`Error fetching country: ${country}. Error: ${error}`);
    res.status(500).send(`Error fetching country with name: ${country}`);
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
