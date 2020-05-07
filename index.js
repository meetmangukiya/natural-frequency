const orRegex = (array) => {
  return array.map((opt) => `(?:${opt})`).join("|");
};

const DURATIONS = {
  MINUTE: "minute",
  HOUR: "hour",
  SECOND: "second",
  DAY: "day"
};

const everyXDuration = (string) => {
  const durations = Object.values(DURATIONS);
  const durationRegex = `(?:(${orRegex(durations)})s?)`;

  const finalRe = new RegExp(`(?:every)\\s*(\\d+)?\\s*${durationRegex}`, "i");

  if (finalRe.test(string)) {
    const [full, number, duration] = finalRe.exec(string);
    return {
      unit: duration.toLowerCase(),
      amount: parseFloat(number),
      day: undefined,
      time: { hour: undefined, minute: undefined, amPm: undefined }
    };
  } else return false;
};

const parseOrUndefined = (num) => (num ? parseInt(num) : undefined);

const everyWeekdayAtX = (string) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "day"
  ];
  const dayRegex = `(?:(${orRegex(days)})s?)`;
  const onAtRegex = orRegex(["on", "at"]);
  const amPmRegex = orRegex(["am", "pm"]);
  const hourMinuteRegex = `(\\d{1,2})(?:(?:\\:|\\s+)(\\d{1,2}))?\\s*(${amPmRegex})?`;

  const finalRe = new RegExp(
    `(?:every)?\\s*${dayRegex}\\s*(?:${onAtRegex})?\\s*${hourMinuteRegex}`,
    "i"
  );

  if (finalRe.test(string)) {
    const [full, day, hour, minute, amPm] = finalRe.exec(string);
    //console.log(day, hour, minute, amPm);

    if (parseInt(hour) > 24 || parseInt(minute) > 60) return false;

    return {
      unit: "day",
      amount: 7,
      day: day.toLowerCase(),
      time: {
        hour: parseOrUndefined(hour),
        minute: parseOrUndefined(minute),
        amPm: amPm ? amPm.toLowerCase() : amPm
      }
    };
  } else return false;
};

const parse = (string) => {
  const matchers = [everyWeekdayAtX, everyXDuration];
  for (let matcher of matchers) {
    const matchRes = matcher(string);
    if (matchRes) return matchRes;
  }
  return false;
};

module.exports = { parse, DURATIONS };
