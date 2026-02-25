const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = {
  origin: corsOrigin === "*"
    ? "*"
    : corsOrigin.split(",").map(origin => origin.trim()).filter(Boolean)
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/api/health", (req, res) => {
  res.json({ message: "Welcome to flight-booking-api." });
});

require("./app/routes/prime-ng-data.routes")(app);

const clientBuildPath = path.join(__dirname, "..", "dist", "flight-booking");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.sendFile(path.join(clientBuildPath, "index.html"));
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
