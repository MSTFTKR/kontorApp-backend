const prisma = require("../DB/prisma");

const authMiddleware = async (req, res, next) => {
    try {
      const { apikey } = req.headers;
    //   console.log(apikey)

    if(!apikey){
      return  res.status(401).json({message:"You must provide an ApiKey"})
    }
      const admin = await prisma.aPIkeys.findUnique({
        where: {APIkey: apikey},include:{user:true}
      });
      req.user= admin.user
      
      next()
    } catch (error) {
      res.status(401).json({message:"Invalid Api Key"})
    }

};

module.exports = authMiddleware;
