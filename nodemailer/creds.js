var nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    //secure:false,
    auth:{
        user:'senders email id',
        pass:'password for the email id',
    },
})
//getting one element
module.exports = (obj)=>{
    transporter.sendMail(obj ,(err,details) =>{
        
        if(err)
        {
            return console.log('error' , JSON.stringify((err),{tags:'email'}));
        }
        else
        {
            return console.log('details' , JSON.stringify((details), {tags:'email'}));
        }
        
        transporter.close();
    });
};