const mongoose = require('mongoose');
const campSchema = new mongoose.Schema({
    title:{
        type : String ,
        required:[true,"title cann't be blank "]
    },
    location:String,
    image :String, 
    price:Number,
    descreption:String,
    
})
const camp = mongoose.model('camp',campSchema)
module.exports = camp ;