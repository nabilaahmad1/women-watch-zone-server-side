const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8lywp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("watch-shop");
        const watchCollection = database.collection("watch");
        const userCollection = database.collection("user");
        const orderCollection = database.collection("order");
        const reviewCollection = database.collection("review");

        // get API for adding new service
        app.get("/watches", async (req, res) => {
            const findWatch = watchCollection.find({});
            const getWatch = await findWatch.toArray();
            res.send(getWatch);
        })

        // get API for adding new review
        app.get("/review", async (req, res) => {
            const findReview = reviewCollection.find({});
            const getReview = await findReview.toArray();
            res.send(getReview);
        })

        // get API for adding new user
        app.get("/user", async (req, res) => {
            const findUser = userCollection.find({});
            const getUser = await findUser.toArray();
            res.send(getUser);
        })

        // get API for getting user email 
        app.get("/user/:email", async (req, res) => {
            const result = await userCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        })

        // get single watch
        app.get("/watches/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const ride = await watchCollection.findOne(query);
            res.json(ride);
        })

        // delete service
        app.delete("/watches/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const watch = await watchCollection.deleteOne(query);
            res.send(watch);
        })

        // get API for placing order
        app.get("/manageallorders", async (req, res) => {
            const findRide = orderCollection.find({});
            const getRide = await findRide.toArray();
            res.send(getRide);
        })

        // delete order 
        app.delete("/manageallorders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.deleteOne(query);
            res.send(order);
        })

        // put API for updating admin
        app.put("/user/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        })

        // status update on a order
        app.put("/manageallorders/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await orderCollection.updateOne(filter, {
                $set: {
                    status: "shipped",
                },
            });
            res.send(result);
            console.log(result);
        });

        // post API for placeing order
        app.post("/manageallorders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })

        // post API for adding new service
        app.post("/watches", async (req, res) => {
            const watches = req.body;
            const result = await watchCollection.insertOne(watches);
            console.log(result);
            res.json(result);
        })

        // post API for adding new user
        app.post("/user", async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            console.log(result);
            res.json(result);
        })

        // post API for adding new review
        app.post("/review", async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})