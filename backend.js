const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors')

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/test", (req, res) => {
    console.log("GET request received");
    res.json({message: "GET request received"});
});

app.listen(process.env.PORT || 3001, () => console.log("Server running..."));
