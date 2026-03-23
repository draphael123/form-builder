import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById } from '@/lib/local-storage';
import ExcelJS from 'exceljs';

// Parse license entries from text format
function parseLicenseEntries(text: string): Array<{ state: string; licenseNumber: string; issued: string; expiration: string }> {
  if (!text || text === 'NA' || text === 'N/A') return [];

  const entries: Array<{ state: string; licenseNumber: string; issued: string; expiration: string }> = [];
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    // Try to parse format: "State – License# – Issued: date – Exp: date"
    const match = line.match(/^([^–-]+)[–-]\s*([^–-]+)[–-]\s*(?:Issued:?\s*)?([^–-]+)[–-]\s*(?:Exp(?:iration)?:?\s*)?(.+)$/i);
    if (match) {
      entries.push({
        state: match[1].trim(),
        licenseNumber: match[2].trim(),
        issued: match[3].trim(),
        expiration: match[4].trim(),
      });
    } else {
      // Fallback: just put the whole line in state field
      entries.push({
        state: line.trim(),
        licenseNumber: '',
        issued: '',
        expiration: '',
      });
    }
  }

  return entries;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const submission = getSubmissionById(id);

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    const data = submission.data as Record<string, unknown>;

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Licensing Sheet');

    // Set column widths
    sheet.getColumn(1).width = 40;  // Question/Label
    sheet.getColumn(2).width = 20;  // State License
    sheet.getColumn(3).width = 20;  // License Number
    sheet.getColumn(4).width = 15;  // Issued
    sheet.getColumn(5).width = 15;  // Expiration
    sheet.getColumn(6).width = 50;  // Education
    sheet.getColumn(7).width = 30;  // Employment
    sheet.getColumn(8).width = 15;  // Portals
    sheet.getColumn(9).width = 15;  // Log-ins
    sheet.getColumn(10).width = 20; // Notes

    // Style helpers
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const dataStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      alignment: { wrapText: true, vertical: 'top' },
    };

    // Row 1: Header row with NPI
    const npi = String(data.npi || '');
    const fullName = String(data.fullLegalName || '');
    const credentials = String(data.typeOfProvider || '');

    const row1 = sheet.addRow([
      `NPI: ${npi}`,
      'State License',
      'License Number',
      'Issued',
      'Expiration',
      'Education',
      'Employment',
      'Portals',
      'Log-ins',
      'Notes',
    ]);
    row1.eachCell((cell) => {
      Object.assign(cell.style, headerStyle);
    });

    // Row 2: Name and first license
    const activeLicenses = parseLicenseEntries(String(data.statesLicenseDetailsActive || ''));
    const firstLicense = activeLicenses[0] || { state: '', licenseNumber: '', issued: '', expiration: '' };

    // Education entries
    const undergrad = String(data.undergraduateGraduatePrograms || '');
    const medSchool = String(data.medicalSchoolProgram || '');
    const residency = String(data.internshipsResidenciesFellowships || '');
    const highSchool = String(data.highSchool || '');
    const middleSchool = String(data.middleSchool || '');

    const educationText = [
      undergrad ? `Undergraduate/Graduate: ${undergrad}` : '',
      medSchool ? `Medical School: ${medSchool}` : '',
      residency ? `Residency/Fellowships: ${residency}` : '',
      highSchool ? `High School: ${highSchool}` : '',
      middleSchool ? `Middle School: ${middleSchool}` : '',
    ].filter(Boolean).join('\n');

    // Employment
    const employer = String(data.employerPracticeName || '');

    const row2 = sheet.addRow([
      `${fullName}, ${credentials}`,
      firstLicense.state,
      firstLicense.licenseNumber,
      firstLicense.issued,
      firstLicense.expiration,
      educationText,
      employer,
      '',
      '',
      '',
    ]);
    row2.eachCell((cell) => Object.assign(cell.style, dataStyle));
    row2.height = 60;

    // Add more license rows
    for (let i = 1; i < activeLicenses.length; i++) {
      const license = activeLicenses[i];
      const row = sheet.addRow([
        '',
        license.state,
        license.licenseNumber,
        license.issued,
        license.expiration,
        '',
        '',
        '',
        '',
        '',
      ]);
      row.eachCell((cell) => Object.assign(cell.style, dataStyle));
    }

    // Personal Email
    const personalEmail = String(data.personalEmailAddress || '');
    const personalEmailRow = sheet.addRow([`Personal Email: ${personalEmail}`, '', '', '', '', '', '', '', '', '']);
    personalEmailRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // DOB
    const dob = String(data.dateOfBirth || '');
    const dobRow = sheet.addRow([`DOB: ${dob}`, '', '', '', '', '', '', '', '', '']);
    dobRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // POB
    const countryOfBirth = String(data.countryOfBirth || '');
    const pob = countryOfBirth === 'United States'
      ? String(data.placeOfBirth || '')
      : String(data.placeOfBirthInternational || '');
    const pobRow = sheet.addRow([`POB: ${pob}`, '', '', '', '', '', '', '', '', '']);
    pobRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // SSN
    const ssn = String(data.socialSecurityNumber || '');
    const ssnRow = sheet.addRow([`SSN: ${ssn}`, '', '', '', '', '', '', '', '', '']);
    ssnRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Home/Mailing Address
    const address = String(data.homeMailingAddress || '');
    const cityStateZip = String(data.cityStateZipCode || '');
    const addressRow = sheet.addRow([`Home/ Mailing Address: ${address}, ${cityStateZip}`, '', '', '', '', '', '', '', '', '']);
    addressRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // DEA License
    const dea = String(data.deaLicenseNumbers || '');
    const deaEntries = parseLicenseEntries(dea);
    for (const entry of deaEntries) {
      const row = sheet.addRow([
        '',
        entry.state,
        entry.licenseNumber,
        entry.issued,
        entry.expiration,
        '',
        '',
        '',
        '',
        '',
      ]);
      row.eachCell((cell) => Object.assign(cell.style, dataStyle));
    }

    // CSR
    const csr = String(data.csrDetails || '');
    const csrEntries = parseLicenseEntries(csr);
    for (const entry of csrEntries) {
      const row = sheet.addRow([
        'CSR',
        entry.state,
        entry.licenseNumber,
        entry.issued,
        entry.expiration,
        '',
        '',
        '',
        '',
        '',
      ]);
      row.eachCell((cell) => Object.assign(cell.style, dataStyle));
    }

    // Physical Description
    const eyeColor = String(data.eyeColor || '');
    const hairColor = String(data.hairColor || '');
    const height = String(data.height || '');
    const weight = String(data.weight || '');
    const physicalRow = sheet.addRow([
      `Eye Color: ${eyeColor}, Hair: ${hairColor}, Height: ${height}, Weight: ${weight}`,
      '', '', '', '', '', '', '', '', '',
    ]);
    physicalRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Other Names
    const otherNames = String(data.anyOtherNamesUsed || '');
    const otherNamesRow = sheet.addRow([`Any Other Names Used?: ${otherNames}`, '', '', '', '', '', '', '', '', '']);
    otherNamesRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Citizenship
    const citizenship = String(data.citizenshipImmigrationStatus || '');
    const citizenshipRow = sheet.addRow([`Citizenship: ${citizenship}`, '', '', '', '', '', '', '', '', '']);
    citizenshipRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Race/Ethnicity
    const race = String(data.raceEthnicity || '');
    const raceRow = sheet.addRow([`Race / Ethnicity: ${race}`, '', '', '', '', '', '', '', '', '']);
    raceRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Languages
    const languages = String(data.languagesSpoken || '');
    const languagesRow = sheet.addRow([`Languages: ${languages}`, '', '', '', '', '', '', '', '', '']);
    languagesRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Empty row
    sheet.addRow(['', '', '', '', '', '', '', '', '', '']);

    // Background Questions Section
    const backgroundQuestions = [
      { field: 'criminalConviction', label: 'Have you ever been convicted of, pled guilty or nolo contendere to a crime (felony or misdemeanor) in any jurisdiction?' },
      { field: 'disciplinaryActions', label: 'Do you currently have any disciplinary actions, investigations, or pending complaints against any health care license in any jurisdiction?' },
      { field: 'licenseRevoked', label: 'Have you ever had a license revoked, suspended, or otherwise acted against in another state or country?' },
      { field: 'underInvestigation', label: 'Are you currently under investigation in any jurisdiction?' },
      { field: 'medicalConditions', label: 'Do you have any medical condition(s) that could impair your ability to practice safely?' },
      { field: 'substanceUse', label: 'Do you use any substances that impair your ability to practice safely?' },
      { field: 'substanceDisorder', label: 'Have you been treated for or diagnosed with a substance use disorder in the past 5 years?' },
    ];

    for (const q of backgroundQuestions) {
      const answer = String(data[q.field] || '');
      const explanation = String(data[`${q.field}Explanation`] || '');
      const displayAnswer = answer + (explanation ? `: ${explanation}` : '');

      const row = sheet.addRow([`${q.label}: ${displayAnswer}`, '', '', '', '', '', '', '', '', '']);
      row.eachCell((cell) => Object.assign(cell.style, dataStyle));
      row.height = 30;
    }

    // Empty row
    sheet.addRow(['', '', '', '', '', '', '', '', '', '']);

    // Emergency Contact
    const emergencyName = String(data.emergencyContactName || '');
    const emergencyPhone = String(data.emergencyContactNumber || '');
    const emergencyRow = sheet.addRow([
      `Emergency Contact: ${emergencyName}, ${emergencyPhone}`,
      '', '', '', '', '', '', '', '', '',
    ]);
    emergencyRow.eachCell((cell) => Object.assign(cell.style, dataStyle));

    // Empty row
    sheet.addRow(['', '', '', '', '', '', '', '', '', '']);

    // Professional References
    const references = String(data.professionalReferences || '');
    const refsRow = sheet.addRow([
      `Professional References: ${references}`,
      '', '', '', '', '', '', '', '', '',
    ]);
    refsRow.eachCell((cell) => Object.assign(cell.style, dataStyle));
    refsRow.height = 80;

    // Generate the file
    const buffer = await workbook.xlsx.writeBuffer();

    // Create filename
    const safeName = fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
    const filename = `Licensing_Sheet_${safeName}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating licensing sheet:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate licensing sheet' },
      { status: 500 }
    );
  }
}
