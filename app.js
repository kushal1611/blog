const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Make Connection
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
});

// Define Schema/structure
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

//get all posts from db
  Post.find({}, function(err, posts) {
    res.render("home", {
      posts: posts
    });
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  //Make new post
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

//store blog in db
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// get the id stored in db
app.get("/posts/:postId", function(req, res) {

// store id
  const requestedPostId = req.params.postId;

//find in db
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {

//render the post for corresponding id
    res.render("post", {
      title: post.title,
      content: post.content
    });

  });

});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/trending", function(req, res) {
  res.render("trending");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
