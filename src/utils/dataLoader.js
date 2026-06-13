import Papa from 'papaparse';

// Helper to parse dates from DD/MM/YYYY to YYYY-MM-DD
export const parseDateStr = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

// Unified loader for all COVID CSVs
export const loadCovidData = async () => {
  const [statewiseRes, testingRes, vaccinationRes] = await Promise.all([
    fetch('/statewise.csv').then((r) => r.text()),
    fetch('/testing.csv').then((r) => r.text()),
    fetch('/vaccination.csv').then((r) => r.text()),
  ]);

  // Parse statewise.csv
  const statewiseParsed = Papa.parse(statewiseRes, {
    header: true,
    skipEmptyLines: true,
  }).data;

  // Clean and parse statewise totals
  const statesList = [];
  let nationalTotal = null;

  statewiseParsed.forEach((row) => {
    const confirmed = parseInt(row.Confirmed, 10) || 0;
    const recovered = parseInt(row.Recovered, 10) || 0;
    const deaths = parseInt(row.Deaths, 10) || 0;
    const active = parseInt(row.Active, 10) || 0;
    const lastUpdated = row.Last_Updated_Time || '';
    const stateName = row.State || '';
    const stateCode = row.State_code || '';
    const deltaConfirmed = parseInt(row.Delta_Confirmed, 10) || 0;
    const deltaRecovered = parseInt(row.Delta_Recovered, 10) || 0;
    const deltaDeaths = parseInt(row.Delta_Deaths, 10) || 0;

    const parsedRow = {
      stateName,
      stateCode,
      confirmed,
      recovered,
      deaths,
      active,
      lastUpdated,
      deltaConfirmed,
      deltaRecovered,
      deltaDeaths,
      recoveryRate: confirmed > 0 ? (recovered / confirmed) * 100 : 0,
      deathRate: confirmed > 0 ? (deaths / confirmed) * 100 : 0,
    };

    if (stateCode === 'TT' || stateName.toLowerCase() === 'total') {
      nationalTotal = parsedRow;
    } else if (stateName && stateName.toLowerCase() !== 'state pool') {
      statesList.push(parsedRow);
    }
  });

  // Sort states by confirmed cases descending
  statesList.sort((a, b) => b.confirmed - a.confirmed);

  // Parse testing.csv
  const testingParsed = Papa.parse(testingRes, {
    header: true,
    skipEmptyLines: true,
  }).data;

  const testingTimeline = [];
  const stateTestingMap = {};

  testingParsed.forEach((row) => {
    const rawDate = row['Updated On'] || row['Date'] || '';
    const date = parseDateStr(rawDate);
    const state = row.State || '';
    const rtPcr = parseInt(row['RT-PCR Test(Includes TrueNat,CBNAAT,CRISPR)'] || row['RT-PCR Test'], 10) || 0;
    const rat = parseInt(row['RAT(Rapid Antigen Test)'] || row['RAT'], 10) || 0;
    const otherTests = parseInt(row['Other Tests'], 10) || 0;
    const totalTested = parseInt(row['Total Tested'], 10) || 0;
    const positive = parseInt(row.Positive, 10) || 0;
    const negative = parseInt(row.Negative, 10) || 0;
    const icuBeds = parseInt(row['People on ICU Beds'] || row['ICU Beds'], 10) || 0;
    const oxygenBeds = parseInt(row['People on Oxygen Beds'] || row['Oxygen Beds'], 10) || 0;

    const record = {
      date,
      state,
      rtPcr,
      rat,
      otherTests,
      totalTested: totalTested || (rtPcr + rat + otherTests),
      positive,
      negative,
      icuBeds,
      oxygenBeds,
      positivityRate: totalTested > 0 ? (positive / totalTested) * 100 : 0,
    };

    if (state.toLowerCase() === 'india') {
      testingTimeline.push(record);
    } else {
      if (!stateTestingMap[state]) {
        stateTestingMap[state] = [];
      }
      stateTestingMap[state].push(record);
    }
  });

  // Sort timelines by date ascending
  testingTimeline.sort((a, b) => new Date(a.date) - new Date(b.date));
  Object.keys(stateTestingMap).forEach((st) => {
    stateTestingMap[st].sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // Parse vaccination.csv
  const vaccinationParsed = Papa.parse(vaccinationRes, {
    header: true,
    skipEmptyLines: true,
  }).data;

  const vaccinationTimeline = [];
  const stateVaccinationMap = {};

  vaccinationParsed.forEach((row) => {
    const rawDate = row['Updated On'] || '';
    const date = parseDateStr(rawDate);
    const state = row.State || '';
    const totalDoses = parseInt(row['Total Doses Administered'], 10) || 0;
    const firstDose = parseInt(row['First Dose Administered'], 10) || 0;
    const secondDose = parseInt(row['Second Dose Administered'], 10) || 0;
    const male = parseInt(row['Male(Doses Administered)'] || row['Male (Doses Administered)'], 10) || 0;
    const female = parseInt(row['Female(Doses Administered)'] || row['Female (Doses Administered)'], 10) || 0;
    const transgender = parseInt(row['Transgender(Doses Administered)'] || row['Transgender (Doses Administered)'], 10) || 0;
    const covaxin = parseInt(row['Covaxin (Doses Administered)'], 10) || 0;
    const covishield = parseInt(row['CoviShield (Doses Administered)'], 10) || 0;
    const sputnik = parseInt(row['Sputnik V (Doses Administered)'], 10) || 0;
    const aefi = parseInt(row.AEFI, 10) || 0;

    const record = {
      date,
      state,
      totalDoses,
      firstDose,
      secondDose,
      male,
      female,
      transgender,
      covaxin,
      covishield,
      sputnik,
      aefi,
    };

    if (state.toLowerCase() === 'india') {
      vaccinationTimeline.push(record);
    } else {
      if (!stateVaccinationMap[state]) {
        stateVaccinationMap[state] = [];
      }
      stateVaccinationMap[state].push(record);
    }
  });

  // Sort vaccine timelines by date ascending
  vaccinationTimeline.sort((a, b) => new Date(a.date) - new Date(b.date));
  Object.keys(stateVaccinationMap).forEach((st) => {
    stateVaccinationMap[st].sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // Synthesize national timeline cases (using vaccination or testing dates as reference, or testing timeline positive cases as guide)
  // Wait, let's create a combined national timeline. Since we don't have a direct national timeline in statewise (which only has totals),
  // we can reconstruct it from the testing positive cases or vaccine doses, or compute it.
  // Wait! Let's build a timeline of daily cases. Is there a daily case count in testing? Yes, 'Positive' in testing.csv for India represents cumulative positives.
  // Let's compute daily cases from cumulative positives in testing timeline:
  let nationalTimeline = [];
  for (let i = 0; i < testingTimeline.length; i++) {
    const curr = testingTimeline[i];
    const prev = i > 0 ? testingTimeline[i - 1] : { positive: 0, totalTested: 0, rtPcr: 0, rat: 0 };
    const dailyPositive = Math.max(0, curr.positive - prev.positive);
    const dailyTested = Math.max(0, curr.totalTested - prev.totalTested);
    
    // Find vaccine doses for this date
    const vMatch = vaccinationTimeline.find((v) => v.date === curr.date);
    
    nationalTimeline.push({
      date: curr.date,
      cumulativeConfirmed: curr.positive,
      dailyConfirmed: dailyPositive,
      cumulativeTested: curr.totalTested,
      dailyTested: dailyTested,
      positivityRate: curr.positivityRate,
      rtPcr: curr.rtPcr,
      rat: curr.rat,
      icuBeds: curr.icuBeds,
      oxygenBeds: curr.oxygenBeds,
      totalDoses: vMatch ? vMatch.totalDoses : 0,
      firstDose: vMatch ? vMatch.firstDose : 0,
      secondDose: vMatch ? vMatch.secondDose : 0,
    });
  }

  // Filter out records where dailyConfirmed is anomalously high or zero before testing started
  nationalTimeline = nationalTimeline.filter(t => t.date && t.cumulativeConfirmed > 0);

  return {
    states: statesList,
    national: nationalTotal,
    testingTimeline,
    vaccinationTimeline,
    stateTesting: stateTestingMap,
    stateVaccination: stateVaccinationMap,
    nationalTimeline,
  };
};
