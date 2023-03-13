const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


// use middle ware communication
app.use(cors());
// JSON Convert Middleware
app.use(express.json());



const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.deqyklb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
       
        const serviceCollection = client.db('geniusCarData').collection('services');
        const orderCollection =client.db('geniusCarData').collection('orders');

        app.get('/services', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id:new ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // Orders api
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);

        });



    }finally{
        // await client.close();
    }
}
run().catch(err =>console.log(err));




app.get("/", (req, res) =>{
    res.send('Thi is first pages')
});

app.listen(port, (req, res) =>{
    console.log(`http://localhost:${port}`)
})