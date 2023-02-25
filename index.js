const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// userName: prosPlum
// password : lSqfKkMOoekD9BiX

const uri = "mongodb+srv://prosPlum:lSqfKkMOoekD9BiX@cluster0.drtwsrz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const services = client.db('prosPlum').collection('services');

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