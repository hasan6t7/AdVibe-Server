const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const userRoutes = require("./src/users/user.route");
const productRoutes = require("./src/products/products.route");
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URI);

  app.get("/", (req, res) => {
    res.send("AdVibe Server is running");
  });
}

main()
  .then(() => console.log("Mongodb Connected successfully"))
  .catch((err) => console.log(err));

// hasanhasanujjaman4368_db_user

// WlIMtN4pX042mzuR

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
