const moment = require("moment");
const {
  rounded,
  weekOfMonth,
  unfinishedMonth,
  unfinishedWeek,
} = require("./dateComponents");
var weekGroupedData = {};
var lastWeekItemsByKey = {};
var lastMonthItemsByKey = {};
var monthgroupedData = {};

const weekDatas = (listData, year) => {
  listData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  listData.forEach((entry) => {
    const date = moment(entry.date);
    const month = date.month() + 1;
    const weekInMonth = weekOfMonth(date.date()); // Ayın kaçıncı haftası
    const key = month.toString() + weekInMonth.toString();
    if (!weekGroupedData[key]) {
      weekGroupedData[key] = [];
    }
    weekGroupedData[key].push(entry);
  });

  // console.log(weekGroupedData)

  for (
    //bir önceki keyin son anahtarını bir sonrakine ekleme
    let keyIndex = 0;
    keyIndex < Object.keys(weekGroupedData)?.length - 1;
    keyIndex++
  ) {
    let currentKey = Object.keys(weekGroupedData)[keyIndex];
    let nextKey = Object.keys(weekGroupedData)[keyIndex + 1];

    let lastItemOfCurrentKey =
      weekGroupedData[currentKey][weekGroupedData[currentKey]?.length - 1];
    // Mevcut anahtarın son elemanını bir sonraki anahtarın başına ekle
    if (weekGroupedData[nextKey]) {
      weekGroupedData[nextKey].unshift(lastItemOfCurrentKey);
    }
  }

  const weeksData = {};
  for (let week in weekGroupedData) {
    let weekTotalUsage =
      weekGroupedData[week][weekGroupedData[week]?.length - 1].kullanilanKontor -
      weekGroupedData[week][0].kullanilanKontor;
    let weekTotalReceived =
      weekGroupedData[week][weekGroupedData[week]?.length - 1].alinanKontor -
      weekGroupedData[week][0].alinanKontor;

    let weekTotalUsageDayAvg;
    let weekTotalReceivedDayAvg;
    const today = moment().date();
    if (week?.length > 2) {
      let monthNumber = week[0] + week[1];
      // console.log(monthNumber)
      if (
        week[2] == weekOfMonth(today) &&
        monthNumber == moment().month() + 1 &&
        year == new Date().getFullYear()
      ) {
        let dayOfweek = unfinishedWeek(weekOfMonth(today), today);
        weekTotalUsageDayAvg = weekTotalUsage / dayOfweek;
        weekTotalReceivedDayAvg = weekTotalReceived / dayOfweek;
      } else {
        weekTotalUsageDayAvg = weekTotalUsage / 7;
        weekTotalReceivedDayAvg = weekTotalReceived / 7;
      }
    } else {
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
  // console.log(weekGroupedData)
  let yedek;
  let yedekKey = 0;
  for (const key in weekGroupedData) {
    ///haftaların son verisi Grafik için
    let lastItem;

    // console.log('------------------')
      

    
      let convertKey;
      if (key?.length > 2) {
        convertKey = key[0] + key[1] + "0";
      } else {
        convertKey = key[0] + "0";
      }
  
      

      if(key?.length>2){
        if (yedekKey !== key[0]+key[1]) {
          lastWeekItemsByKey[convertKey] = yedek;
      }
      }else{
        if (convertKey == "10") {
          lastWeekItemsByKey[convertKey] = weekGroupedData[key][0];
        }else if (yedekKey !== key[0]) {
          lastWeekItemsByKey[convertKey] = yedek;
      }
    }
      

      const lastItemIndex = weekGroupedData[key]?.length - 1;
      lastItem = weekGroupedData[key][lastItemIndex];
      yedek = lastItem;

      if(key?.length>2){
        yedekKey = key[0]+key[1];
      }else{
        yedekKey = key[0];
      }
      
      // console.log(yedek)
      lastWeekItemsByKey[key] = lastItem;
    
  }

  // console.log(lastWeekItemsByKey);
  // console.log(weekGroupedData)

  let daysOfWeekDatas = JSON.parse(JSON.stringify(weekGroupedData));

  for (const key in daysOfWeekDatas) {
    if (daysOfWeekDatas.hasOwnProperty(key)) {
      const entries = daysOfWeekDatas[key];
      const uniqueDates = {};

      // Tarihi kontrol et
      for (let i = 0; i < entries?.length; i++) {
        const entry = entries[i];
        const date = new Date(entry.date).toISOString().split("T")[0]; // Tarihin sadece gün kısmını al

        // En son gözlemlenen girdiyi koru
        uniqueDates[date] = entry;
      }

      // Yeniden atama
      daysOfWeekDatas[key] = Object.values(uniqueDates);
    }
  }

  for (const key in daysOfWeekDatas) {
    if (daysOfWeekDatas.hasOwnProperty(key)) {
      const entries = daysOfWeekDatas[key];
      entries.forEach((entry) => {
        delete entry.id;
        delete entry.kalanKontor;
        delete entry.userTcVkn;
      });
    }
  }
  // console.log(daysOfWeekDatas)
  return { weeksData, daysOfWeekDatas };
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const monthDatas = (listData, year) => {
  listData.forEach((entry) => {
    const month = new Date(entry.date).getMonth() + 1;
    if (!monthgroupedData[month]) {
      monthgroupedData[month] = []; //Ayın dizisi yoksa oluştur
    }
    monthgroupedData[month].push(entry);
  });

  for (
    let keyIndex = 0;
    keyIndex < Object.keys(monthgroupedData)?.length - 1;
    keyIndex++
  ) {
    let currentKey = Object.keys(monthgroupedData)[keyIndex];
    let nextKey = Object.keys(monthgroupedData)[keyIndex + 1];

    let firstItemOfCurrentKey = monthgroupedData[currentKey][0]; // Mevcut anahtarın ilk elemanı
    if (monthgroupedData[nextKey]) {
      monthgroupedData[nextKey].push(firstItemOfCurrentKey);
    }
  }

  let currentWeekOfMonth = unfinishedWeek(
    weekOfMonth(moment().date()),
    moment().date() % 7
  );

  const monthsData = {};
  for (let month in monthgroupedData) {
    let monthTotalUsage =
      monthgroupedData[month][0].kullanilanKontor -
      monthgroupedData[month][monthgroupedData[month]?.length - 1]
        .kullanilanKontor;
    let monthTotalReceived =
      monthgroupedData[month][0].alinanKontor -
      monthgroupedData[month][monthgroupedData[month]?.length - 1].alinanKontor;

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
  // Anahtarları ve son elemanları tutacak nesne
  for (const key in monthgroupedData) {
    //ayların son verisi Grafik için
    if (monthgroupedData.hasOwnProperty(key)) {
      const lastItem = monthgroupedData[key][0];
      lastMonthItemsByKey[key] = lastItem;
    }
  }
  
  lastMonthItemsByKey[0] = monthgroupedData[1]?monthgroupedData[1][monthgroupedData[1]?.length - 1]:[];
  // console.log(lastMonthItemsByKey)
  return { monthsData, lastWeekItemsByKey };
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const yearDatas = (listData, year) => {
  let yearTotalUsage =
    listData[0].kullanilanKontor -
    listData[listData?.length - 1].kullanilanKontor;
  let yearTotalReceived =
    listData[0].alinanKontor - listData[listData?.length - 1].alinanKontor;
  let yearCurrentRemaining = listData[0].kalanKontor;
  let yearCurrentUsage = listData[0].kullanilanKontor;
  let yearCurrentReceived = listData[0].alinanKontor;
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
    yearCurrentRemaining: yearCurrentRemaining,
    yearCurrentUsage: yearCurrentUsage,
    yearCurrentReceived: yearCurrentReceived,
    yearTotalReceived: yearTotalReceived,
    yearTotalUsage: yearTotalUsage,
    yearTotalReceivedMonthAvg: rounded(yearTotalReceivedMonthAvg),
    yearTotalReceivedWeekAvg: rounded(yearTotalReceivedWeekAvg),
    yearTotalReceivedDayAvg: rounded(yearTotalReceivedDayAvg),

    yearTotalUsageMonthAvg: rounded(yearTotalUsageMonthAvg),
    yearTotalUsageWeekAvg: rounded(yearTotalUsageWeekAvg),
    yearTotalUsageDayAvg: rounded(yearTotalUsageDayAvg),
  };
  return { yearsData, lastMonthItemsByKey };
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

analysisModules = (listData, year) => {
  const responseData = {
    year: yearDatas(listData, year),
    months: monthDatas(listData, year),
    weeks: weekDatas(listData, year),
  };
  return responseData;
};
module.exports = analysisModules;
