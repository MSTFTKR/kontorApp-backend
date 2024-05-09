const dotenv = require("dotenv");
dotenv.config();
const prisma = require("../DB/prisma");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService=require('../services/userService')
const SECRET_KEY = process.env.JWT_SECRET; 
const register=async(req,res)=>{
  const{tcVkn, dealerName, companyName, role, adminID,password}=req.body
  try {
  const result= await userService.AddUser({tcVkn, dealerName, companyName, role, adminID,password})
  res.json( result)
   } catch (error) {
      res.status(500).json({message:error.message|| "Internal Server Error"})
      
    }
}

const login = async (req, res) => {
  const { tcVkn, password } = req.body;

  if (!tcVkn || !password) {
    return res.status(400).json({
      message: "Lütfen eksik alan bırakmayınız. ",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        tcVkn: tcVkn,
      },
    });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Hatalı şifre." });
    }
    const token = jwt.sign({ tcVkn: user.tcVkn }, SECRET_KEY, {
      expiresIn: "1h",
    });

    
    res.json({ token: token, tcVkn: user.tcVkn });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
};

module.exports = { login,register };
