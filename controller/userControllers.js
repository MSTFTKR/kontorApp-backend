const prisma = require("../DB/prisma");
const userService=require('../services/userService')

const listAll = async (req, res) => {
  try {
    const listUser = await prisma.user.findMany();
    res.json(listUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser=async(req,res)=>{
  const{tcVkn, dealerName, companyName, role, adminID,password}=req.body
  try {
  const result= await userService.AddUser({tcVkn, password, dealerName, companyName, role, adminID})
  res.json( result)
 } catch (error) {
    res.status(500).json({message:error.message|| "Internal Server Error"})
    
  }
}

const updateUser = async (req, res) => {
  const { tcVkn } = req.query;
  const { id, changeTcVkn, dealerName, companyName, role, adminID } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { tcVkn: tcVkn },
    });
    
    if (!user) {
      return res.status(400).json({ message: "Böyle bir TcVkn mevcut değil" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { tcVkn: changeTcVkn },
    });
    
    if (user) {
      return res.status(400).json({ message: "Değiştirmeye çalıştıığınız TcVkn Zaten Mevcut" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
  if(id){ try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "Değiştirmeye çalıştıığınız id Zaten Mevcut" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  }
 
  

  try {
    const updatedUser = await prisma.user.update({
      where: { tcVkn: tcVkn },
      data: {
        id: id!==undefined?Number(id):undefined,
        tcVkn: changeTcVkn!== undefined? changeTcVkn:undefined,
        dealerName: dealerName!==undefined?companyName:undefined,
        companyName: companyName!==undefined?companyName:undefined,
        role: role!==undefined?role:undefined,
        adminID:adminID!==undefined? Number(adminID):undefined,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message:error.message });
  }
};

const deleteUser = async (req, res) => {
  const { tcVkn } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { tcVkn: tcVkn },
    });
    
    if (!user) {
      return res.status(400).json({ message: "Böyle bir TcVkn mevcut değil" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


  try {
    const deletedUser = await prisma.user.delete({
      where: { tcVkn: tcVkn },
    });
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Kullanıcı silinirken bir hata oluştu." });
  }
};




module.exports = { listAll, createUser, updateUser, deleteUser };
