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

    // Set column widths to match the screenshot
    sheet.getColumn(1).width = 45;  // A - Info/Labels
    sheet.getColumn(2).width = 25;  // B - State License
    sheet.getColumn(3).width = 18;  // C - License Number
    sheet.getColumn(4).width = 12;  // D - Issued
    sheet.getColumn(5).width = 12;  // E - Expiration
    sheet.getColumn(6).width = 55;  // F - Education
    sheet.getColumn(7).width = 35;  // G - Employment
    sheet.getColumn(8).width = 12;  // H - Portals
    sheet.getColumn(9).width = 12;  // I - Log-ins
    sheet.getColumn(10).width = 15; // J - Notes

    // Style for borders
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Get data values
    const npi = String(data.npi || '');
    const fullName = String(data.fullLegalName || '');
    const credentials = String(data.typeOfProvider || '');
    const specialty = String(data.specialty || '');
    const personalEmail = String(data.personalEmailAddress || '');
    const dob = String(data.dateOfBirth || '');
    const pob = data.countryOfBirth === 'United States'
      ? String(data.placeOfBirth || '')
      : String(data.placeOfBirthInternational || '');
    const ssn = String(data.socialSecurityNumber || '');
    const address = String(data.homeMailingAddress || '');
    const cityStateZip = String(data.cityStateZipCode || '');
    const employer = String(data.employerPracticeName || '');

    // Education
    const undergrad = String(data.undergraduateGraduatePrograms || '');
    const medSchool = String(data.medicalSchoolProgram || '');
    const residency = String(data.internshipsResidenciesFellowships || '');
    const highSchool = String(data.highSchool || '');
    const middleSchool = String(data.middleSchool || '');

    // Parse licenses
    const activeLicenses = parseLicenseEntries(String(data.statesLicenseDetailsActive || ''));
    const deaLicenses = parseLicenseEntries(String(data.deaLicenseNumbers || ''));
    const csrLicenses = parseLicenseEntries(String(data.csrDetails || ''));
    const boardCerts = parseLicenseEntries(String(data.boardCertificationsList || ''));

    let currentRow = 1;

    // ROW 1: Header with NPI
    const headerRow = sheet.getRow(currentRow);
    headerRow.values = [
      `NPI: ${npi}`,
      'State License',
      'License Number',
      'Issued',
      'Expiration',
      'Education',
      'Employment',
      'Portals',
      'Log-ins',
      'Notes'
    ];
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.border = thinBorder;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
    });
    currentRow++;

    // ROW 2: Name, credentials, first board cert, education, employment
    const row2 = sheet.getRow(currentRow);
    const firstBoardCert = boardCerts[0] || { state: '', licenseNumber: '', issued: '', expiration: '' };

    // Build education text
    const educationLines: string[] = [];
    if (medSchool) educationLines.push(`Medical School: ${medSchool}`);
    if (undergrad) educationLines.push(`Undergrad/Grad: ${undergrad}`);
    if (highSchool) educationLines.push(`High School: ${highSchool}`);
    if (middleSchool) educationLines.push(`Middle School: ${middleSchool}`);
    if (residency) educationLines.push(`Residency/Fellowship: ${residency}`);

    row2.values = [
      `${fullName}, ${credentials}`,
      firstBoardCert.state ? `${firstBoardCert.state}` : '',
      firstBoardCert.licenseNumber,
      firstBoardCert.issued,
      firstBoardCert.expiration,
      educationLines.join('\n'),
      employer,
      '',
      '',
      ''
    ];
    row2.eachCell((cell) => { cell.border = thinBorder; cell.alignment = { wrapText: true, vertical: 'top' }; });
    row2.height = 60;
    currentRow++;

    // ROW 3: Specialty/additional board certs
    if (specialty || boardCerts.length > 1) {
      const row3 = sheet.getRow(currentRow);
      const secondBoardCert = boardCerts[1] || { state: '', licenseNumber: '', issued: '', expiration: '' };
      row3.values = [
        specialty || '',
        secondBoardCert.state || '',
        secondBoardCert.licenseNumber || '',
        secondBoardCert.issued || '',
        secondBoardCert.expiration || '',
        '', '', '', '', ''
      ];
      row3.eachCell((cell) => { cell.border = thinBorder; });
      currentRow++;
    }

    // ROW 4: Personal Email
    const emailRow = sheet.getRow(currentRow);
    emailRow.values = [`Personal Email: ${personalEmail}`, '', '', '', '', '', '', '', '', ''];
    emailRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // ROW 5: DOB with state license
    const dobRow = sheet.getRow(currentRow);
    const firstStateLicense = activeLicenses[0] || { state: '', licenseNumber: '', issued: '', expiration: '' };
    dobRow.values = [
      `DOB: ${dob}`,
      firstStateLicense.state,
      firstStateLicense.licenseNumber,
      firstStateLicense.issued,
      firstStateLicense.expiration,
      '', '', '', '', ''
    ];
    dobRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // ROW 6: POB with state license
    const pobRow = sheet.getRow(currentRow);
    const secondStateLicense = activeLicenses[1] || { state: '', licenseNumber: '', issued: '', expiration: '' };
    pobRow.values = [
      `POB: ${pob}`,
      secondStateLicense.state,
      secondStateLicense.licenseNumber,
      secondStateLicense.issued,
      secondStateLicense.expiration,
      '', '', '', '', ''
    ];
    pobRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // ROW 7: SSN with state license
    const ssnRow = sheet.getRow(currentRow);
    const thirdStateLicense = activeLicenses[2] || { state: '', licenseNumber: '', issued: '', expiration: '' };
    ssnRow.values = [
      `SSN: ${ssn}`,
      thirdStateLicense.state,
      thirdStateLicense.licenseNumber,
      thirdStateLicense.issued,
      thirdStateLicense.expiration,
      '', '', '', '', ''
    ];
    ssnRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // ROW 8: Home/Mailing Address
    const addrRow = sheet.getRow(currentRow);
    addrRow.values = [`Home/ Mailing Address`, '', '', '', '', '', '', '', '', ''];
    addrRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // ROW 9: Address value with more licenses
    const addrValueRow = sheet.getRow(currentRow);
    const fourthStateLicense = activeLicenses[3] || { state: '', licenseNumber: '', issued: '', expiration: '' };
    addrValueRow.values = [
      `${address}\n${cityStateZip}`,
      fourthStateLicense.state,
      fourthStateLicense.licenseNumber,
      fourthStateLicense.issued,
      fourthStateLicense.expiration,
      '', '', '', '', ''
    ];
    addrValueRow.eachCell((cell) => { cell.border = thinBorder; cell.alignment = { wrapText: true }; });
    currentRow++;

    // Add remaining state licenses
    for (let i = 4; i < activeLicenses.length; i++) {
      const license = activeLicenses[i];
      const row = sheet.getRow(currentRow);
      row.values = ['', license.state, license.licenseNumber, license.issued, license.expiration, '', '', '', '', ''];
      row.eachCell((cell) => { cell.border = thinBorder; });
      currentRow++;
    }

    // DEA Licenses
    for (const dea of deaLicenses) {
      const row = sheet.getRow(currentRow);
      row.values = ['', `${dea.state} DEA`, dea.licenseNumber, dea.issued, dea.expiration, '', '', '', '', ''];
      row.eachCell((cell) => { cell.border = thinBorder; });
      currentRow++;
    }

    // CSR Licenses
    for (const csr of csrLicenses) {
      const row = sheet.getRow(currentRow);
      row.values = ['', `${csr.state} CSR`, csr.licenseNumber, csr.issued, csr.expiration, '', '', '', '', ''];
      row.eachCell((cell) => { cell.border = thinBorder; });
      currentRow++;
    }

    // Physical Description
    const eyeColor = String(data.eyeColor || '');
    const hairColor = String(data.hairColor || '');
    const height = String(data.height || '');
    const weight = String(data.weight || '');

    const physRow = sheet.getRow(currentRow);
    physRow.values = [`Eye Color: ${eyeColor}, Hair: ${hairColor}, Height: ${height}, Weight: ${weight}`, '', '', '', '', '', '', '', '', ''];
    physRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Other Names
    const otherNames = String(data.anyOtherNamesUsed || '');
    const otherNamesRow = sheet.getRow(currentRow);
    otherNamesRow.values = [`Any Other Names Used?: ${otherNames}`, '', '', '', '', '', '', '', '', ''];
    otherNamesRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Citizenship
    const citizenship = String(data.citizenshipStatus || data.citizenshipImmigrationStatus || '');
    const citizenRow = sheet.getRow(currentRow);
    citizenRow.values = [`Citizenship: ${citizenship}`, '', '', '', '', '', '', '', '', ''];
    citizenRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Race/Ethnicity
    const race = String(data.raceEthnicity || '');
    const raceRow = sheet.getRow(currentRow);
    raceRow.values = [`Race / Ethnicity: ${race}`, '', '', '', '', '', '', '', '', ''];
    raceRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Languages
    const languages = String(data.languagesSpoken || data.otherLanguages || '');
    const langRow = sheet.getRow(currentRow);
    langRow.values = [`Languages: ${languages}`, '', '', '', '', '', '', '', '', ''];
    langRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Empty rows
    currentRow += 2;

    // Background Questions
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
      const row = sheet.getRow(currentRow);
      row.values = [`${q.label}: ${answer}`, '', '', '', '', '', '', '', '', ''];
      row.eachCell((cell) => { cell.border = thinBorder; cell.alignment = { wrapText: true }; });
      row.height = 30;
      currentRow++;
    }

    // Empty row
    currentRow += 2;

    // Emergency Contact
    const emergencyName = String(data.emergencyContactName || '');
    const emergencyPhone = String(data.emergencyContactNumber || '');
    const emergencyRow = sheet.getRow(currentRow);
    emergencyRow.values = [`Emergency Contact: ${emergencyName}, ${emergencyPhone}`, '', '', '', '', '', '', '', '', ''];
    emergencyRow.eachCell((cell) => { cell.border = thinBorder; });
    currentRow++;

    // Empty row
    currentRow += 2;

    // Professional References
    const references = String(data.professionalReferences || '');
    const refRow = sheet.getRow(currentRow);
    refRow.values = [`Professional References:\n${references}`, '', '', '', '', '', '', '', '', ''];
    refRow.eachCell((cell) => { cell.border = thinBorder; cell.alignment = { wrapText: true, vertical: 'top' }; });
    refRow.height = 80;

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
