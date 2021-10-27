const express = require("express");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId
require("dotenv").config();
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//CONNECT DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxsis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const serviceCollection = database.collection("services");

    //GET API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
    });

    //GETTING SINGLE ID
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query ={_id: ObjectId(id)}
      const service = await serviceCollection.findOne(query);
      res.send(service)
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running genius-car-mechanic server");
});

app.listen(port, () => {
  console.log("Running genius server on port", port);
});
