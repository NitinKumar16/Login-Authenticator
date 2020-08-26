var creds = require('../creds')
var path = require("path");
var Handlebars = require("handlebars")
var fs = require('fs');
const { options } = require('../../routes/userreg');

var source = fs.readFileSync(path.join(__dirname, 'indexmail.hbs'), 'utf8');

var template = Handlebars.compile(source)

var users = (email,data)=>{
    console.log(`Sending email to......${email}`);
    return {
        from: 'threeplus.dev@gmail.com',
        to: email,
        subject: "Welocme to login Auth please do not reply",
        html: template(data),
    }
}

module.exports=(email,data)=>{
    //passing 2 elements
    return creds(users(email,data));
}