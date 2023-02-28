const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// userName: prosPlum
// password : lSqfKkMOoekD9BiX

const uri = "mongodb+srv://prosPlum:lSqfKkMOoekD9BiX@cluster0.drtwsrz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('prosPlum').collection('services');
        const reviewCollection = client.db('prosPlum').collection('reviews')

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id }
            const sort = { date: -1 }
            const reviews = reviewCollection.find(query).sort(sort);
            const result = await reviews.toArray();
            res.send(result);
        })
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body.feedback;
            const filter = { _id: ObjectId(id) };
            const upDateDoc = {
                $ser: {
                    feedback: review,
                }
            }
            const result = await reviewCollection.updateOne(filter, upDateDoc);
            res.send(result);
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const services = serviceCollection.find(query);
            const result = await services.limit(3).toArray();
            res.send(result);
        })
        app.get('/allservice', async (req, res) => {
            const query = {};
            const services = serviceCollection.find(query);
            const result = await services.toArray();
            res.send(result);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

    }
    catch { }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('this is prosplum server site')
})

app.listen(port, () => {
    console.log(`Example app runing on prot${port}`)
})