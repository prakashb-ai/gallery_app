const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')

const images_router = require('./router/image_router')

const cors = require('cors')

dotenv.config()

app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
  
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))




app.use("/upload/image",express.static(__dirname+"/upload/image"))
app.use(images_router)

mongoose.connect(process.env.DATA_BASE)
.then(()=>{
    console.log('database was connected to the server')
})
.catch((error)=>{
    console.log(error)
})


app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})