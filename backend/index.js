const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Recipe = require("./models/recipe");
const multer = require("multer");
const fs = require("fs");
const port = 4000;
const { MONGO_URI } = require("./config.js");
const upload = multer({ dest: "images/" });

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) =>
  res.json({ message: "server is running please got /recipes!" })
);

app.get("/recipes", async (req, res) => {
  try {
    const recipes = (await Recipe.find()).reverse();
    res.json(recipes);
  } catch (err) {
    console.error(err);
  }
});

app.post("/recipes", upload.single("image"), async (req, res) => {
  try {
    const { title, ingredients, instructions, description, imageName } =
      req.body;
    const image = req.file;
    // validate req.body
    // validate req.file
    // save file to disk
    if (!fs.existsSync("images")) {
      fs.mkdirSync("images");
    }
    if (
      title === undefined ||
      ingredients === undefined ||
      instructions === undefined ||
      description === undefined
    ) {
      res.status(400).json({ message: "Please fill out all fields" });
    }

    if (image !== undefined) {
      fs.writeFileSync(imageName + image.mimetype, content);
      //file written successfully
    }

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      description,
      image,
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err);
  }
});
app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("delete ", id);
    const recipe = await Recipe.findByIdAndDelete(id);
    // TODO: also remove file from disk
    res.json(recipe);
  } catch (err) {
    console.error(err);
  }
});
app.put("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const recipe = await Recipe.findByIdAndUpdate(id, {
      $set: {
        ...req.body,
      },
    });
    res.json(recipe);
  } catch (err) {
    console.error(err);
  }
});

app.get("/search/:search", async (req, res) => {
  try {
    const { search } = req.params;
    console.log(search);
    const recipes = await Recipe.find({
      $or: [{ title: { $regex: search, $options: "i" } }],
    }).limit(5);
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.json({ message: "error" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// Run the backend server with node backend/index.js
