const { addMinutes, hasTimeSlot } = require('./date-utils');

describe('date-utils', () => {
  describe('addMinutes', () => {
    test('08:03 + 76 minutes to equal 08:19', () => {
      expect(addMinutes('08:03', 76)).toBe('09:19');
    });

    test('1:03 + 4 minutes to equal 01:07', () => {
      expect(addMinutes('1:03', 4)).toBe('01:07');
    });

    test('15:20 + 4 minutes to equal 15:32', () => {
      expect(addMinutes('15:20', 12)).toBe('15:32');
    });
  });

  describe('hasTimeSlot', () => {
    test('should return true, when a 29 minutes slot is requested between 08:03 and 08:33', () => {
      const start = '08:03';
      const end = '08:33';
      const wantedSlotDuration = 29;
      expect(hasTimeSlot(start, end, wantedSlotDuration)).toBe(true);
    });

    test('should return false, when a 30 minutes slot is requested between 08:03 and 08:33', () => {
      const start = '08:03';
      const end = '08:33';
      const wantedSlotDuration = 30;
      expect(hasTimeSlot(start, end, wantedSlotDuration)).toBe(false);
    });
  });
});
