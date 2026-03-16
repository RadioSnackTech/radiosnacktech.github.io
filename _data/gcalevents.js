const { DateTime } = require("luxon");

const CALENDAR_ID = "fbe3c8aa05cb3a88d705f29590ffb2b97400bb26be805ecb902e75ee82893489@group.calendar.google.com";
const TZ = "America/Toronto";

function buildMonths(events, numMonths, now) {
  const months = [];

  for (let m = 0; m < numMonths; m++) {
    const firstDay = now.plus({ months: m }).startOf('month');
    const daysInMonth = firstDay.daysInMonth;
    const monthName = firstDay.toFormat('LLLL yyyy');

    const weeks = [];
    let week = new Array(firstDay.weekday % 7).fill(null); // weekday: Mon=1..Sun=7, grid is Sun-first

    for (let d = 1; d <= daysInMonth; d++) {
      const day = firstDay.set({ day: d });
      const dateStr = day.toISODate();
      const dayEvents = events.filter(e => e.start.startsWith(dateStr));
      week.push({ day: d, dateStr, events: dayEvents });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    months.push({ name: monthName, weeks });
  }

  return months;
}

module.exports = async function () {
  const now = DateTime.now().setZone(TZ);
  const today = now.toISODate(); // YYYY-MM-DD

  const apiKey = process.env.GOOGLE_CAL_KEY;
  if (!apiKey) {
    console.warn("[gcalevents] GOOGLE_CAL_KEY not set, skipping calendar fetch");
    return { months: buildMonths([], 2, now), today };
  }

  const timeMin = now.startOf('month').toISO();
  const timeMax = now.plus({ months: 2 }).startOf('month').toISO();

  const params = new URLSearchParams({
    key: apiKey,
    timeMin,
    timeMax,
    maxResults: 100,
    singleEvents: true,
    orderBy: "startTime",
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`[gcalevents] API error: ${res.status} ${res.statusText}`);
    return { months: buildMonths([], 2, now), today };
  }

  const data = await res.json();

  const events = (data.items || []).map(event => ({
    title: event.summary || "(no title)",
    start: event.start?.dateTime || event.start?.date,
  }));

  return { months: buildMonths(events, 2, now), today };
};
