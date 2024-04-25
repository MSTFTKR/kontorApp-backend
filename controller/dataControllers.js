const prisma = require("../DB/prisma");
const moment = require("moment");

const rounded = (number) => {
  if (!Number.isInteger(number)) {
    let rounded = number.toFixed(2);
    return parseFloat(rounded);
  } else {
    return number;
  }
};

const weekOfMonth = (dayNumber) => {
  let weekNumber;
  if (dayNumber < 8) {
    weekNumber = 1;
  } else if (dayNumber < 15) {
    weekNumber = 2;
  } else if (dayNumber < 22) {
    weekNumber = 3;
  } else {
    weekNumber = 4;
  }
  return weekNumber;
};

const unfinishedMonth = (monthNumber, dayNumber) => {
  if (dayNumber < 4) {
    monthNumber -= 0.9;
  } else if (dayNumber < 7) {
    monthNumber -= 0.8;
  } else if (dayNumber < 10) {
    monthNumber -= 0.7;
  } else if (dayNumber < 13) {
    monthNumber -= 0.6;
  } else if (dayNumber < 16) {
    monthNumber -= 0.5;
  } else if (dayNumber < 19) {
    monthNumber -= 0.4;
  } else if (dayNumber < 22) {
    monthNumber -= 0.3;
  } else if (dayNumber < 25) {
    monthNumber -= 0.2;
  } else if (dayNumber < 28) {
    monthNumber -= 0.1;
  } else {
    monthNumber = monthNumber;
  }
  return monthNumber;
};

const unfinishedWeek = (weekNumber, dayNumber) => {
  if (dayNumber === 1) {
    weekNumber -= 0.8571;
  } else if (dayNumber === 2) {
    weekNumber -= 0.7142;
  } else if (dayNumber === 3) {
    weekNumber -= 0.5714;
  } else if (dayNumber === 4) {
    weekNumber -= 0.4285;
  } else if (dayNumber === 5) {
    weekNumber -= 0.2857;
  } else if (dayNumber === 6) {
    weekNumber -= 0.1428;
  } else {
    weekNumber = weekNumber;
  }
  return weekNumber;
};

const yearDatas = (listData, year) => {
  let yearTotalUsage =
    listData[0].kullanilanKontor -
    listData[listData.length - 1].kullanilanKontor;
  let yearTotalReceived =
    listData[0].alinanKontor - listData[listData.length - 1].alinanKontor;

  const today = new Date();
  let yearTotalUsageMonthAvg;
  let yearTotalUsageWeekAvg;
  let yearTotalUsageDayAvg;
  let yearTotalReceivedMonthAvg;
  let yearTotalReceivedWeekAvg;
  let yearTotalReceivedDayAvg;
  if (year == today.getFullYear()) {
    const dayOfYear = moment().dayOfYear();
    const weekOfYear = unfinishedWeek(moment().isoWeek(), moment().date() % 7);
    const MonthOfYear = unfinishedMonth(moment().month() + 1, moment().date());
    yearTotalUsageMonthAvg = yearTotalUsage / MonthOfYear;
    yearTotalUsageWeekAvg = yearTotalUsage / weekOfYear;
    yearTotalUsageDayAvg = yearTotalUsage / dayOfYear;
    yearTotalReceivedMonthAvg = yearTotalReceived / MonthOfYear;
    yearTotalReceivedWeekAvg = yearTotalReceived / weekOfYear;
    yearTotalReceivedDayAvg = yearTotalReceived / dayOfYear;
  } else {
    yearTotalUsageMonthAvg = yearTotalUsage / 12;
    yearTotalUsageWeekAvg = yearTotalUsage / 52.14;
    yearTotalUsageDayAvg = yearTotalUsage / 365.25;
    yearTotalReceivedMonthAvg = yearTotalReceived / 12;
    yearTotalReceivedWeekAvg = yearTotalReceived / 52.14;
    yearTotalReceivedDayAvg = yearTotalReceived / 365.25;
  }
  const yearsData = {
    yearTotalReceived: yearTotalReceived,
    yearTotalUsage: yearTotalUsage,
    yearTotalReceivedMonthAvg: rounded(yearTotalReceivedMonthAvg),
    yearTotalReceivedWeekAvg: rounded(yearTotalReceivedWeekAvg),
    yearTotalReceivedDayAvg: rounded(yearTotalReceivedDayAvg),

    yearTotalUsageMonthAvg: rounded(yearTotalUsageMonthAvg),
    yearTotalUsageWeekAvg: rounded(yearTotalUsageWeekAvg),
    yearTotalUsageDayAvg: rounded(yearTotalUsageDayAvg),
  };
  return yearsData;
};

const monthDatas = (listData, year) => {
  const groupedData = {};
  listData.forEach((entry) => {
    const month = new Date(entry.date).getMonth() + 1;
    if (!groupedData[month]) {
      groupedData[month] = []; //Ayın dizisi yoksa oluştur
    }
    groupedData[month].push(entry);
  });

  for (let keyIndex = 0; keyIndex < Object.keys(groupedData).length - 1; keyIndex++) {
    let currentKey = Object.keys(groupedData)[keyIndex];
    let nextKey = Object.keys(groupedData)[keyIndex + 1];
    
    let firstItemOfCurrentKey = groupedData[currentKey][0]; // Mevcut anahtarın ilk elemanı
    if (groupedData[nextKey]) {
        groupedData[nextKey].push(firstItemOfCurrentKey);
        
    }
}

  let currentWeekOfMonth = unfinishedWeek(
    weekOfMonth(moment().date()),
    moment().date() % 7
  );
  const monthsData = {};
  for (let month in groupedData) {
    let monthTotalUsage =
      groupedData[month][0].kullanilanKontor -
      groupedData[month][groupedData[month].length - 1].kullanilanKontor;
    let monthTotalReceived =
      groupedData[month][0].alinanKontor -
      groupedData[month][groupedData[month].length - 1].alinanKontor;

    let monthTotalUsageWeekAvg;
    let monthTotalUsageDayAvg;
    let monthTotalReceivedWeekAvg;
    let monthTotalReceivedDayAvg;
    if (month == moment().month() + 1 && year == new Date().getFullYear()) {
      const dayOfmonth = moment().date();
      monthTotalUsageWeekAvg = monthTotalUsage / currentWeekOfMonth;
      monthTotalUsageDayAvg = monthTotalUsage / dayOfmonth;

      monthTotalReceivedWeekAvg = monthTotalReceived / currentWeekOfMonth;
      monthTotalReceivedDayAvg = monthTotalReceived / dayOfmonth;
    } else {
      monthTotalUsageWeekAvg = monthTotalUsage / 4;
      monthTotalUsageDayAvg = monthTotalUsage / 30;

      monthTotalReceivedWeekAvg = monthTotalReceived / 4;
      monthTotalReceivedDayAvg = monthTotalReceived / 30;
    }

    generateMonthsData = {
      [month]: {
        monthTotalReceived: monthTotalReceived,
        monthTotalReceivedDayAvg: rounded(monthTotalReceivedDayAvg),
        monthTotalReceivedWeekAvg: rounded(monthTotalReceivedWeekAvg),

        monthTotalUsage: monthTotalUsage,
        monthTotalUsageDayAvg: rounded(monthTotalUsageDayAvg),
        monthTotalUsageWeekAvg: rounded(monthTotalUsageWeekAvg),
      },
    };
    monthsData[month] = generateMonthsData[month];
  }
  return monthsData;
};

const weekDatas = (listData, year) => {
  listData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const groupedData = {};
  listData.forEach((entry) => {
    const date = moment(entry.date);
    const month = date.month() + 1;
    const weekInMonth = weekOfMonth(date.date()); // Ayın kaçıncı haftası
    const key = month.toString() + weekInMonth.toString();
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(entry);
  });

  for (
    let keyIndex = 0;
    keyIndex < Object.keys(groupedData).length - 1;
    keyIndex++
  ) {
    let currentKey = Object.keys(groupedData)[keyIndex];
    let nextKey = Object.keys(groupedData)[keyIndex + 1];

    let lastItemOfCurrentKey =
      groupedData[currentKey][groupedData[currentKey].length - 1];
    // Mevcut anahtarın son elemanını bir sonraki anahtarın başına ekle
    if (groupedData[nextKey]) {
      groupedData[nextKey].unshift(lastItemOfCurrentKey);
    }
  }
  // console.log(groupedData);

  const weeksData = {};
  for (let week in groupedData) {
    let weekTotalUsage =
      groupedData[week][groupedData[week].length - 1].kullanilanKontor -
      groupedData[week][0].kullanilanKontor;
    let weekTotalReceived =
      groupedData[week][groupedData[week].length - 1].alinanKontor -
      groupedData[week][0].alinanKontor;

    let weekTotalUsageDayAvg;
    let weekTotalReceivedDayAvg;
    const today = moment().date();
    if (
      week[1] == weekOfMonth(today) &&
      week[0] == moment().month() + 1 &&
      year == new Date().getFullYear()
    ) {
      let dayOfweek = unfinishedWeek(weekOfMonth(today), today);
      weekTotalUsageDayAvg = weekTotalUsage / dayOfweek;
      weekTotalReceivedDayAvg = weekTotalReceived / dayOfweek;
    } else {
      weekTotalUsageDayAvg = weekTotalUsage / 7;
      weekTotalReceivedDayAvg = weekTotalReceived / 7;
    }

    generateWeeksData = {
      [week]: {
        weekTotalReceived: weekTotalReceived,
        weekTotalReceivedDayAvg: rounded(weekTotalReceivedDayAvg),

        weekTotalUsage: weekTotalUsage,
        weekTotalUsageDayAvg: rounded(weekTotalUsageDayAvg),
      },
    };
    weeksData[week] = generateWeeksData[week];
  }

  return weeksData;
};

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

    // weekDatas(listData,year);
    
    console.log(yearDatas(listData,year))
  
    // yearDatas(listData, year);
    console.log(monthDatas(listData, year));
    console.log(weekDatas(listData, year));
    const responseData = {
      data: listData,
    };
    res.json(responseData);
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
        date: "desc", // Tarihe göre büyükten küçüğe sıralama
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
  console.log(alinanKontor, kullanilanKontor, kalanKontor, userTcVkn, date);
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
        date: new Date(date),
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
    const { id } = req.query;
    const user = await prisma.data.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
    }
  } catch (error) {}

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

module.exports = { createData, updateData, deleteData, listYear, rangeList };
