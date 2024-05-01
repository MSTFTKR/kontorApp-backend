const prisma = require("../DB/prisma");
const bcrypt = require('bcrypt');


const AddUser = async ({ tcVkn, dealerName, companyName, role, adminID, password }) => {
    if (!tcVkn || !companyName) {
      return res.status(400).json({ message: "Eksik İstek" });
    }

      const user = await prisma.user.findUnique({
        where: { tcVkn: Number(tcVkn) },
      });
      
      if (user) {
        throw new Error("Bu tcVkn zaten mevcut")
    }
  

    if(password){
      const cryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          tcVkn: Number(tcVkn),
          dealerName: dealerName,
          companyName: companyName,
          password:cryptedPassword,
          role: role,
          adminID: Number(adminID),
        },
      });
      return newUser;
    }else{
      const newUser = await prisma.user.create({
        data: {
          tcVkn: Number(tcVkn),
          dealerName: dealerName,
          companyName: companyName,
          role: role,
          adminID: Number(adminID),
        },
      });
      return newUser;
    }
      
     
   
  };

  module.exports={AddUser}