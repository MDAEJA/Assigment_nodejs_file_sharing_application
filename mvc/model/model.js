// creating schema for mongodb
const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    originalFileName:{
       type : String,
       required : true
    },
    newFileName:{
        type : String,
        required : true
    },
    size:{
        type : Number,
        required : true
    },
    path :{
        type : String,
        required : true
    }
});

const fileModel = mongoose.model("files",fileSchema);

module.exports = fileModel;