var Detail = require("../models/detail");
var ObjectId = require('mongodb').ObjectId; 

function getUserList(){
    return Detail.find() 
}

function getUser(id){
    
    //var o_id = new ObjectId(id);
    
    return Detail.findById({_id:id})
}

function updateUser(oid,user){
    //let objectid=new ObjectId(id)
    return Detail.updateOne({_id: oid},user)
}
module.exports = {getUserList,getUser,updateUser} 