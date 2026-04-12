const mongoose=require('mongoose');
const schema= mongoose.Schema;

const feedbackSchema= new schema({
    uuid:{
        type:String
    },
    feedbackMessage:{
        type:String
    },
    communication:{
        type:Number
    },
    professionalism:{
        type:Number
    },
    resolution:{
        type:Number
    },
    knowledge:{
        type:Number
    }
}
)

module.exports= mongoose.model("feedback",feedbackSchema)