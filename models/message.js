const mongoose=require('mongoose');
const schema= mongoose.Schema;

const messageSchema= new schema({
    message:{
        type:String
     },
    uuid:{
        type:String
    },
    user:{
        type:String
     },
    },
    {
        timestamps:true
    }
)

module.exports= mongoose.model("message",messageSchema)
