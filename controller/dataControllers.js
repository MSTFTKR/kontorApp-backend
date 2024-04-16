const prisma = require("../DB/prisma");

const createData = async (req, res) => {
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn } = req.body;
  console.log(alinanKontor, kullanilanKontor, kalanKontor, userTcVkn)
  if (!alinanKontor || !kullanilanKontor || !kalanKontor || !userTcVkn) {
    return res.status(400).json({ message: "Eksik İstek" });
  }
  try {
    const createData = await prisma.data.create({
      data: {
        alinanKontor: Number(alinanKontor),
        kullanilanKontor: Number(kullanilanKontor),
        kalanKontor: Number(kalanKontor),
        userTcVkn: Number(userTcVkn),
      },
    });
    res.json(createData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateData = async (req, res) => {
  const { id } = req.query;
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn } = req.body;
  try {
    const{id}=req.query;
    const user=await prisma.data.findUnique({
      where:{id:Number(id)}

    })
    if(!user){  }

  } catch (error) {
    
  }

  try {
    const updateData = await prisma.data.update({
      where: { id: Number(id) },
      data: {
        alinanKontor:
          alinanKontor !== undefined ? Number(alinanKontor) : undefined,
        kullanilanKontor:
          kullanilanKontor !== undefined ? Number(kullanilanKontor) : undefined,
        kalanKontor:
          kalanKontor !== undefined ? Number(kalanKontor) : undefined,
        userTcVkn: userTcVkn !== undefined ? Number(userTcVkn) : undefined,
      },
    });
    res.json(updateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteData = async (req, res) => {
  const { id } = rep.query;
  try {
    const deleteData = await prisma.user.delete({ where: { id: Number(id) } });
    res.json(deleteData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createData, updateData, deleteData };
