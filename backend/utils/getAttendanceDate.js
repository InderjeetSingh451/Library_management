// utils/getAttendanceDate.js
export const getAttendanceDate = (date = new Date()) => {
  const dayStart = process.env.DAY_START_TIME || "00:00";
  const [startHour, startMinute] = dayStart.split(":").map(Number);

  const now = new Date(date);

  // Create today's day-start timestamp
  const dayStartToday = new Date(now);
  dayStartToday.setHours(startHour, startMinute, 0, 0);

  // If current time is BEFORE day-start → previous day
  if (now < dayStartToday) {
    now.setDate(now.getDate() - 1);
  }

  return now.toLocaleDateString("en-CA"); // YYYY-MM-DD
};
