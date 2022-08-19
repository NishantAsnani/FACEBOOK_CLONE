if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const user=require('./models/users');
const express=require('express');
const path=require('path');
const app=express();
const bcrypt=require('bcrypt');
const imageSchema=require('./models/data');
const multer=require('multer');
const {storage, cloudinary}=require('./cloudinary');
const { default: mongoose } = require('mongoose');
const upload=multer({storage});
const data=mongoose.model('data',imageSchema);
const DB=`mongodb+srv://Nishant:${process.env.ATLAS_PASSWORD}@cluster0.lirwj3i.mongodb.net/?retryWrites=true&w=majority`
const connectionParams={
    useNewUrlParser:true,
}
mongoose.connect(DB,connectionParams).then(()=>{
    console.log("Connected to database")
})


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
  
app.listen(3000,function(){
    console.log('LISTENING TO PORT 3000');
})

app.get('/new',(req,res)=>{
    res.render('signup');
})

app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/mainpage',(req,res)=>{
    res.render('mainpage')
})


app.post('/',async (req,res)=>{
    const {email,password}=req.body;
    const User=await user.findOne({email});
    
     if(!User)
    {
        res.render('error');
        return;
    }
       
    const validPassword=await bcrypt.compare(password,User.password);
    if(validPassword)
    {
        res.render('mainpage');
    }

    else
    {
        res.render('error')
    }
})

app.post('/new',async(req,res)=>{
    const {Firstname,password,Surname,email,Day,Month,Year,Gender}=req.body;
    const hash=await bcrypt.hash(password,12)
    const User=new user({
        email,
        password:hash,
        Firstname,Surname,Day,Month,Year,Gender
    })
    await User.save().then(()=>{
        console.log('new user added ');
    })
    .catch(e=>{
        console.log("OH NO!! ERROR ");
        console.log(e);
    })
    res.redirect('/')
})

app.post('/show',upload.single('data'),async(req,res)=>{
    const result= await cloudinary.uploader.upload(req.file.path);
    const Data=new data({
        description:req.body.description,
        image:result.secure_url
    })
    await Data.save().then(()=>{
        console.log("Image added");
    })
    .catch(err=>{
        console.log("Oops error ",err);
    })
res.render('show',{Data});
})