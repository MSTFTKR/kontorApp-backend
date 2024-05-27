const prisma = require("../DB/prisma");
const moment = require("moment");
const analysisComponent = require("../components/analysisComponent");
const { rounded } = require("../components/dateComponents");

const listYear = async (req, res) => {
  const { year } = req.params;
  let userTcVkn = req.userTcVkn;
  console.log(userTcVkn);
  try {
    const baslangicTarihi = new Date(year, 0, 1);
    const bitisTarihi = new Date(year, 11, 31, 23, 59, 59);

    const listData = await prisma.data.findMany({
      where: {
        userTcVkn: { equals: userTcVkn },
        date: {
          gte: baslangicTarihi,
          lte: bitisTarihi,
        },
      },
      orderBy: {
        date: "desc", //Tarihe göre büyükten küçüğe sıralama
      },
    });

    res.json(analysisComponent(listData, year));
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const pageData = async (req, res) => {
  const { startDate, endDate, page, pageSize } = req.query;
  let eDate = moment(endDate);
  let convertEndDate = eDate.add(1, "days");
  let userTcVkn = req.userTcVkn;
  let parsePage = parseInt(page);
  let parseSizePage = parseInt(pageSize);

  try {
    const rangeD = await prisma.data.findMany({
      where: {
        userTcVkn: { equals: userTcVkn },
        date: {
          gte: new Date(startDate), // Başlangıç tarihi
          lt: new Date(convertEndDate), // Bitiş tarihi
        },
      },
      orderBy: {
        date: "desc", //sıralama
      },
      skip: (parsePage - 1) * parseSizePage,
      take: parseSizePage,
    });
    res.json(rangeD);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rangeList = async (req, res) => {
  const { startDate, endDate } = req.query;
  let sDate = moment(startDate);
  let eDate = moment(endDate);
  let convertEndDate = eDate.add(1, "days");
  let userTcVkn = req.userTcVkn;
  

  try {

    const rangeDatas = await prisma.data.findMany({
      where: {
        userTcVkn: { equals: userTcVkn },
        date: {
          gte: new Date(startDate), // Başlangıç tarihi
          lt: new Date(convertEndDate), // Bitiş tarihi
        },
      },
      orderBy: {
        date: "desc", //sıralama
      },
    });

    let rangeTotalUsage =
      rangeDatas[0].kullanilanKontor -
      rangeDatas[rangeDatas?.length - 1].kullanilanKontor;
    let rangeTotalReceived =
      rangeDatas[0].alinanKontor -
      rangeDatas[rangeDatas?.length - 1].alinanKontor;

    let rangeTotalUsageWeekAvg;
    let rangeTotalUsageDayAvg;
    let rangeTotalReceivedWeekAvg;
    let rangeTotalReceivedDayAvg;

    const daysDiff = eDate.diff(sDate, "days");

    const weekOfrange = daysDiff / 7;
    rangeTotalUsageWeekAvg = rangeTotalUsage / weekOfrange;
    rangeTotalUsageDayAvg = rangeTotalUsage / daysDiff;
    rangeTotalReceivedWeekAvg = rangeTotalReceived / weekOfrange;
    rangeTotalReceivedDayAvg = rangeTotalReceived / daysDiff;

    const rangesAnalysisData = {
      rangeTotalReceived: rangeTotalReceived,
      rangeTotalUsage: rangeTotalUsage,
      rangeTotalReceivedWeekAvg: rounded(rangeTotalReceivedWeekAvg),
      rangeTotalReceivedDayAvg: rounded(rangeTotalReceivedDayAvg),

      rangeTotalUsageWeekAvg: rounded(rangeTotalUsageWeekAvg),
      rangeTotalUsageDayAvg: rounded(rangeTotalUsageDayAvg),
    };

    // const uniqueRangeData = [];
    // const processedDates = new Set();

    // // Her gün için sadece bir veri al
    // rangeDatas.forEach((item) => {
    //   let dateString = item.date.toISOString();
    //   const dateKey = dateString.split("T")[0];
    //   if (!processedDates.has(dateKey)) {
    //     const newItem = { ...item };
    //     uniqueRangeData.push(newItem);
    //     processedDates.add(dateKey);
    //   }
    // });

    // uniqueRangeData.forEach((deletes) => {
    //   delete deletes.id;
    //   delete deletes.kalanKontor;
    //   delete deletes.userTcVkn;
    // });
    // console.log(uniqueRangeData);

    let totalData = rangeDatas?.length;
    res.json({ totalData, rangesAnalysisData });
    // res.json(rangesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createData = async (req, res) => {
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn, date } =
    req.body.data;
    console.log(req.body.data)
  if (!alinanKontor || !kullanilanKontor || !kalanKontor || !userTcVkn|| !date) {
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
        date: "desc",
      },
    });
    let existingData;
    if (date) {
      if (
        dateTime < lastData?.date ||
        alinanKontor < lastData?.alinanKontor ||
        kullanilanKontor < lastData?.kullanilanKontor
      ) {
        let utcTr = lastData.date;
        utcTr.setHours(utcTr.getHours() - 3);
        throw new Error(`tarih, alinanKontor ve kullanilanKontor alanlarından biri son datadaki veriden daha küçük olamaz.
       Son Tarih:${utcTr.toString().slice(0, 21)},       Son Alınan:${
          lastData.alinanKontor
        },        Son Kullanılan:${lastData.kullanilanKontor}`);
      }
      existingData = await prisma.data.findFirst({
        where: {
          date: {
            equals: dateTime,
          },
        },
      });
    } else {
      if (
        today < lastData.date ||
        alinanKontor < lastData.alinanKontor ||
        kullanilanKontor < lastData.kullanilanKontor
      ) {
        let utcTr = lastData.date;
        utcTr.setHours(utcTr.getHours() - 3);
        throw new Error(`tarih, alinanKontor ve kullanilanKontor alanlarından biri son datadaki veriden daha küçük olamaz.
       Son Tarih:${utcTr.toString().slice(0, 21)},       Son Alınan:${
          lastData.alinanKontor
        },        Son Kullanılan:${lastData.kullanilanKontor}`);
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
          userTcVkn: userTcVkn,
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
          userTcVkn: userTcVkn,
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
    req.body.data;

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
          userTcVkn: userTcVkn,
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
          userTcVkn: userTcVkn,
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
  const { alinanKontor, kullanilanKontor, kalanKontor, userTcVkn } =
    req.body.data;
  try {
    const data = await prisma.data.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      res.json("Not found id");
    } else {
      try {
        const updateData = await prisma.data.update({
          where: { id: Number(id) },
          data: {
            alinanKontor:
              alinanKontor !== undefined ? Number(alinanKontor) : undefined,
            kullanilanKontor:
              kullanilanKontor !== undefined
                ? Number(kullanilanKontor)
                : undefined,
            kalanKontor:
              kalanKontor !== undefined ? Number(kalanKontor) : undefined,
            userTcVkn: userTcVkn !== undefined ? userTcVkn : undefined,
          },
        });
        res.json(updateData);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
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

module.exports = {
  createData,
  updateData,
  deleteData,
  listYear,
  rangeList,
  adminCreateData,
  pageData
};
