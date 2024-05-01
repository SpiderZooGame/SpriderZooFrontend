const express = require("express");
const path = require("path");

const app = express();

// API endpoint example
app.get("/api/test", (req, res) => {
    const data = {
        message: "Hello from the API!"
    };
    res.json(data);
});

// Serve static files
app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/views/:viewName", (req, res) => {
    const viewName = req.params.viewName;
    // Read the HTML file from the views directory and send it as the response
    res.sendFile(path.resolve(__dirname, "src/static/html", `${viewName}.html`));
});

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "src", "index.html"));
});


app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
