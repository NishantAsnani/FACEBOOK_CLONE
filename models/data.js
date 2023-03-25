const mongoose=require('mongoose');



const imageSchema=new mongoose.Schema({
    description:{
        type:String
    },
    image:
    {
        type:String
    },
    author:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'

    }
})
module.exports=imageSchema;