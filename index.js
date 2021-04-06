const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mhth.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
app.use(bodyParser.json());
app.use(cors());


const port = 5000


app.get('/', (req, res)=>
{
    res.send("Connected successfully");
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
    // console.log('data successfully connected')

    app.post('/addProduct', (req, res) =>
    {
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result =>
            {
                console.log(result);
                res.send(result.insertedCount>0)
            })
    })


    app.get('/products', (req, res)=>
    {

        productsCollection.find({})
        .toArray((err, documents)=>
        {
            console.log(err, documents)
            res.send(documents);
        })
    })


    
    app.get('/products/:key', (req, res)=>
    {
        productsCollection.find({kay: req.params.key})
        .toArray((err, documents)=>
        {
            res.send(documents[0]);
        })
    })


    app.post('/productsKeys', (req, res)=>
    {
        const productsKeys = req.body;
        productsCollection.find({key: {$in:productsKeys}})
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })


    app.post('/addOrder', (req, res) =>
    {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>
            {
                // console.log(result);
                res.send(result.insertedCount>0)
            })
    })


});

app.listen(process.env.PORT || port)