const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3003;
const middleware = require('./middleware');
const path = require("path");
const mongoose = require("./database");
const cors = require("cors");

app.use(cors());
const server = app.listen(port, () => console.log("Server listening on port " + port));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const userRoute = require("./server/routes/users");
const billRoute = require("./server/routes/bills");

app.use("/bills/", billRoute);
app.use("/users/", userRoute);


app.get("/", (req, res, next) => {
    return res.send("Hi, This is backend server");
});


