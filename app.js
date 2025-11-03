const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('tiny')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// variables
const PORT = process.env.PORT || 3000;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;


// URL forwarding data
let urlMappings = {};

// Fetch URL mappings from Google Script
async function fetchUrl() {
    let result = await axios.get(GOOGLE_SCRIPT_URL);
    urlMappings = result.data;
    console.log("url map updated:", urlMappings);
}

app.get('/', (req, res) => {
    fetchUrl();
    res.sendFile(__dirname + "/404.html");
})

app.get("/:short", (req, res) => {
    const shortpath = req.params.short;
    if (urlMappings[shortpath]) {
        return res.redirect(urlMappings[shortpath]);
    }
    res.sendFile(__dirname + "/404.html");
})

fetchUrl();

app.listen(PORT, () => {
    console.log(`Server started listening at http://localhost:${PORT}`);
});