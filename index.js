require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmh2w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const Orders = client.db("creativeAgency").collection("orders");
    const Reviews = client.db("creativeAgency").collection("reviews");
    const Services = client.db("creativeAgency").collection("services");
    const Admins = client.db("creativeAgency").collection("admins");
    console.log('database connect successfully')

      
    app.post('/NewOrder', (req, res) => {
        const allOrder = req.body;
        Orders.insertOne(allOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //show order list
    app.get('/review', (req, res) => {
        Orders.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //All customer order loaded in Admin ServiceList
    app.get("/getCustomerOrder", (req, res) => {
        Orders.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    
    app.post('/addReview', (req, res) => {
        const allReview = req.body;
        Reviews.insertOne(allReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    
    app.get('/reviews', (req, res) => {
        Reviews.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    
    app.post("/addEmail", (req, res) => {
        const Email = req.body;
        Admins.insertOne(Email)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // get Make Admin Email and send to Private Route
    app.get("/getEmail", (req, res) => {
        Admins.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

      
    app.post('/addService', (req, res) => {
        const allOrder = req.body;
        Services.insertOne(allOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //get show services
    app.get("/getService", (req, res) => {
        Services.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
});



app.get('/', (req, res) => {
    res.send('thank you for  me');
})


app.listen(process.env.PORT || port, ()=>{
    console.log(port)
});