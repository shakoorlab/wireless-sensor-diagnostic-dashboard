// src/data/mockHourlyData.js
import { hours12amTo12pm } from '../utils/tables/hours';

function randomHex(len = 8) {
  return Math.random()
    .toString(16)
    .slice(2, 2 + len);
}

export const mockHourlyData = Array.from({ length: 15 }).map(() => {
  const name = 'WS-' + randomHex(8);
  const row = { name };

  // for each hour column h00…h12
  hours12amTo12pm.forEach((_, idx) => {
    // 70% chance “Reported”, 30% “No Data”
    row['h' + idx.toString().padStart(2, '0')] = Math.random() < 0.7 ? 'Reported' : 'No Data';
  });

  return row;
});
