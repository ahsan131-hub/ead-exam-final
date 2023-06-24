const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/recipe-app";

module.exports = { MONGO_URI };
