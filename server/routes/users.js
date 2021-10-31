const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const router = express.Router();
const moment = require("moment")

app.use(bodyParser.urlencoded({ extended : false }));

router.post("/register", async (req, res, next) => {
    let users = ["raju", "suresh", "ramana", "suri", "pavan"]
    console.log(req.body);
    if(!req.body || !req.body.username || !req.body.password){
        console.log("Username or password is missing");
        return res.sendStatus(400);
    }
    if(!users.includes(req.body.username.toLowerCase())){
        console.log("You are not one of the members in the shop");
        return res.sendStatus(400);
    }
    let user = await User.findOne({
        $and : [
            { username : req.body.username.toLowerCase() },
            { password : req.body.password }
        ]
    })
    if(user){
        return res.status(200).send(user);
    }
    user = {
        username : req.body.username.toLowerCase(),
        password : req.body.password,
       //createdAt : moment().format("LLLL").toString()
    };
    User.create(user)
    .then(user => {
        return res.status(200).send(user);
    }).catch(err => {
        console.log("registeration failed with error : " + err);
        return res.sendStatus(400);
    })
});

router.post("/login", async (req, res, next) => {
    if(!req.body){
        console.log("No request body");
        return res.sendStatus(400);
    }
    let user = await User.findOne({
        $and : [
            { username : req.body.username.toLowerCase() },
            { password : req.body.password }
        ]
    }).catch(err => {
        console.log("login failed with error " + err);
        return res.sendStatus(400);
    });
    if(!user){
        console.log("User not found with credentials : " + req.body);
        return res.sendStatus(404);
    }

    return res.status(200).send(user);
});

module.exports = router;