const fs = require('fs');
const { findFreeSlot } = require('./index');

describe('findFreeSlot', () => {
  [1, 2, 3, 4, 5].forEach((fileIndex) => {
    test('should return the correct output', async () => {
      const output = fs.readFileSync(`./data/output${fileIndex}.txt`, 'utf8');
      expect(await findFreeSlot(`./data/input${fileIndex}.txt`)).toBe(output);
    });
  });
});
