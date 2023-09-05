//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
mongoose.connect("mongodb+srv://admin-kamaldeen:admin@cluster0.liosypq.mongodb.net/blogDB")

const postSchema = new mongoose.Schema({
  title: String,
  body: String
})

const Post = mongoose.model("Post", postSchema);


app.get("/", function (req, res) {
  async function displayPosts() {
    try {
      const foundPosts = await Post.find({});

      res.render("home", { startingContent: homeStartingContent, posts: foundPosts });
    }
    catch (err) {
      console.log(err);
    }
  }
  displayPosts();

});

app.get("/about", function (req, res) {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { startingContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.post("/compose", function (req, res) {
  async function pushPosts() {
    try {

      const postTitle = _.capitalize(req.body.postTitle);
      const postBody = req.body.postBody;

      const postFound = await Post.findOneAndUpdate(
        { title: postTitle },
        [{
          $set: {
            body: {
              $concat: ["$body", " ", postBody]
            }
          }
        }]
      )
      if (postFound === null) {
        const post = new Post({
          title: postTitle,
          body: req.body.postBody
        });

        await post.save();
        console.log("No related posts. New blog post added");
        res.redirect("/");
      }

      console.log("Post found. New blog post added");
      res.redirect("/");

    }
    catch (err) {
      console.log(err);
    }
  }

  pushPosts();
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  async function getPostName() {
    try {
      const foundPost = await Post.findOne({_id: requestedPostId} )
      if (foundPost !== null) {
        console.log("Match found");
        res.render("post", {blogTitle: foundPost.title, blogContent:foundPost.body });
      }
    }
    catch(err) {
      console.log(err);
    }
  }
  
  getPostName();
  // console.log(req.params.postName);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
