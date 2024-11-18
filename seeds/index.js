const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
const camp = require('../models/camp')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')
 const sample = (array) => { return array[Math.floor(Math.random() * array.length)]}
const seedDb = async() => {
    await camp.deleteMany({}) 
    for(let i = 0 ; i <= 5 ; i += 1 ){
        const rand = Math.floor(Math.random() *100) + 1 ;
        const campobj = new camp({title:`${sample(descriptors)} ${sample(places)}`,location : `${cities[rand].city},${cities[rand].state}`,image:'https://thumbs.dreamstime.com/b/waterfall-rain-forest-16456620.jpg',price:4,descreption:"nstead, we're going to make a div with the class of card like that and then also give it some margin . And inside of this I'm going to add a row and I'm going to add a column medium for and that just remember"})
        await campobj.save()
    }
}
seedDb();