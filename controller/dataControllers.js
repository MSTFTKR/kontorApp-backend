const prisma = require("../DB/prisma");
const moment = require("moment");
const analysisComponent =require('../components/analysisComponent')

const listYear = async (req, res) => {
  const { year } = req.params;
  try {
    const baslangicTarihi = new Date(year, 0, 1);
    const bitisTarihi = new Date(year, 11, 31, 23, 59, 59);
    const listData = await prisma.data.findMany({
      where: {
        date: {
          gte: baslangicTarihi,
          lte: bitisTarihi,
        },
      },
      orderBy: {
        date: "desc", //Tarihe göre büyükten küçüğe sıralama
      },
    });
    // console.log(yearDatas(listData,year))
    // console.log(monthDatas(listData, year));
    // console.log(weekDatas(listData, year));
    
    res.json(analysisComponent(listData,year));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rangeList = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const datas = await prisma.data.findMany({
      where: {
        date: {
          gte: new Date(startDate), // Başlangıç tarihi
          lt: new Date(endDate), // Bitiş tarihi
        },
      },
      orderBy: {
        date: "desc", //büyükten küçüğe sıralama
      },
    });
    res.json(datas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createData = async (req, res) => {
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn, date } =
    req.body;

  if (!alinanKontor || !kullanilanKontor || !kalanKontor || !userTcVkn) {
    return res.status(400).json({ message: "Eksik İstek" });
  }
  let dateTime;
  dateTime = new Date(date);
  dateTime.setMinutes(0);
  dateTime.setSeconds(0);
  dateTime.setMilliseconds(0);

  let today = new Date();
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  today.setHours(today.getHours() + 3);
  
  try {
    const lastData = await prisma.data.findFirst({
      orderBy: {
        date: 'desc'
      }
    });
    let existingData;
    if (date) {
      if(dateTime<lastData.date||alinanKontor<lastData.alinanKontor||kullanilanKontor<lastData.kullanilanKontor){
        let utcTr=lastData.date
        utcTr.setHours(utcTr.getHours()-3)
       throw new Error(`tarih, alinanKontor ve kullanilanKontor alanlarından biri son datadaki veriden daha küçük olamaz.
       Son Tarih:${utcTr.toString().slice(0,21)},       Son Alınan:${lastData.alinanKontor},        Son Kullanılan:${lastData.kullanilanKontor}`)
      }
      existingData = await prisma.data.findFirst({
        where: {
          date: {
            equals: dateTime,
          },
        },
      });
    } else {
      if(today<lastData.date||alinanKontor<lastData.alinanKontor||kullanilanKontor<lastData.kullanilanKontor){
        let utcTr=lastData.date
        utcTr.setHours(utcTr.getHours()-3)
       throw new Error(`tarih, alinanKontor ve kullanilanKontor alanlarından biri son datadaki veriden daha küçük olamaz.
       Son Tarih:${utcTr.toString().slice(0,21)},       Son Alınan:${lastData.alinanKontor},        Son Kullanılan:${lastData.kullanilanKontor}`)
      }
      existingData = await prisma.data.findFirst({
        where: {
          date: {
            equals: today,
          },
        },
      });
    }

    if (existingData) {
      const updatedData = await prisma.data.update({
        where: { id: existingData.id },
        data: {
          alinanKontor: Number(alinanKontor),
          kullanilanKontor: Number(kullanilanKontor),
          kalanKontor: Number(kalanKontor),
          userTcVkn: Number(userTcVkn),
          date: date ? dateTime : today,
        },
      });
      res.json(updatedData);
    } else {
      const createData = await prisma.data.create({
        data: {
          alinanKontor: Number(alinanKontor),
          kullanilanKontor: Number(kullanilanKontor),
          kalanKontor: Number(kalanKontor),
          userTcVkn: Number(userTcVkn),
          date: date ? dateTime : today,
        },
      });

      res.json(createData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const adminCreateData = async (req, res) => {
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn, date } =
    req.body;

  if (!alinanKontor || !kullanilanKontor || !kalanKontor || !userTcVkn) {
    return res.status(400).json({ message: "Eksik İstek" });
  }
  let dateTime;
  dateTime = new Date(date);
  dateTime.setMinutes(0);
  dateTime.setSeconds(0);
  dateTime.setMilliseconds(0);

  let today = new Date();
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  today.setHours(today.getHours() + 3);
  
  try {
    
    let existingData;
    if (date) {
      existingData = await prisma.data.findFirst({
        where: {
          date: {
            equals: dateTime,
          },
        },
      });
    } else {
      existingData = await prisma.data.findFirst({
        where: {
          date: {
            equals: today,
          },
        },
      });
    }

    if (existingData) {
      const updatedData = await prisma.data.update({
        where: { id: existingData.id },
        data: {
          alinanKontor: Number(alinanKontor),
          kullanilanKontor: Number(kullanilanKontor),
          kalanKontor: Number(kalanKontor),
          userTcVkn: Number(userTcVkn),
          date: date ? dateTime : today,
        },
      });
      res.json(updatedData);
    } else {
      const adminCreateData = await prisma.data.create({
        data: {
          alinanKontor: Number(alinanKontor),
          kullanilanKontor: Number(kullanilanKontor),
          kalanKontor: Number(kalanKontor),
          userTcVkn: Number(userTcVkn),
          date: date ? dateTime : today,
        },
      });

      res.json(adminCreateData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateData = async (req, res) => {
  const { id } = req.query;
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn } = req.body;
  try {
    const data = await prisma.data.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      res.json("Not found id");
    }
    else{
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
  }} catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteData = async (req, res) => {
  const { id } = req.query;
  try {
    const data = await prisma.data.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      res.json("Not found id");
    } else {
      const deleteData = await prisma.data.delete({
        where: { id: Number(id) },
      });
      res.json(deleteData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {createData, updateData, deleteData, listYear, rangeList, adminCreateData};
