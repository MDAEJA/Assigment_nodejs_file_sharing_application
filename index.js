const express = require("express");
const routes = require("./mvc/routers/routes");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer')

const app = express();

// app.use(express.urlencoded());





mongoose.connect("mongodb://localhost:27017/share_file_app")
.then(()=>{console.log("project is connected with mongodb")})
.catch((err)=>{
    console.log("db is not connected "+ err)
})

app.use(routes);






  

app.listen(8080,()=>{
    console.log("server is connected at port 8080");
})