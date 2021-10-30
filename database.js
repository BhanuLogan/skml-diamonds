const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }
    
    connect() {
        const uri = "mongodb+srv://Bhanu:n1501381@skmldiamonds.mykxf.mongodb.net/SKMLDiamonds?retryWrites=true&w=majority";
        mongoose.connect(uri, { useNewUrlParser: true, 
        useUnifiedTopology: true })
        .then(() => {
            console.log("Database connection successful!!!");
        }).catch((err) => { 
            console.log("Database connection unsuccessful. Error : " + err);
        });
    }
}

module.exports = new Database();