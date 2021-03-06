//jshint esversion:6

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

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article",articleSchema);

//To all articles
app.route("/articles").get(function(req, res){
  Article.find(function(err, foundarticles){

    if(!err){
      res.send(foundarticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Success to add new article!!");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Success in deleting all articles!!");
    }else{
      res.send(err);
    }
  });
});

//To specific article
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne(
    {title: req.params.articleTitle},
    function(err, foundarticle){
      if(foundarticle){
        res.send(foundarticle)
      }else {
        res.send("No Articles found");
      }
    });
})
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated using patch!");
      }else{
        res.sen(err);
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted article.");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
