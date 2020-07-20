//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/secret", {useNewUrlParser: true, useUnifiedTopology : true });

const secretSchema = new mongoose.Schema({
  email : String,
  password : String
});

secretSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields : ['password']});

const User = new mongoose.model("User", secretSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  const user = new User({
    email : username,
    password : password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secrets');
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email : username,
    password : password
  }, function(err, founduser){
    if(founduser){
      res.render('secrets');
    };
  });
})


app.listen(3000, function(){
  console.log('Server started at port number 3000');
});
