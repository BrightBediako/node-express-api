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

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    // Request targeting specific article
    .get(function (req, res) {
        Article.find()
            .then((foundArticles) => {
                res.send(foundArticles);
            })
            .catch((err) => {
                res.send(err);
            });
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle
            .save()
            .then(() => {
                res.send("Successfully added a new article");
            })
            .catch((err) => {
                res.send(err);
            });
    })

    .delete(function (req, res) {
        Article.deleteMany()
            .then(() => {
                res.send("Successfully deleted all articles");
            })
            .catch((err) => {
                res.send(err);
            });
    });

// Request targeting specific article
app.route("/articles/articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle })
            .then((foundArticle) => {
                res.send(foundArticle);
            })
            .catch((err) => {
                res.send("No articles matching that titles was found");
            });
    })

    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true })
            .then(() => {
                res.send("Successfully updated the selected article.");
            })
            .catch((err) => {
                res.send(err);
            });
    })

    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body })
            .then(() => {
                res.send("Successfully updated the selected article.");
            })
            .catch((err) => {
                res.send(err);
            });
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle })
            .then(() => {
                res.send("Successfully deleted the corresponding article.");
            })
            .catch((err) => {
                res.send(err);
            });
    });




app.listen(3000, function () {
    console.log("Server started on port 3000");
});