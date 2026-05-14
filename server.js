require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/userRoutes");

const app = express();


// Middleware
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// STATIC FOLDER
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// Routes
app.use("/api/users", userRoutes);


// Default Route
app.get("/", (req, res) => {
  res.send("Profile Upload API running...");
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});