var express = require("express")
var router = express.Router()
var Detail = require("../models/detail");


    exports.getUserList = function(req , res){
 /*      var searchStr = req.body.search.value;
        if(req.body.search.value)
        {
                var regex = new RegExp(req.body.search.value, "i")
                searchStr = { $or: [{'_id':regex },{'city': regex},{'state': regex }] };
        }
        else
        {
                searchStr={};
        }
*/
        var recordsTotal = 0;
        var recordsFiltered=0; 
    
        Detail.count({}).then(c =>{
            recordsTotal=c;
            console.log("count: "+c);
/*
        Detail.count(searchStr).then(fc=>{
            recordsFiltered=fc;
            console.log("filtered count blah: "+fc);
*/
        let query={}
        query.skip = parseInt(req.body.start);
        query.limit = parseInt(req.body.length);

        let userList = []
        Detail.find({}).then(users=>{
            for(var i=0; i<users.length; i++){
                userList.push({
                    "id":users[i]._id,
                    "name":users[i].name,
                    "emailid":users[i].email,
                    "age":users[i].age,
                });
               
            }
                res.json({draw: req.body.draw, recordsFiltered: recordsFiltered, recordsTotal: recordsTotal, data: userList})              
                return userList
        })
    
    })
  //  })
}