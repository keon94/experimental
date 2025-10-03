const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=10000";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
}
);


async function insertDocs(collection, callback = null) {
    collection.deleteMany();
    collection.createIndex({ item: 1 }, { unique: true })
    try {
        await collection.insertMany([
            { item: "card", qty: 15 },
            { item: "envelope", qty: 20 },
            { item: "stamps", qty: 30 }
        ]);
        let insertedCursor = await collection.find();
        for await (const doc of insertedCursor) {
            console.dir(doc);
        }
    } catch (e) {
        console.log(e);
    }
}

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        collection = client.db("test").collection("inventory");
        await insertDocs(collection)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);