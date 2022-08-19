const mongoose=require('mongoose');

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
        required:true,
        lowercase:true
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
        required:true
    }
})


userSchema.path('email').validate(async(email)=>{
    const emailCount= await mongoose.models.user.countDocuments({email})
    return !emailCount
},'Email already exists')

const user=mongoose.model('user',userSchema);
module.exports=user;