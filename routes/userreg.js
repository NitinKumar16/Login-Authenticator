var express = require('express')
var router = express.Router()
var Detail = require("../models/detail");
var dbHelper= require("./dbhelper");
const { request } = require('express');
const { updateUser } = require('./dbhelper');
var bcrypt = require("bcrypt");
const multer = require('multer');
const storage = require('../middlewares/multer');
const path = require('path');
const xlsx = require('xlsx');
const nodemailer = require("nodemailer");
const sendEmail = require("../nodemailer/Welcome/welcomeMail");
const bulkMailer = require("../nodemailer/bulkMailer/bulkMail");


router.get("/form/:uid", async (req,res,next)=>{

    if(req.params.uid == 'new'){
        res.render("registrationform", {layout: 'index', title:"Create user", mode:"create"});
    /*const users = await dbHelper.getUserList()
        res.render("dashboard", {layout: 'index',title: "USER LIST", 
        users: JSON.parse(JSON.stringify(users))}); */
    }
    
    else{
        const user = await dbHelper.getUser(req.params.uid)
        res.render("registrationform", {layout: 'index',title:"Edit user", mode:"edit",user:JSON.parse(JSON.stringify(user))});
        
    }

})


//upload the entered values to db 

router.post("/upload", async (req,res,next)=>{
    try{
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt , hashedpassword , req.body.password);
        
        const newuser = new Detail ({
            email: req.body.emailid,
            password: hashedpassword,
            name: req.body.name,
            occupation: req.body.occupation,
            age: req.body.age
        }) 
        newuser.save().then(res=> {
            sendEmail(req.body.emailid ,JSON.parse(JSON.stringify({name:req.body.name})));
        })
        res.redirect("/newuser/success")

    } catch{
        res.send("upload failed");
    }
})


router.post("/edit/:uid", async (req,res,next)=>{
    const id = req.params.uid
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt , hashedpassword , req.body.password);

    const user ={
        email: req.body.emailid,
        password: hashedpassword,
        name: req.body.name,
        occupation: req.body.occupation,
        age: req.body.age  
    }

    dbHelper.updateUser(id,user)
    .then(function(){
        res.redirect("/newuser/success")
    }).catch((err)=>{
        res.redirect("/denied")
        console.log(err);
    })
    
})

router.post("/importUsers" , multer({storage:storage}).fields([{
    name:"excelFile",
    maxCount:1,
    }]), (req,res,next)=>{
        if(req.files['excelFile'])
        //console.log(req.files['excelFile']);
        {
            const excelpath= path.join(__dirname, "../public/misc/"+req.files['excelFile'][0].filename);
            
            var workbook = xlsx.readFile(excelpath);
            var sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[sheet_name];
            //console.log("worksheet:",+worksheet);

            var Headers = {};
            var data =[];
            for (i in worksheet){
                if (i[0]==="!") continue;
                {
                    console.log("i:"+i);
                    var col = i.substring(0,1);
                    var row = parseInt(i.substring(1));
                    var value = worksheet[i].v;
                    console.log("v:",+worksheet[i].v);
                    if(row == 1)
                    {
                        Headers[col]= value.replace(/ /g,'');
                        //console.log("headers:" +Headers[col])
                    }

                    if(!data[row]) data[row]={};
                    data[row][Headers[col]] = value;
                    //console.log("data", +data)
                }
            }
            data.shift();
            data.shift();
            
            const unhashedData = [];

          
            data.forEach(async user => {
                const val = (typeof user === 'object') ? Object.assign({}, user) : user;
                unhashedData.push(val);
                const salt = await bcrypt.genSalt();
                const hashedpassword = await bcrypt.hash(user.password, salt)
                user.password = hashedpassword;
            });

      
            Detail.collection.insertMany(data,{ordered:false}).then(result=>{
                
                //sending emails to multiple users

                bulkMailer(unhashedData);

                console.log(unhashedData);
                
                res.redirect("/dashboard")
            }).catch(err =>{
                console.log(err);
            })

        }
        else
        {
            console.log("Excel file not found");
        }
})



router.get("/success",(req, res, next)=>{

    res.render("success", {layout: 'index'});
})



module.exports = router;