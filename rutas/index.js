const express = require("express");
const {pool} = require("../db/db.js");



const app = express()

app.listen((PORT) => {
    console.log(PORT)
});
