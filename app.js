const express = require("express");
const bodyParser = require("body-parser");
// const hbr = require("handlebars")
const mongoose = require("mongoose");
const morgan = require("morgan")
const dotenv = require("dotenv")
dotenv.config()
const Product = require("./model/product")

const app = express()

const dbURI = `mongodb+srv://lucifer:1234@cluster0.944yd.mongodb.net/Product?retryWrites=true&w=majority`;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    console.log("connected to db")

  )
  .catch(err => console.log(err));


// middleware & static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")

})


app.get("/products",  (req, res) => {
  // TODO Use this when you give your input box name diffierent names async
  // const result = await Product.find({ title: req.body.name })
  // // TODO use this if you are using the current format of html structure
  //const result = await Product.find({ title: req.query.name[0] && req.query.name[1] })


  const product_name = req.query.name;
  
  //this returns all separate items in the array and then find searches for them in the database
  product_name.forEach(title=>
      Product.find({title})
    
       .then(response => {
 //This uses array.map() to get all the product price form the product object
    
      const item_price = response.map(product => {
         return (product.price);
     });

     //Converts the array returned  into a number
     const price = Number(item_price);
     console.log(price)
        })

      .catch(err => {
        res.redirect("/")
        console.log(err)
      })
    ) 

    
}
)

//Just used to add data to the database
app.post("/add_products", (req, res) => {
  const product = new Product({
    title: "Ferrari",
    price: 56773200
  })

  product.save().then((result) => {
    res.send(result)
    console.log("saved")
  }).catch((err) => {
    console.log(err)
  })
})


app.listen(3000,
  console.log("App listening"))

