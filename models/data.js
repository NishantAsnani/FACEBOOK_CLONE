const mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/FACEBOOK_DB_IMAGE',{useNewUrlParser:true})
const imageSchema=new mongoose.Schema({
    description:{
        type:String
    },
    image:
    {
        type:String
    }
})
module.exports=imageSchema;