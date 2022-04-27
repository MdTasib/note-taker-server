const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("hello world");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do24a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const noteCollection = client.db("notesTaker").collection("notes");

		// get all data
		app.get("/notes", async (req, res) => {
			const query = req.query;
			const cursor = noteCollection.find(query);
			const result = await cursor.toArray();
			res.send(result);
		});

		// post a single data to database
		app.post("/note", async (req, res) => {
			const data = req.body;
			const result = await noteCollection.insertOne(data);
			res.send(result);
		});

		// update single data useing id
		app.put("/note/:id", async (req, res) => {
			const data = req.body;
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };

			const updateData = {
				$set: {
					userName: data.userName,
					textData: data.textData,
				},
			};

			const result = await noteCollection.updateOne(
				filter,
				updateData,
				options
			);
			res.send(result);
		});

		// delete single data useing id
		app.delete("/note/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };
			const result = await noteCollection.deleteOne(filter);
			res.send(result);
		});
	} finally {
	}
}

run().catch(console.dir);

app.listen(port, console.log("server runing", port));
