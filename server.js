const express = require("express");
const path = require("path");
const userRoutes = require("./src/api/routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes)

// Serve static files
app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "src", "index.html"));
});


app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
