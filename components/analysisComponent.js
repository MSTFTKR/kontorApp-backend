const moment = require("moment");
const {
  rounded,
  weekOfMonth,
  unfinishedMonth,
  unfinishedWeek,
} = require("./dateComponents");

const weekDatas = (listData, year) => {
  listData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  var weekGroupedData = {};

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

  for (
    let keyIndex = 0;
    keyIndex < Object.keys(weekGroupedData).length - 1;
    keyIndex++
  ) {
    let currentKey = Object.keys(weekGroupedData)[keyIndex];
    let nextKey = Object.keys(weekGroupedData)[keyIndex + 1];

    let lastItemOfCurrentKey =
      weekGroupedData[currentKey][weekGroupedData[currentKey].length - 1];
    // Mevcut anahtarın son elemanını bir sonraki anahtarın başına ekle
    if (weekGroupedData[nextKey]) {
      weekGroupedData[nextKey].unshift(lastItemOfCurrentKey);
    }
  }

  const weeksData = {};
  for (let week in weekGroupedData) {
    let weekTotalUsage =
      weekGroupedData[week][weekGroupedData[week].length - 1].kullanilanKontor -
      weekGroupedData[week][0].kullanilanKontor;
    let weekTotalReceived =
      weekGroupedData[week][weekGroupedData[week].length - 1].alinanKontor -
      weekGroupedData[week][0].alinanKontor;

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
  console.log(weekGroupedData)

  return {weeksData };
};




const monthDatas = (listData, year) => {
  var monthgroupedData = {};
  listData.forEach((entry) => {
    const month = new Date(entry.date).getMonth() + 1;
    if (!monthgroupedData[month]) {
      monthgroupedData[month] = []; //Ayın dizisi yoksa oluştur
    }
    monthgroupedData[month].push(entry);
  });

  for (
    let keyIndex = 0;
    keyIndex < Object.keys(monthgroupedData).length - 1;
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
      monthgroupedData[month][monthgroupedData[month].length - 1].kullanilanKontor;
    let monthTotalReceived =
      monthgroupedData[month][0].alinanKontor -
      monthgroupedData[month][monthgroupedData[month].length - 1].alinanKontor;

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
  console.log(monthgroupedData)
  return { monthsData };
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

analysisModules=(listData,year)=>{
  const responseData = {
      year: yearDatas(listData, year),
      months: monthDatas(listData, year),
      weeks: weekDatas(listData, year),
  }
  return responseData
}
module.exports = analysisModules;
