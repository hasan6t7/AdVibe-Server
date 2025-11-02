const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const usersRoutes = require("./src/users/user.route");
const productsRoutes = require("./src/products/products.route");
const reviewsRoutes = require("./src/review/review.route");
const ordersRoutes = require("./src/orders/order.route");
const statsRoutes = require("./src/stats/stats.route");

app.use("/api/auth", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stats", statsRoutes);
const uploadImage = require("./src/utils/uploadImage");

async function main() {
  await mongoose.connect(process.env.DB_URI);

  app.get("/", (req, res) => {
    res.send("AdVibe Server is running");
  });
}

main()
  .then(() => console.log("Mongodb Connected successfully"))
  .catch((err) => console.log(err));

// uploa image api
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
