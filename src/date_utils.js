import moment from "moment-hijri";

const dayOfWeekCodes = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun"
};

// These functions are not exported so
// that we avoid magic strings like 'days'
function set(date, unit, to) {
  return date.set(unit, to);
}

function add(date, amount, unit) {
  return date.add(amount, unit);
}

function subtract(date, amount, unit) {
  return date.subtract(amount, unit);
}

function get(date, unit) {
  return date.get(unit);
}

function getStartOf(date, unit) {
  return date.startOf(unit);
}

function getEndOf(date, unit) {
  return date.endOf(unit);
}

function getDiff(date1, date2, unit) {
  return date1.diff(date2, unit);
}

function isSame(date1, date2, unit) {
  return date1.isSame(date2, unit);
}

function doFormat(date, format) {
  return date.format(format);
}

function arabicToEnglish(string) {
  const arabicDigitsRegExp = /[\u0660-\u0669]/g;

  return String(string).replace(arabicDigitsRegExp, function(c) {
    return c.charCodeAt(0) - 0x0660;
  });
}

function englishToArabic(string) {
  return String(string).replace(/\d/g, function(c) {
    return String.fromCharCode(+c + 0x0660);
  });
}

// ** Calendars **

export const calendars = {
  gregorian: "gregorian",
  hijri: "hijri"
};

// ** Function factories by calendar **

function addByCalendar(date, amount, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return addHijri(date, amount, unit);
    default:
      return add(date, amount, unit);
  }
}

function subtractByCalendar(date, amount, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return subtractHijri(date, amount, unit);
    default:
      return subtract(date, amount, unit);
  }
}

function setByCalendar(date, unit, to, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return setHijri(date, unit, to);
    default:
      return set(date, unit, to);
  }
}

function getByCalendar(date, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return getHijri(date, unit);
    default:
      return get(date, unit);
  }
}

function getStartOfByCalendar(date, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return getStartOfHijri(date, unit);
    default:
      return getStartOf(date, unit);
  }
}

function getEndOfByCalendar(date, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return getEndOfHijri(date, unit);
    default:
      return getStartOf(date, unit);
  }
}

function formatDateByCalendar(date, format, calendar) {
  switch (calendar) {
    case calendars.hijri:
      format = convertFormatHijri(format);
    // fall-through
    default:
      return doFormat(date, format);
  }
}

function formatYearByCalendar(year, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return englishToArabic(year);
    default:
      return year;
  }
}

function formatDayByCalendar(day, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return englishToArabic(day);
    default:
      return day;
  }
}

function isSameByCalendar(date1, date2, unit, calendar) {
  switch (calendar) {
    case calendars.hijri:
      return isSameHijri(date1, date2, unit);
    default:
      return isSame(date1, date2, unit);
  }
}

// ** Hijri **

function setHijri(date, unit, to) {
  switch (unit) {
    case "year":
      return date.iYear(to);
    case "month":
      return date.iMonth(to);
    default:
      return set(date, unit, to);
  }
}

function addHijri(date, amount, unit) {
  switch (unit) {
    case "year":
    case "month":
      unit = `i${unit}`;
    // fall-through
    default:
      return add(date, amount, unit);
  }
}

function subtractHijri(date, amount, unit) {
  switch (unit) {
    case "year":
    case "month":
      unit = `i${unit}`;
    // fall-through
    default:
      return subtract(date, amount, unit);
  }
}

function isSameHijri(date1, date2, unit) {
  switch (unit) {
    case "year":
    case "month":
      unit = `i${unit}`;

      if (date1 && date2) {
        const inputMs = date2.valueOf();
        return (
          date1
            .clone()
            .startOf(unit)
            .valueOf() <= inputMs &&
          inputMs <=
            date1
              .clone()
              .endOf(unit)
              .valueOf()
        );
      } else {
        return false;
      }
    default:
      return isSame(date1, date2, unit);
  }
}

function getHijri(date, unit) {
  switch (unit) {
    case "date":
      return date.iDate();
    case "week":
      return date.iWeek();
    case "month":
      return date.iMonth();
    case "year":
      return date.iYear();
    default:
      return get(date, unit);
  }
}

function getStartOfHijri(date, unit) {
  switch (unit) {
    case "year":
    case "month":
      unit = `i${unit}`;
    // fall-through
    default:
      return getStartOf(date, unit);
  }
}

function getEndOfHijri(date, unit) {
  switch (unit) {
    case "year":
    case "month":
      unit = `i${unit}`;
    // fall-through
    default:
      return getEndOf(date, unit);
  }
}

function convertFormatHijri(format) {
  switch (format) {
    case "L":
      return "iMM/iDD/iYYYY";
    default:
      return format
        .replace(/(Y+)/, "i$1")
        .replace(/(D+)/, "i$1")
        .replace(/(M+)/, "i$1")
        .replace(/(w+)/, "i$1")
        .replace(/(g+)/, "i$1");
  }
}

// ** Date Constructors **

export function newDate(point) {
  return moment(point);
}

export function newDateWithOffset(utcOffset) {
  return moment()
    .utc()
    .utcOffset(utcOffset);
}

export function now(maybeFixedUtcOffset) {
  if (maybeFixedUtcOffset == null) {
    return newDate();
  }
  return newDateWithOffset(maybeFixedUtcOffset);
}

export function cloneDate(date) {
  return date.clone();
}

export function parseDate(value, { dateFormat, locale }) {
  const m = moment(value, dateFormat, locale || moment.locale(), true);
  return m.isValid() ? m : null;
}

// ** Date "Reflection" **

export function isMoment(date) {
  return moment.isMoment(date);
}

export function isDate(date) {
  return moment.isDate(date);
}

// ** Date Formatting **

export function formatDate(date, format, calendar = calendars.gregorian) {
  return formatDateByCalendar(date, format, calendar);
}

export function safeDateFormat(
  date,
  { dateFormat, locale },
  calendar = calendars.gregorian
) {
  if (!date) {
    return "";
  }

  const format = Array.isArray(dateFormat) ? dateFormat[0] : dateFormat;
  const cloned = date.clone().locale(locale || moment.locale());

  return formatDateByCalendar(cloned, format, calendar) || "";
}

export function formatYear(year, calendar = calendars.gregorian) {
  return formatYearByCalendar(year, calendar);
}

export function formatDay(day, calendar = calendars.gregorian) {
  return formatDayByCalendar(day, calendar);
}

// ** Date Setters **

export function setTime(date, { hour, minute, second }) {
  date.set({ hour, minute, second });
  return date;
}

export function setMonth(date, month, calendar = calendars.gregorian) {
  return setByCalendar(date, "month", month, calendar);
}

export function setYear(date, year, calendar = calendars.gregorian) {
  return setByCalendar(date, "year", year, calendar);
}

export function setUTCOffset(date, offset) {
  return date.utcOffset(offset);
}

// ** Date Getters **

export function getSecond(date) {
  return get(date, "second");
}

export function getMinute(date) {
  return get(date, "minute");
}

export function getHour(date) {
  return get(date, "hour");
}

// Returns day of week
export function getDay(date, calendar = calendars.gregorian) {
  return getByCalendar(date, "day", calendar);
}

export function getWeek(date, calendar = calendars.gregorian) {
  return getByCalendar(date, "week", calendar);
}

export function getMonth(date, calendar = calendars.gregorian) {
  return getByCalendar(date, "month", calendar);
}

export function getYear(date, calendar = calendars.gregorian) {
  return getByCalendar(date, "year", calendar);
}

// Returns day of month
export function getDate(date, calendar = calendars.gregorian) {
  return getByCalendar(date, "date", calendar);
}

export function getUTCOffset() {
  return moment().utcOffset();
}

export function getDayOfWeekCode(day) {
  return dayOfWeekCodes[day.isoWeekday()];
}

// *** Start of ***

export function getStartOfDay(date, calendar = calendars.gregorian) {
  return getStartOfByCalendar(date, "day", calendar);
}

export function getStartOfWeek(date, calendar = calendars.gregorian) {
  return getStartOfByCalendar(date, "week", calendar);
}

export function getStartOfMonth(date, calendar = calendars.gregorian) {
  return getStartOfByCalendar(date, "month", calendar);
}

export function getStartOfDate(date, calendar = calendars.gregorian) {
  return getStartOfByCalendar(date, "date", calendar);
}

// *** End of ***

export function getEndOfWeek(date, calendar = calendars.gregorian) {
  return getEndOfByCalendar(date, "week", calendar);
}

export function getEndOfMonth(date, calendar = calendars.gregorian) {
  return getEndOfByCalendar(date, "month", calendar);
}

// ** Date Math **

// *** Addition ***

export function addMinutes(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "minutes", calendar);
}

export function addHours(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "hours", calendar);
}

export function addDays(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "days", calendar);
}

export function addWeeks(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "weeks", calendar);
}

export function addMonths(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "months", calendar);
}

export function addYears(date, amount, calendar = calendars.gregorian) {
  return addByCalendar(date, amount, "years", calendar);
}

// *** Subtraction ***
export function subtractDays(date, amount, calendar = calendars.gregorian) {
  return subtractByCalendar(date, amount, "days", calendar);
}

export function subtractWeeks(date, amount, calendar = calendars.gregorian) {
  return subtractByCalendar(date, amount, "weeks", calendar);
}

export function subtractMonths(date, amount, calendar = calendars.gregorian) {
  return subtractByCalendar(date, amount, "months", calendar);
}

export function subtractYears(date, amount, calendar = calendars.gregorian) {
  return subtractByCalendar(date, amount, "years", calendar);
}

// ** Date Comparison **

export function isBefore(date1, date2) {
  return date1.isBefore(date2);
}

export function isAfter(date1, date2) {
  return date1.isAfter(date2);
}

export function equals(date1, date2) {
  return isSame(date1, date2);
}

export function isSameYear(date1, date2, calendar = calendars.gregorian) {
  if (date1 && date2) {
    return isSameByCalendar(date1, date2, "year", calendar);
  } else {
    return !date1 && !date2;
  }
}

export function isSameMonth(date1, date2, calendar = calendars.gregorian) {
  if (date1 && date2) {
    return isSameByCalendar(date1, date2, "month", calendar);
  } else {
    return !date1 && !date2;
  }
}

export function isSameDay(date1, date2, calendar = calendars.gregorian) {
  if (date1 && date2) {
    return isSameByCalendar(date1, date2, "day", calendar);
  } else {
    return !date1 && !date2;
  }
}

export function isSameUtcOffset(date1, date2) {
  if (date1 && date2) {
    return date1.utcOffset() === date2.utcOffset();
  } else {
    return !date1 && !date2;
  }
}

export function isDayInRange(day, startDate, endDate) {
  const before = startDate
    .clone()
    .startOf("day")
    .subtract(1, "seconds");
  const after = endDate
    .clone()
    .startOf("day")
    .add(1, "seconds");
  return day
    .clone()
    .startOf("day")
    .isBetween(before, after);
}

// *** Diffing ***

export function getDaysDiff(date1, date2) {
  return getDiff(date1, date2, "days");
}

// ** Date Localization **

export function localizeDate(date, locale) {
  return date.clone().locale(locale || moment.locale());
}

export function getDefaultLocale() {
  return moment.locale();
}

export function getDefaultLocaleData() {
  return moment.localeData();
}

export function registerLocale(localeName, localeData) {
  moment.defineLocale(localeName, localeData);
}

export function getLocaleData(date) {
  return date.localeData();
}

export function getLocaleDataForLocale(locale) {
  return moment.localeData(locale);
}

export function getWeekdayMinInLocale(locale, date) {
  return locale.weekdaysMin(date);
}

export function getWeekdayShortInLocale(locale, date) {
  return locale.weekdaysShort(date);
}

// TODO what is this format exactly?
export function getMonthInLocale(
  locale,
  date,
  format,
  calendar = calendars.gregorian
) {
  switch (calendar) {
    case calendars.hijri:
      format = convertFormatHijri(format);
      break;
  }

  return locale.months(date, format);
}

export function getMonthShortInLocale(locale, date) {
  return locale.monthsShort(date);
}

// ** Utils for some components **

export function isDayDisabled(
  day,
  { minDate, maxDate, excludeDates, includeDates, filterDate } = {}
) {
  return (
    (minDate && day.isBefore(minDate, "day")) ||
    (maxDate && day.isAfter(maxDate, "day")) ||
    (excludeDates &&
      excludeDates.some(excludeDate => isSameDay(day, excludeDate))) ||
    (includeDates &&
      !includeDates.some(includeDate => isSameDay(day, includeDate))) ||
    (filterDate && !filterDate(day.clone())) ||
    false
  );
}

export function isTimeDisabled(time, disabledTimes) {
  const l = disabledTimes.length;
  for (let i = 0; i < l; i++) {
    if (
      disabledTimes[i].get("hours") === time.get("hours") &&
      disabledTimes[i].get("minutes") === time.get("minutes")
    ) {
      return true;
    }
  }

  return false;
}

export function isTimeInDisabledRange(time, { minTime, maxTime }) {
  if (!minTime || !maxTime) {
    throw new Error("Both minTime and maxTime props required");
  }

  const base = moment()
    .hours(0)
    .minutes(0)
    .seconds(0);
  const baseTime = base
    .clone()
    .hours(time.get("hours"))
    .minutes(time.get("minutes"));
  const min = base
    .clone()
    .hours(minTime.get("hours"))
    .minutes(minTime.get("minutes"));
  const max = base
    .clone()
    .hours(maxTime.get("hours"))
    .minutes(maxTime.get("minutes"));

  return !(baseTime.isSameOrAfter(min) && baseTime.isSameOrBefore(max));
}

export function allDaysDisabledBefore(
  day,
  unit,
  { minDate, includeDates } = {}
) {
  const dateBefore = day.clone().subtract(1, unit);
  return (
    (minDate && dateBefore.isBefore(minDate, unit)) ||
    (includeDates &&
      includeDates.every(includeDate =>
        dateBefore.isBefore(includeDate, unit)
      )) ||
    false
  );
}

export function allDaysDisabledAfter(
  day,
  unit,
  { maxDate, includeDates } = {}
) {
  const dateAfter = day.clone().add(1, unit);
  return (
    (maxDate && dateAfter.isAfter(maxDate, unit)) ||
    (includeDates &&
      includeDates.every(includeDate =>
        dateAfter.isAfter(includeDate, unit)
      )) ||
    false
  );
}

export function getEffectiveMinDate({ minDate, includeDates }) {
  if (includeDates && minDate) {
    return moment.min(
      includeDates.filter(includeDate =>
        minDate.isSameOrBefore(includeDate, "day")
      )
    );
  } else if (includeDates) {
    return moment.min(includeDates);
  } else {
    return minDate;
  }
}

export function getEffectiveMaxDate({ maxDate, includeDates }) {
  if (includeDates && maxDate) {
    return moment.max(
      includeDates.filter(includeDate =>
        maxDate.isSameOrAfter(includeDate, "day")
      )
    );
  } else if (includeDates) {
    return moment.max(includeDates);
  } else {
    return maxDate;
  }
}

export function getHightLightDaysMap(
  highlightDates = [],
  defaultClassName = "react-datepicker__day--highlighted"
) {
  const dateClasses = new Map();
  for (let i = 0, len = highlightDates.length; i < len; i++) {
    const obj = highlightDates[i];
    if (isMoment(obj)) {
      const key = obj.format("MM.DD.YYYY");
      const classNamesArr = dateClasses.get(key) || [];
      if (!classNamesArr.includes(defaultClassName)) {
        classNamesArr.push(defaultClassName);
        dateClasses.set(key, classNamesArr);
      }
    } else if (typeof obj === "object") {
      const keys = Object.keys(obj);
      const className = keys[0];
      const arrOfMoments = obj[keys[0]];
      if (typeof className === "string" && arrOfMoments.constructor === Array) {
        for (let k = 0, len = arrOfMoments.length; k < len; k++) {
          const key = arrOfMoments[k].format("MM.DD.YYYY");
          const classNamesArr = dateClasses.get(key) || [];
          if (!classNamesArr.includes(className)) {
            classNamesArr.push(className);
            dateClasses.set(key, classNamesArr);
          }
        }
      }
    }
  }

  return dateClasses;
}

export function timeToInjectAfter(
  startOfDay,
  currentTime,
  currentMultiplier,
  intervals,
  injectedTimes
) {
  const l = injectedTimes.length;
  for (let i = 0; i < l; i++) {
    const injectedTime = addMinutes(
      addHours(cloneDate(startOfDay), getHour(injectedTimes[i])),
      getMinute(injectedTimes[i])
    );
    const nextTime = addMinutes(
      cloneDate(startOfDay),
      (currentMultiplier + 1) * intervals
    );

    if (injectedTime.isBetween(currentTime, nextTime)) {
      return injectedTimes[i];
    }
  }

  return false;
}
