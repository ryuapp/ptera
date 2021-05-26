import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { Datetime } from "./datetime.ts"
import { MILLISECONDS_IN_HOUR } from "./constants.ts"
import { Timezone } from "./types.ts"

Deno.test("toDateInfo", () => {
  const tests = [
    {
      stringInput: new Datetime("2021-01-01T12:30:30.000Z"),
      dateInfoInput: new Datetime({
        year: 2021,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ]

  tests.forEach((t) => {
    assertEquals(t.stringInput.toDateInfo(), t.expected)
    assertEquals(t.dateInfoInput.toDateInfo(), t.expected)
  })
})

Deno.test("toUTC", () => {
  const tests = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 3,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 17,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hours: 16,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "UTC",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ]

  tests.forEach((t) => {
    assertEquals(t.input.toUTC().toDateInfo(), t.expected)
  })
})

Deno.test("offset", () => {
  const tests = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      })
        .offset(),
      expected: 9,
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -5,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -4,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -4,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" })
        .offset(),
      expected: 0,
    },
  ]

  tests.forEach((t) => {
    assertEquals(t.input / MILLISECONDS_IN_HOUR, t.expected)
  })
})

Deno.test("toZonedTime", () => {
  type Test = {
    input: Datetime
    tz: Timezone
    expected: Datetime
  }
  const tests: Test[] = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      tz: "America/New_York",
      expected: new Datetime("2020-12-31T22:30:30.000Z", {
        timezone: "America/New_York",
      }),
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "UTC",
      }),
      tz: "Asia/Tokyo",
      expected: new Datetime("2021-01-01T21:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
    },
  ]

  tests.forEach((t) => {
    assertEquals(t.input.toZonedTime(t.tz).timezone, t.expected.timezone)
    assertEquals(
      t.input.toZonedTime(t.tz).toDateInfo(),
      t.expected.toDateInfo(),
    )
  })
})


Deno.test("toJSDate", () => {
  type Test = {
    input: Datetime
    expected: Date
  }
  const tests: Test[] = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z"
      ),
      expected: new Date(Date.UTC(2021, 0, 1, 12, 30, 30, 0)),
    },
    {
      input: new Datetime("2021-05-15T21:30:30.000Z"),
      expected: new Date(Date.UTC(2021, 4, 15, 21, 30, 30, 0)),
    },
  ]

  tests.forEach((t) => {
    assertEquals(t.input.toJSDate(), t.expected)
  })
})