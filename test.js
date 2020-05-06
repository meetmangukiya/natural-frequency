const parse = require("./");

const randomArraySelection = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const range = (start, end, step) => {
  const array = [];

  for (let i = start; i < end; i += step) array.push(i);

  return array;
};

const duration = ["day", "hour", "minute", "second"];
const allDurations = [
  ...duration,
  ...duration.map((d) => d.toUpperCase()),
  ...duration.map((d) => `${d}s`)
];

allDurations.map((duration) => {
  let amount = null;
  let shouldBe = null;

  const normalizedDuration = duration.endsWith("s")
    ? duration.split("").slice(0, -1).join("").toLowerCase()
    : duration.toLowerCase();

  switch (duration.toLowerCase()) {
    case "day":
    case "days": {
      amount = randomArraySelection([2, 4, 6, 10]);
      shouldBe = amount * 24 * 60 * 60;
      break;
    }

    case "hour":
    case "hours": {
      amount = randomArraySelection([3, 5, 23, 43, 2]);
      shouldBe = amount * 60 * 60;
      break;
    }

    case "minute":
    case "minutes": {
      amount = randomArraySelection(range(0, 60));
      shouldBe = amount * 60;
      break;
    }

    case "second":
    case "seconds": {
      amount = randomArraySelection(range(0, 60));
      shouldBe = amount;
      break;
    }
  }

  test(`every ${amount} ${duration}`, () => {
    expect(parse(`every ${amount} ${duration}`)).toStrictEqual({
      unit: normalizedDuration,
      amount: amount
    });
  });
});

const everyWeekdayAtXTests = [
  ["every monday on 9pm", "monday", "9", undefined, "pm"],
  ["monday 9", "monday", "9", undefined, undefined],
  ["monday 10am", "monday", "10", undefined, "am"],
  ["TUesday 6pm", "tuesday", "6", undefined, "pm"],
  ["every monday at 9:24 pm", "monday", "9", "24", "pm"],
  ["every thursday on 9 34 am", "thursday", "9", "34", "am"],
];

everyWeekdayAtXTests.map(([testCase, day, hour, minute, amPm]) => {
  test(testCase, () => {
    expect(parse(testCase)).toStrictEqual({
      unit: "day",
      amount: 7,
      day,
      time: {
        hour,
        minute,
        amPm
      }
    });
  });
});

const notMatching = [
  "gibberish",
  "hey there monday",
  "monday",
  "every thursday on 934am",
];

notMatching.map((testCase) =>
  test(testCase, () => expect(parse(testCase)).toBe(false))
);
