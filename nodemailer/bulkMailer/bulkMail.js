var nodemailer = require("nodemailer");
var path = require("path");
var Handlebars = require("handlebars");
var creds =require("../creds");
var fs = require("fs");

var source =fs.readFileSync(path.join(__dirname,'bulkMailIndex.hbs'),'utf8');

var template = Handlebars.compile(source)

var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    //secure:false,
    auth:{
        user:'senders email id',
        pass:'password for the email id',
    },
})

function sendEmail(email){
    return new Promise((resolve,reject)=>{
        transporter.sendMail(email,function(error, response){
            if(error)
            {
                console.log('error');
                reject(error);
            }
            else
            {
                console.log("Message sent:" +JSON.stringify(response));
                resolve(response)
            }
            transporter.close();
        });
    })
}

module.exports = (user_array)=>{
    let emailArray = [];
    for (let i = 0; i < user_array.length; i++) {
        emailArray.push(
            sendEmail({
                from: 'threeplus.dev@gmail.com',
                to: user_array[i].email,
                subject: "Welocme to login Auth please do not reply",
                html: template(user_array[i]),
            })
        )
        
    }

    return Promise.all(emailArray).then((result)=>{
        console.log('all mail sent');
    }).catch((err)=>{
        console.log(err);
    })
}

