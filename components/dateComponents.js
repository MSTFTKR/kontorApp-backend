
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

  module.exports={rounded,weekOfMonth,unfinishedMonth,unfinishedWeek}