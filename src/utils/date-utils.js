/* eslint-disable no-bitwise */
const hasTimeSlot = (start, end, timeslot) => {
  const [startH, startM] = start.split(':');
  const [endH, endM] = end.split(':');
  const startDate = new Date(0, 0, 0, startH, startM, 0);
  const endDate = new Date(0, 0, 0, endH, endM, 0);
  const diff = endDate.getTime() - startDate.getTime();
  const minutesDiff = Math.floor(diff / 1000 / 60);

  return minutesDiff > timeslot;
};

// Convert time in HH:mm format to minutes
const timeToMinutes = (time) => {
  const [h, m] = time.split(':');
  return h * 60 + (m | 0) * 1;
};

// Convert minutes to time in HH:mm format
const minutesToTime = (minutes) => {
  const z = (n) => (n < 10 ? '0' : '') + n;

  return `${z((minutes / 60 | 0))}:${z((minutes % 60) | 0)}`;
};

//  Add minutes to time,
const addMinutes = (time, minutes) => minutesToTime(timeToMinutes(time) + minutes);

exports.hasTimeSlot = hasTimeSlot;
exports.addMinutes = addMinutes;
