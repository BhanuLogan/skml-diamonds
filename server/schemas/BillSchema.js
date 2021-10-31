const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BillSchema = new Schema({
    name : { type : String, required : true, trim: true },
    item : { type : String, required : true, trim : true},
    weight : { type : Number },
    quantity : { type: Number },
    amount : { type : Number },
    approvedBy : { type : String, required : true, trim : true},
    status : { type : String, required : true},
    billedAt : { type : String }
}, { timestamps : true });

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;