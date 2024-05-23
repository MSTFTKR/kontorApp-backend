
const adminAuthMiddleware = async (req, res, next) => {
    try {
      const { apikey } = req.headers;


    if(!apikey){
      
    }
    if(apikey===process.env.APIKEY){
        next()
    }else{
      return  res.status(401).json({message:"invalid Api Key"})
    }
    } catch (error) {
      res.status(401).json({message:error})
    }

};

module.exports = adminAuthMiddleware;
