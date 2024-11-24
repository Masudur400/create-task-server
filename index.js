const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.nhw8ipw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db('createTask').collection('users')
        const tasksCollection = client.db('createTask').collection('tasks')






        // users post 
        app.post('/users', async (req, res) => {
            const userinfo = req.body
            const query = { email: userinfo?.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return
            }
            const result = await usersCollection.insertOne(userinfo)
            res.send(result)
        })

        // users get 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        // user get by email 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // post task 
        app.post('/tasks', async (req, res) => {
            const data = req.body
            const result = await tasksCollection.insertOne(data)
            res.send(result)
        })

        // get all task 
        app.get ('/tasks', async(req, res) =>{
            const result = await tasksCollection.find().toArray()
            res.send(result)
        }) 

        //  tasks count 
        app.get('/tasksCount', async (req, res) => {
            const count = await tasksCollection.estimatedDocumentCount()
            res.send({ count })
        })

        // all tasks get for pagination #rout: allProduct
        app.get('/tasks/task', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const result = await tasksCollection.find().skip(page * size).limit(size).toArray()
            res.send(result)
        })

        //task get by id
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.findOne(query)
            res.send(result)
        })

        //product delete by id
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })

        // task update by id 
        app.patch('/tasks/ta/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    task: data.task,
                    description: data.description, 
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Create Task Is Running.........')
})
app.listen(port, () => {
    console.log(`Create Task Is Running On Port ${port}`);
})