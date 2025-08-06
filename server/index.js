const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.route");
const connectDB = require("./utils/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" })); // your frontend URL
app.use(express.json());

app.use("/api", userRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
