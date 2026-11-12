const states = ["NY", "NJ", "CA", "TX"];
const violations = [
  "Double Parking",
  "Expired Meter",
  "No Parking",
  "Fire Hydrant",
  "Bus Stop"
];

const vehicleTypes = ["SUBN", "SDN"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDataset(numRows) {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    const row = {
      registrationState: states[randomInt(0, states.length - 1)],
      violationDescription: violations[randomInt(0, violations.length - 1)],
      vehicleBodyType: vehicleTypes[randomInt(0, vehicleTypes.length - 1)],
      issueDate: randomDate("2022-01-01", "2022-12-31"),
      ticketNumber: randomInt(1000000000, 9999999999)
    };
    rows.push(row);
  }

  return rows;
}

function randomDate(startStr, endStr) {
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

function getMostCommonViolationByState(rows) {
  const stateViolationCounts = new Map();

  rows.forEach((row) => {
    const key = `${row.registrationState}|${row.violationDescription}`;
    const current = stateViolationCounts.get(key) || 0;
    stateViolationCounts.set(key, current + 1);
  });

  const groupedByState = new Map();

  stateViolationCounts.forEach((count, key) => {
    const [state, violation] = key.split("|");
    if (!groupedByState.has(state)) {
      groupedByState.set(state, { violation, count });
      return;
    }

    const existing = groupedByState.get(state);
    if (count > existing.count) {
      groupedByState.set(state, { violation, count });
    }
  });

  return [...groupedByState.entries()]
    .map(([state, info]) => ({
      state,
      violation: info.violation,
      count: info.count
    }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

function renderTable(rows) {
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = "";

  rows.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.state}</td>
      <td>${item.violation}</td>
      <td>${item.count}</td>
    `;
    tableBody.appendChild(tr);
  });
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const dataset = generateDataset(20000);
  const summary = getMostCommonViolationByState(dataset);
  renderTable(summary);
});

window.addEventListener("DOMContentLoaded", () => {
  const dataset = generateDataset(20000);
  const summary = getMostCommonViolationByState(dataset);
  renderTable(summary);
});