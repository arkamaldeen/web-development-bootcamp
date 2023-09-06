
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {

    async function createUser () {
        try {
            const newUser = new User({
                email : req.body.username,
                password : req.body.password
            });
        
            await newUser.save();
            res.render("secrets");
        }
        catch(err) {
            console.log(err);
        }
    }

    createUser();
});


app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    async function findUserAndLogin() {
        try {
            const foundUser = await User.findOne({email:username});
            if (foundUser !== null) {
                if ( foundUser.password === password){
                    res.render("secrets");
                    console.log("successfully logged in to user : " + foundUser.email);
                }
                else{
                    console.log("Username or Password is invalid");
                }
            }
            else{
                console.log("User doesnt exist");
            }
        }
        catch(error)  {
            console.log('Error', error);
        }
    }

    findUserAndLogin();
});



app.listen(3000, function () {
    console.log("Server started in port 3000");
});