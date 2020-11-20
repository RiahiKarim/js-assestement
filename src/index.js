const fs = require('fs');
const readline = require('readline');

const DAY_START = '08:00';
const DAY_END = '17:59';
const MEETING_TIME = 59; // 59 minutes

const { addMinutes, hasTimeSlot } = require('./utils/date-utils');

const buildWeeklyMeetingsSchedule = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const weekMeetings = [[], [], [], [], []];
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    const [day, meeting] = line.split(' ');
    const [meetingStart, meetingEnd] = meeting.split('-');
    weekMeetings[day - 1].push([meetingStart, meetingEnd]);
  }

  return weekMeetings;
};

/* Merge overlapping Meetings
 *
 * Example:
 * [['11:15','12:05],['14:00','15:00'],['11:30','12:30']] -> [['11:15','12:30'],['14:00','15:00']]
 */
const mergeOverlappingMeetings = (meetings) => {
  if (meetings.length <= 1) {
    return meetings;
  }

  // sort the meetings based on increasing order of starting time
  meetings.sort((m1, m2) => {
    if (m1[0] > m2[0]) {
      return 1;
    }
    if (m1[0] < m2[0]) {
      return -1;
    }
    return 0;
  });

  const stack = [];
  // push the first meeting into the stack
  stack.push(meetings[0]);

  for (let i = 1; i < meetings.length; i += 1) {
    const currentMeeting = meetings[i];
    const [currentMeetingStart, currentMeetingEnd] = currentMeeting;

    // get the last meeting
    const lastMeeting = stack[stack.length - 1];
    const [lastMeetingStart, lastMeetingEnd] = lastMeeting;

    // if the current meeting does not overlap with the last meeting, push it
    if (lastMeetingEnd < currentMeetingStart) {
      stack.push(currentMeeting);
    } else if (lastMeetingEnd < currentMeetingEnd) {
      // otherwise update the end of the last meeting
      stack.pop();
      stack.push([lastMeetingStart, currentMeetingEnd]);
    }
  }

  // The stack contains the merged meetings
  return stack;
};

const findDayFreeSlot = (busySlots) => {
  if (busySlots.length === 0) {
    return [DAY_START, '08:59'];
  }

  const firstBusySlot = busySlots[0];
  // if the meeting is possible before the first busy slot in the day
  if (firstBusySlot[0] !== DAY_START && hasTimeSlot(DAY_START, firstBusySlot[0], MEETING_TIME)) {
    return [DAY_START, '08:59'];
  }

  // if the meeting is possible between busy slots
  for (let index = 1; index < busySlots.length; index += 1) {
    const prevBusySlotEnd = busySlots[index - 1][1];
    const currBusySlotStart = busySlots[index][0];

    if (hasTimeSlot(prevBusySlotEnd, currBusySlotStart, MEETING_TIME)) {
      const meetingStart = addMinutes(prevBusySlotEnd, 1);
      const meetingEnd = addMinutes(meetingStart, MEETING_TIME);
      return [meetingStart, meetingEnd];
    }
  }

  const lastBusySlot = busySlots[busySlots.length - 1];
  // if the meeting is possible after the last busy slot in the day
  if (lastBusySlot[1] !== DAY_END && hasTimeSlot(lastBusySlot[1], DAY_END, MEETING_TIME)) {
    const meetingStart = addMinutes(lastBusySlot[1], 1);
    const meetingEnd = addMinutes(lastBusySlot[1], MEETING_TIME);
    return [meetingStart, meetingEnd];
  }

  return null;
};

const findFreeSlot = async (dataFilename) => {
  const weekSchedule = await buildWeeklyMeetingsSchedule(dataFilename);
  for (let day = 0; day < weekSchedule.length; day += 1) {
    const daySchedule = weekSchedule[day];
    const dayBusySlots = mergeOverlappingMeetings(daySchedule);
    const freeSlot = findDayFreeSlot(dayBusySlots);
    if (freeSlot) {
      return `${day + 1} ${freeSlot[0]}-${freeSlot[1]}`;
    }
  }
  return null;
};

// const main = async () => {
//   console.log(await findFreeSlot('./data/input1.txt'));
//   console.log(await findFreeSlot('./data/input2.txt'));
//   console.log(await findFreeSlot('./data/input3.txt'));
//   console.log(await findFreeSlot('./data/input4.txt'));
//   console.log(await findFreeSlot('./data/input5.txt'));
// };

// main();

exports.findFreeSlot = findFreeSlot;
