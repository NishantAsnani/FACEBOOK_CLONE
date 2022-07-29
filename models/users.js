const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/FACEBOOK_DB',{useNewUrlParser:true})
.then(()=>{
    console.log("MONGO CONNECTION OPEN")
})

.catch(err=>{
    console.log("OH NO ERROR")
    console.log(err)
})

const userSchema=new mongoose.Schema({
    Firstname:{
        type:String,
        required:true
    },
    Surname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Day:{
        type:Number,
        required:true
    },
    Month:{
        type:String,
        required:true
    },
    Year:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
    }
})

const user=mongoose.model('user',userSchema);
module.exports=user;