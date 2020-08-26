var express = require("express")
var router = express.Router()
const authenticate = require("../middlewares/authenticate");
var Detail = require("../models/detail");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


require('dotenv').config();
const { 
  JWT_SECRET
} = process.env;

//const TableData = require("../controller/tableData")



router.get("/login", (req,res,next)=>{
    res.render('main',{layout:'index'})
    
})

router.post("/login",async(req, res, next)=>{
    
    const username = req.body.username;
    const password = req.body.password;

    console.log(username+ " , "+ password);
    Detail.findOne({email:req.body.username}).then(user =>{
        if(user)
        {
            console.log(user);
            bcrypt.compare(req.body.password , user.password).then(isMatched =>{
                console.log(isMatched , req.body.password , user.password);
                if(isMatched)
                {
                    const payloadData= {
                        id:user._id, 
                        name:user.name, 
                        email:user.email,
                        occupation:user.occupation,
                        age:user.age,
                    };

                    const token = jwt.sign(
                        payloadData,JWT_SECRET
                        );

                    console.log(token);

                    res.cookie('xfcv', token);
                    res.redirect("/dashboard")

                }
                else
                {
                    res.render("denied", {layout: 'index'});
                }
            })
        }else
        {
            res.send("cannot login, your credentials are wrong");
        }
    }).catch(err=>{
        res.send("Error cannot find required email")
    })
})


router.post("/UsersList" ,/*authenticate,*/(req, res, next)=>{

        var searchStr = req.body.search.value;
        if(req.body.search.value)
        {
                var regex = new RegExp(req.body.search.value, "i")
                searchStr = { $or: [{'_id':regex },{'city': regex},{'state': regex }] };
        }
        else
        {
                searchStr={};
        }

        var recordsTotal = 0;
        var recordsFiltered=0; 

        Detail.countDocuments({}).then(c =>{
            recordsTotal=c;
            console.log("count: "+c);
    
        Detail.countDocuments(searchStr).then(fc=>{
            recordsFiltered=fc;
            console.log("filtered count blah: "+fc);
    
        let query={}
        query.skip = parseInt(req.body.start);
        query.limit = parseInt(req.body.length);

        let userList = []
        Detail.find({}).then(users=>{
            for(var i=0; i<users.length; i++){
                userList.push({
                    "id":users[i]._id,
                    "name":users[i].name,
                    "email":users[i].email,
                    "age":users[i].age,
                });
            
            }
                
                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: userList})              
        })

    })
      })

})




router.get("/dashboard",function(req,res,next){

    res.render("UsersList",{layout:"index", });
})

//router.post("/dashboard", TableData.getUserList())
/*
function verifytoken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else
    {
        res.send(504)
    }
}
*/
router.get("/denied", (req, res, next)=>{
    res.render("denied", {layout: 'index'});
})


// dashboard code
/*   
    Detail.find({},function(error,founduser){
        res.render("dashboard", {layout: 'index', 
        users: JSON.parse(JSON.stringify(founduser))});  
    })    
*/

//router.get('/admin',authentication,isLoggedIN, admin);

module.exports = router