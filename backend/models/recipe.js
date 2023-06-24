const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  ingredients: String,
  instructions: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;
