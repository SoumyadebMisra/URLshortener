require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');
const Url = require('./models/urls.js');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',async (req, res)=>{
  let short = req.body.url;
  if(validUrl.isWebUri(short)){
    // Url.countDocuments({},async (err,count)=>{
    //   if(err){
    //     res.send(err);
    //   } else{
    //     let newUrl = new Url({longurl: short,shorturl: count+1});
    //     await newUrl.save();
    //     res.json({longurl: short, shorturl: count+1});
    //   } }
    // )

    const count = await Url.find({}).count();
    const newUrl = new Url({long_url: short,short_url: count+1});
    await newUrl.save();
    res.json({long_url: short, short_url: count+1});

  } else{
    res.json({error: 'invalid url'});
  }
    
} )

app.get('/api/shorturl/:short',async (req, res)=>{
  const short = req.params.short;
  Url.findOne({short_url: short},(err,url)=>{
    if(err){
      res.json({error:err});
    } else{
      if(url) {
        res.redirect(url.long_url);
        console.log(url);
      }
      else console.log(url);
    }
  });
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
