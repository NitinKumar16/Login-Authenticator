const express =require("express")
const app=express()
const hbs = require("express-handlebars")
const bodyParser = require("body-parser");
const path= require("path");
const authenticationroute = require("./routes/authroute");
const userregistration = require("./routes/userreg");
const mongoose =require("mongoose");
const cookieParser = require('cookie-parser');

mongoose.connect("mongodb://localhost:27017/Authenticator", 
{
    useNewUrlParser: true, 
    useUnifiedTopology:true, 
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");  
}).catch(()=>{
    console.log("OOPss Database has some error");
});




app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static("public"))


//signup page 

//app.use('/', authenticationroute);
app.set('view engine' ,'hbs');
//what can be used as a replacement to set in express-router
app.engine( 'hbs', hbs({
    extname: '.hbs',
    defaultView: 'index',
    layoutsDir: path.join(__dirname + '/views/layout/'),
    helpers: require('./helpers/handlebars_helpers')
}));


app.use('/', authenticationroute);
app.use('/newuser' , userregistration);


//Multer 
/*
const storage = multer.diskStorage({
    destination:'./public/multeruploads/',
    filename:function(req,file,callback){
        var imageinital = 'uploads'

        callback(null,imageinital+Date.now()+path.extname(file.originalname));
    }
});

const upload =multer({
    storage:storage
}).single('myimage')

app.set('view engine','hbs');

app.get('/multerupload', (req,res)=>{
    res.render('index')
})


app.post('/upload',(req, res,callback)=>{
    upload(req,res,(err)=>{
        if(req.file==undefined){
        callback('please upload a file')
        }
        else{
            console.log(req.file);
            res.send("file has been uploaded to 'multeruploads' folder")
            }
        })
    });
*/
const port =3000
app.listen(port,function(){
    console.log(`This is running at port ${port}....`);
});