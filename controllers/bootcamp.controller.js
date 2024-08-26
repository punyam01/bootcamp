const Bootcamp = require("../models/bootcamp.model.js");
const ErrorResponse = require ("../utils/errorREsponse.utils.js")
exports.getAllBootcamp = async (req, res, next ) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success:true,
      count:bootcamps.length,
      data: bootcamps
    })
  } catch (error) {
    next(new ErrorResponse(`unable to get the bootamps we got errors `, 400))
    
  }
};

exports.getBootcamp = async(req, res, next) => {
  try {
    const bootcamp =  await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return res.status(400).json({
        success:false,
        
      })
    }
    res.status(200).json({
      success:true,
      data: bootcamp
    })
    
  } catch (error) {
    next(new ErrorResponse(`unable to get the bootamp with provided id we got errors `, 401))
  }
};

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body); // Use 'bootcamp' instead of 'movie'
        res.status(201).json({
          status: "SUCCESS",
          data: {
            bootcamp, // Return 'bootcamp' data in response
          },
        });
      } catch (error) {
        next(new ErrorResponse(`we got errors `, 401))
      }
    };

exports.updateBootcamp = async(req, res,next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
      new:true,
      runValidators:true
    })
    if(!bootcamp){
      return res.status(400).json({
        success:false,
        
      })
    }
    res.status(200).json({
      success:true,
      data: bootcamp
    })


  } catch (error) {
    next(new ErrorResponse(`we got errors `, 400))
  }
};

exports.deleteBootcamp = async(req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id)
    if(!bootcamp){
      return res.status(400).json({
        success:false,
        
      })
    }
    res.status(200).json({
      success:true,
      data:{}
    })


  } catch (error) {
    next(new ErrorResponse(`we got errors `, 400))
  }
};
