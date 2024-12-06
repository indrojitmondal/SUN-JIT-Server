const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());




//const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.kk0ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kk0ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(process.env.DB_USER, process.env.DB_PASS);
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
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    
   console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const reviewsCollections = client.db('reviewsDB').collection('reviews');
    
    app.post('/reviews', async(req, res)=>{

      const newReviews= req.body;
      // const newOrders = req.body;
        console.log(newReviews);
        const result = await reviewsCollections.insertOne(newReviews);
        res.send(result);
  
    })
    app.get('/reviews', async(req, res)=>{
      const cursor = reviewsCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
  app.get('/reviews/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await reviewsCollections.findOne(query);
    res.send(result);
  })
  app.put('/reviews/:id', async(req, res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options={ upsert: true};
    const updatedUser = req.body;
    console.log(updatedUser);
    //game_url, game_title, game_description, rating, publication_year, genres, email
    const user={
      $set:{
        game_url: updatedUser.game_url,
        game_title: updatedUser.game_title,
        game_description: updatedUser.game_description,
        rating: updatedUser.rating,
        publication_year: updatedUser.publication_year,
        genres: updatedUser.genres
       }
    }
    const result = await reviewsCollections.updateOne(filter, user, options);
    res.send(result);

 })
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Server is running good....');
})

app.listen(port, ()=>{
    console.log(`This server is running well on port: ${port}`);
})