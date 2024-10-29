const response = (status,res,data,message)=>{
    res.json({
        status: status,
        message: message,
        data : data,
    })
}

module.exports= response
