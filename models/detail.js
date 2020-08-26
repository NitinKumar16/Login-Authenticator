//const { MongooseDocument } = require("mongoose");

var mongoose =require("mongoose");

var detailSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        maxlength:500,
        trim:true,
    },

    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true,
    },
    occupation:{
        type:String,
        maxlength:32,
        trim:true,
    },
    age:{
        type:Number,
        required:true,
        trim:true,
    },

    /*photo:{
        data:Buffer,
        contentType:String,
    },*/
},{timestamps:true})

//module.exports = mongoose.model("Detail",detailSchema);
module.exports = new mongoose.model('Detail', detailSchema);

