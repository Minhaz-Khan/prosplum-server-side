const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.REACT_APP_DBUSER}:${process.env.REACT_APP_DBPASSWORD}@cluster0.drtwsrz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('prosPlum').collection('services');
        const reviewCollection = client.db('prosPlum').collection('reviews')

        app.post('/reviews', async (req, res) => {
            const review = req.body;
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
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set:{
                    feedback: review,
                },
            }
            const result = await reviewCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const services = serviceCollection.find(query);
            const result = await services.limit(3).toArray();
            res.send(result);
        })
        app.post('/addService', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
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

        app.get('/myService',async(req,res)=>{
            const userEmail = req.query.email;
            const query = {email:userEmail}
            const myService =  serviceCollection.find(query)
            const result = await myService.toArray();
            res.send(result)
        })
        app.delete('/myService/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
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