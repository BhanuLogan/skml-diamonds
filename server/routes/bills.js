const express = require("express");
const app = express();
const router = express.Router();
const moment = require("moment");
const Bill = require("../schemas/BillSchema");

const Status = {
    PAID : 1, 
    NOT_PAID : 2, 
    RETURN : 3 
}
function valid(data){
    if(!data.name || !data.item || !data.approvedBy || !data.status)
        return false;
    if(data.amount <= 0)
        return false;
    if(data.weight && data.weight <= 0)
        return false;
    if(data.quantity && data.quantity < 0)
        return false;
    return true;
}

function getStatus(status){
    if(status.toLowerCase() === "paid")
        return Status.PAID
    if(status.toLowerCase() === "return")
        return Status.RETURN
    
    return Status.NOT_PAID
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

router.post("/", (req, res, next) => {
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
        status : getStatus(req.body.status),
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
    let status = params.status ? getStatus(params.status) : null;
    let filter = getFilterObj(params.search);
    if(status != null){
        filter.status = status
    }
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

router.get("/:billId", (req, res, next) => {
    Bill.findById(req.params.billId)
    .then(bill => res.status(200).send(bill))
    .catch(err => {
        console.log("bill retrieval failed with error : " + err);
        return res.sendStatus(400);
    })
});

router.put("/:billId", async (req, res, next) => {
    let billId = req.params.billId;
    let bill = await Bill.findById(billId);
    if(!bill){
        console.log("bill not found : " + billId);
        return res.sendStatus(404);
    }
    let data = req.body;
    if(data.amount && data.amount <= 0){
        console.log("Amount must be greater than 0");
        return res.sendStatus(400);
    }
    if(data.weight && data.weight < 0){
        console.log("weight must be greater than 0");
        return res.sendStatus(400);
    }
    if(data.quantity && data.quantity < 0){
        console.log("Quantity must be greater than 0");
        return res.sendStatus(400);
    }
    let billData = {
        name : data.name ? data.name : bill.name,
        item : data.item ? data.item : bill.item,
        weight : data.weight ? data.weight : bill.weight,
        quantity : data.quantity ? data.quantity : bill.quantity,
        amount : data.amount ? data.amount : bill.amount,
        approvedBy : bill.approvedBy,
        status : bill.status,
        billedAt : bill.billedAt
    }
    Bill.findByIdAndUpdate(billData)
    .then(result => res.status(200).send(result))
    .catch(err => {
        console.log("Bill updation failed with error : " + err);
        return res.sendStatus(400);
    })
});

module.exports = router;