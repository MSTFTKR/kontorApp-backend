
const adminAuthMiddleware = async (req, res, next) => {
    try {
      const { apikey } = req.headers;


    if(!apikey){
      
    }
    if(apikey==='asDsaMPv2fdfsb4s9r15ki6uil'){
        next()
    }else{
      return  res.status(401).json({message:"invalid Api Key"})
    }
    } catch (error) {
      res.status(401).json({message:error})
    }

};

module.exports = adminAuthMiddleware;
