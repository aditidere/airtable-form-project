const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/forms", require("./routes/forms"));
app.use("/api/response", require("./routes/response")); // ✅ FIXED
app.use("/api/webhooks", require("./routes/webhooks"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
