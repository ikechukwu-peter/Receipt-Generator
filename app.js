const express = require("express");
const bodyParser = require("body-parser");
const hbr = require("handlebars")
const mongoose = require("mongoose");
const morgan = require("morgan")
const dotenv = require("dotenv")
dotenv.config()
const Product = require("./model/product")

const app = express()

const dbURI = `mongodb+srv://${process.env.DB_ADMIN_USER}:${process.env.DB_ADMIN_PASSWORD}@cluster0.944yd.mongodb.net/Product?retryWrites=true&w=majority`;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    console.log("connected to db") 
    
  )
  .catch(err => console.log(err));

  
// middleware & static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res)=> {
    res.sendFile(__dirname +"/index.html")
    
})


app.get("/products", (req, res) => {
  Product.find ({title: req.body.name})
  console.log(req.body)
}



)

//Just used to add data to the database
app.get("/genReceipt", (req, res) => {
    const product = new Product ({

      title: "Ferrari",
      price: 56773200
    })

   product.save()

    .then((result) =>{
      
       
        res.send(result)
        console.log("saved")

     
    }
    )

    .catch( (err) => {
        console.log(err)
    })
})


app.listen(3000, 
  console.log("App listening"))

