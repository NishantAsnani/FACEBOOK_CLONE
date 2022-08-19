const mongoose=require('mongoose');

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