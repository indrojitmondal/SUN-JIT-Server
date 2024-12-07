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
    const watchListCollections = client.db('reviewsDB').collection('watchList');
    
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
    app.get('/highRatedGames', async(req, res)=>{
      
      try{
        // query to filter data with 'rating' >=3 
        
    
       const query ={
         $expr: { $gte: [{ $toInt: "$rating" }, 3] }
       };
        const result = await reviewsCollections.find(query).limit(6).toArray(); 
        //const result = await reviewsCollections.find().toArray(); 
        res.send(result);
      }
      catch(error){
        console.log('Error fetching high-rated games:', error);
        res.status(500).send({message:'Internal Server Error'});
      }
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
    const updatedReviews = req.body;
    //console.log(updatedReviews);
    //game_url, game_title, game_description, rating, publication_year, genres, email
    const review={
      $set:{
        game_url: updatedReviews.game_url,
        game_title: updatedReviews.game_title,
        game_description: updatedReviews.game_description,
        rating: updatedReviews.rating,
        publication_year: updatedReviews.publication_year,
        genres: updatedReviews.genres
       }
    }
    const result = await reviewsCollections.updateOne(filter, review, options);
    res.send(result);

  })
  app.delete('/reviews/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await reviewsCollections.deleteOne(query);
    res.send(result); 
   })
   app.post('/myWatchList', async(req, res)=>{

    const newReviews= req.body;
    // const newOrders = req.body;
      console.log(newReviews);
      const result = await watchListCollections.insertOne(newReviews);
      res.send(result);


  })
 
  app.get('/myWatchList', async(req, res)=>{
    const cursor = watchListCollections.find();
    const result = await cursor.toArray();
    res.send(result);
  })
   
    
  } finally {
    // Ensures that the client will close when you finish/error.
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