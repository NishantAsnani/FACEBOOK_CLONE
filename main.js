if(process.env.NODE_ENV !=="production")
{
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
const DB=`mongodb://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@ac-kzjtas6-shard-00-00.lirwj3i.mongodb.net:27017,ac-kzjtas6-shard-00-01.lirwj3i.mongodb.net:27017,ac-kzjtas6-shard-00-02.lirwj3i.mongodb.net:27017/?ssl=true&replicaSet=atlas-zg3epg-shard-0&authSource=admin&retryWrites=true&w=majority`
const cors=require('cors');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session)
const methodOverride = require('method-override');

const connectionParams={
    useNewUrlParser:true,
}
mongoose.connect(DB,connectionParams).then(()=>{
    console.log("Connected to database")
})

app.use(cors())

const mongoDBStore=new MongoDBStore({
    uri:DB,
    collections:'mySessions',
})


app.use(session({
    secret:'jhvfnvrb',
    store:mongoDBStore,
    resave:false,
    saveUninitialized:false,
}));
app.use(methodOverride('_method'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

const isAuth=(req,res,next)=>{
    if(req.session.user)
    {
        next();
    }
    else
    {
        res.redirect('/')
    }

}

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

app.get('/mainpage',isAuth,(req,res)=>{
    res.render('mainpage')
})

app.get('/show',isAuth,async(req,res)=>{
    const Image_Data=await data.find({}).populate('author')
    res.render('show',{Image_Data})
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
        const sessUser={
            id:User.id,
            email:User.email,
            password:User.password,
            Firstname:User.Firstname
        }
        req.session.user=sessUser
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
    let Data=new data({
        description:req.body.description,
        image:result.url, //Initially all posts by one user to be solved later.
    })
    data.author=req.session.user.id;
    console.log(req.session.user)
    await Data.save().then(()=>{
        console.log("Image added");
    })
    .catch(err=>{
        console.log("Oops error",err);
    })
    const Image_Data=await data.find({}).populate('author')
    res.render('show',{Image_Data})
})

app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/')
    })
})

app.post('/delete',async (req,res)=>{
    const postId=req.body.postId
    const delete_data=await data.findByIdAndDelete(postId)
    res.redirect('/show')
})