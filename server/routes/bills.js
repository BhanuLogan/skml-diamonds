const express = require("express");
const app = express();
const router = express.Router();
const moment = require("moment");
const Bill = require("../schemas/BillSchema");

function valid(data){
    if(!data.name || !data.item || !data.approvedBy || !data.billType)
        return false;
    if(data.amount <= 0)
        return false;
    if(data.weight && data.weight <= 0)
        return false;
    if(data.quantity && data.quantity < 0)
        return false;
    return true;
}

function getFilterObj(search){
    if(search == null){
        return {}
    }
    return {
        $or : [
            { name : { $regex : search, $options : "i "}},
            { item : { $regex : search, $options : "i "}}
        ]
    };
}
router.post("/approve", (req, res, next) => {
    if(!req.body){
        console.log("No content in body");
        return res.sendStatus(400);
    }
    if(!valid(req.body)){
        console.log("Fill all the fields");
        return res.sendStatus(400);
    }
    let data = {
        name : req.body.name,
        item : req.body.item,
        weight : req.body.weight ? req.body.weight : 0,
        quantity : req.body.quantity ? req.body.quantity : 0,
        amount : req.body.amount,
        approvedBy : req.body.approvedBy,
        billType : req.body.billType,
        billedAt : moment().format("LLLL").toString()
    }
    Bill.create(data)
    .then(bill => {
        return res.status(200).send(bill);
    }).catch(err => {
        console.log("Billing failed! data : " + err);
        return res.sendStatus(400);
    });
});

router.get("/", async (req, res, next) => {
    let params = req.query;
    let count = params.count ? Math.min(parseInt(params.count), 10) : 10;
    let skip = params.skip ? parseInt(params.skip) : 0;
    let filter = getFilterObj(params.search);
    Bill.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(count)
    .then(data => {
        return res.status(200).send(data);
    }).catch(err => {
        console.log("Retrieving bills failed with error : " + err);
        return res.sendStatus(400);
    });
});

module.exports = router;