const mongoose=require('mongoose');
const schema= mongoose.Schema;

const feedbackSchema= new schema({
    message:{
        type:String
     },
    problem_resolution:{
        type:Number
    },
    communication:{
        type:Number
    },
    professionalism:{
        type:Number
    },
    topics_knowledge:{
        type:Number
    },
}
)

module.exports= mongoose.model("Feedback",feedbackSchema)
