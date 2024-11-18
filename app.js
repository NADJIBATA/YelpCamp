const express = require('express');
const app = express()
const AppError  = require('./AppError.js')
const mongoose = require('mongoose')
const camp = require('./models/camp')
const joi = require('joi')
const path = require('path');
const ejsMate = require('ejs-mate')
app.engine('ejs',ejsMate)
const methodOverride = require('method-override')
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) =>{
    console.log("connection worked")
  })
  .catch((err) =>{
    console.log('OOOH ERROR')
    console,log(err)
  })
  app.get('/',(req,res) =>{
    res.render('homecamp.ejs')
    
  })
  app.get('/campground',WrapASync(async (req,res,next) =>{
 
    const camps = await camp.find({})
    res.render('campground.ejs',{camps})
    
  }))
  app.get('/campground/new' , (req,res,next) =>{ 
    res.render('newCamp.ejs')
  })
  app.post('/campground',WrapASync(async (req,res) =>{
    const campgroundSchema = joi.object({
      title : joi.string().required(),
      price: joi.number().required().min(0),
    }).required()
    const {error} = campgroundSchema.validate(req.body)
    if(error){
      const msj = error.details.map(el => el.message).join(',')
      throw new AppError(msj,401);
    }
    const element = new camp(req.body) ; 
   await element.save();
   res.redirect('/campground');
  
  }) )
  app.put("/campground/:id",WrapASync(async (req,res,next) => {
  
    const {id} = req.params ;
    await camp.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
    res.redirect(`/campground/${id}`)
    }
   
  ))
  app.delete('/campground/:id' , WrapASync(async (req,res,next) => {
   
    const {id}   = req.params ; 
    console.log(id)
   const element = await camp.findByIdAndDelete(id)
   .then(data => console.log(data))
   .catch(err => console.log(err))
    res.redirect('/campground')

    
  }))
   
  function WrapASync(fn){
    return function(req,res,next){
      fn(req,res,next).catch(err => next(err))
    }
  }

  app.get('/campground/:id', WrapASync(async (req,res,next) => {
    const {id} = req.params ;
    const element =  await camp.findById(id);
    if(!element){
      throw new AppError("Camp not found",404)
    }
    res.render('oneCamp.ejs', {element})

}))

  app.get('/campground/:id/edit' , WrapASync(async (req,res,next) => {
   
    const {id} = req.params ;
    const element = await camp.findById(id)
    if(!element){
      throw new AppError("camp not found",404)
    }
    res.render('editCamp.ejs',{element})
   
  }))
  const handleCastError = (err) => {
    return  new AppError(`Camp not found , ${err.message}`, 404)
  }

  const handleValidationError = (err) => {
    return new AppError(`Validation failed.. ${err.message}`,401);
  }
  app.all('*',(req,res,next) => {
    throw new AppError('Page not found',404);
    next(err)
  })
  // app.use((err,req,res,next) => {
  //   console.log(err.name)
  //   if(err.name === 'CastError'){
  //         err = handleCastError(err)
  //   }else if(err.name = 'ValidationError'){
  //         err = handleValidationError(err)
  //   }else{
  //     err = err ; 
  //   }
  //   next(err);
  // })
  
  app.use((err,req,res,next) => {
    if(!err.message) err.message = ' Oh NO,Sth Went Wrong';
    if(!err.status) err.status = 500 ;
    res.status(err.status).render('error.ejs',{err});
  })
  app.listen('3000' , () =>{
   console.log('we listen on port 3000!!');
  })