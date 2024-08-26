const ErrorResponse = require("../utils/errorREsponse.utils");

const errorHandler =(err,req,res,next)=>{

    let error = {...err}

if (err.name=="CastError"){
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
}





res.status(error.statusCode || 500).json({
    success:false,
    error:error.message || "Server error "
})
};
module.exports = errorHandler;