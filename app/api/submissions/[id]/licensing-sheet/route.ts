import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById } from '@/lib/local-storage';
import ExcelJS from 'exceljs';

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
    sheet.getColumn(1).width = 30;  // A - Section
    sheet.getColumn(2).width = 40;  // B - Field Label
    sheet.getColumn(3).width = 60;  // C - Value

    // Styles
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4A5568' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const sectionStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF718096' } },
      alignment: { vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const labelStyle: Partial<ExcelJS.Style> = {
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7FAFC' } },
      alignment: { vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const valueStyle: Partial<ExcelJS.Style> = {
      alignment: { vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    let currentRow = 1;

    // Helper function to add a section header
    const addSectionHeader = (title: string) => {
      const row = sheet.getRow(currentRow);
      sheet.mergeCells(currentRow, 1, currentRow, 3);
      row.getCell(1).value = title;
      row.getCell(1).style = sectionStyle;
      row.height = 25;
      currentRow++;
    };

    // Helper function to add a field row
    const addField = (label: string, value: unknown) => {
      const row = sheet.getRow(currentRow);
      row.getCell(2).value = label;
      row.getCell(2).style = labelStyle;

      // Format the value
      let displayValue = '';
      if (value === null || value === undefined || value === '') {
        displayValue = '-';
      } else if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = String(value);
      }

      row.getCell(3).value = displayValue;
      row.getCell(3).style = valueStyle;

      // Auto-adjust row height for long content
      if (displayValue.length > 80 || displayValue.includes('\n')) {
        row.height = Math.min(100, 20 + (displayValue.split('\n').length * 15));
      }

      currentRow++;
    };

    // Get full name
    const firstName = String(data.firstName || '');
    const middleName = String(data.middleName || '');
    const lastName = String(data.lastName || '');
    const suffix = String(data.suffix || '');
    const fullName = [firstName, middleName, lastName, suffix].filter(Boolean).join(' ');

    // Title row with name
    const titleRow = sheet.getRow(currentRow);
    sheet.mergeCells(currentRow, 1, currentRow, 3);
    titleRow.getCell(1).value = `LICENSING SHEET: ${fullName}`;
    titleRow.getCell(1).style = headerStyle;
    titleRow.height = 30;
    currentRow++;
    currentRow++; // Empty row

    // ===== PERSONAL INFORMATION =====
    addSectionHeader('PERSONAL INFORMATION');
    addField('Full Legal Name', fullName);
    addField('Preferred Name', data.preferredName);
    addField('Date of Birth', data.dateOfBirth);
    addField('Country of Birth', data.countryOfBirth);
    addField('Place of Birth', data.countryOfBirth === 'United States' ? data.placeOfBirth : data.placeOfBirthInternational);
    addField('Gender', data.gender);
    addField('Pronouns', data.pronouns);
    addField('Citizenship Status', data.citizenshipStatus);
    addField('Race / Ethnicity', data.raceEthnicity);
    addField('Other Names Used?', data.anyOtherNamesUsed);
    if (data.anyOtherNamesUsed === 'Yes') {
      addField('Other Names Details', data.otherNamesUsedText);
    }
    currentRow++; // Empty row

    // ===== CONTACT INFORMATION =====
    addSectionHeader('CONTACT INFORMATION');
    addField('Street Address', data.homeMailingAddress);
    addField('Address Line 2', data.addressLine2);
    addField('City', data.city);
    addField('Country', data.addressCountry);
    if (data.addressCountry === 'United States') {
      addField('State', data.state);
    } else {
      addField('State / Province / Region', data.stateProvinceInternational);
      addField('Country Name', data.countryName);
    }
    addField('Zip / Postal Code', data.zipCode);
    addField('Phone Country Code', data.preferredPhoneCountryCode);
    addField('Preferred Phone Number', data.preferredPhoneNumber);
    addField('Personal Email', data.personalEmailAddress);
    currentRow++; // Empty row

    // ===== EMERGENCY CONTACTS =====
    addSectionHeader('EMERGENCY CONTACTS');
    addField('Emergency Contact 1 - Name', data.emergencyContact1Name);
    addField('Emergency Contact 1 - Relationship', data.emergencyContact1Relationship);
    addField('Emergency Contact 1 - Country Code', data.emergencyContact1PhoneCountryCode);
    addField('Emergency Contact 1 - Phone', data.emergencyContact1Phone);
    if (data.emergencyContact2Name) {
      addField('Emergency Contact 2 - Name', data.emergencyContact2Name);
      addField('Emergency Contact 2 - Relationship', data.emergencyContact2Relationship);
      addField('Emergency Contact 2 - Country Code', data.emergencyContact2PhoneCountryCode);
      addField('Emergency Contact 2 - Phone', data.emergencyContact2Phone);
    }
    currentRow++; // Empty row

    // ===== LANGUAGES =====
    if (data.speaksOtherLanguages) {
      addSectionHeader('LANGUAGES');
      addField('Speaks Other Languages?', data.speaksOtherLanguages);
      if (data.speaksOtherLanguages === 'Yes') {
        addField('Languages Spoken', data.languagesSpoken);
      }
      currentRow++; // Empty row
    }

    // ===== CLINICAL INFORMATION (if applicable) =====
    if (data.isClinicalStaff === 'Yes') {
      addSectionHeader('CLINICAL STAFF INFORMATION');
      addField('Type of Provider', data.typeOfProvider);
      addField('Specialty', data.specialty);
      addField('NPI', data.npi);
      addField('Maiden Name', data.maidenName);
      addField("Mother's Maiden Name", data.mothersMaidenName);
      currentRow++; // Empty row

      // ===== LICENSING =====
      addSectionHeader('LICENSING');
      addField('States Licensed', data.statesLicensed);
      addField('Active State License Details', data.statesLicenseDetailsActive);
      addField('Inactive/Expired Licenses', data.statesLicenseDetailsInactive);
      addField('DEA License Numbers', data.deaLicenseNumbers);
      addField('CSR Details', data.csrDetails);
      addField('Compact RN License?', data.hasCompactRNLicense);
      if (data.hasCompactRNLicense === 'Yes') {
        addField('Compact RN License Details', data.compactRNLicenseDetails);
      }
      currentRow++; // Empty row

      // ===== BOARD CERTIFICATIONS =====
      addSectionHeader('BOARD CERTIFICATIONS');
      addField('Has Board Certificate?', data.hasBoardCertificate);
      if (data.hasBoardCertificate === 'Yes') {
        addField('Board Certifications List', data.boardCertificationsList);
      }
      currentRow++; // Empty row

      // ===== EDUCATION =====
      addSectionHeader('EDUCATION & TRAINING');
      addField('Middle School', data.middleSchool);
      addField('High School', data.highSchool);
      addField('Undergraduate/Graduate Programs', data.undergraduateGraduatePrograms);
      addField('Medical School Program', data.medicalSchoolProgram);
      if (data.typeOfProvider === 'MD' || data.typeOfProvider === 'DO') {
        addField('Internships/Residencies/Fellowships', data.internshipsResidenciesFellowships);
        addField('Faculty Appointments', data.facultyAppointments);
      }
      currentRow++; // Empty row

      // ===== WORK HISTORY =====
      addSectionHeader('WORK HISTORY');
      addField('Employer / Practice Name', data.employerPracticeName);
      addField('Contact Name (Supervisor/HR)', data.contactNameSupervisorHR);
      addField('Contact Phone Country Code', data.contactPhoneCountryCode);
      addField('Contact Phone Number', data.contactPhoneNumber);
      addField('Dates of Employment', data.datesOfEmployment);
      addField('Reason for Leaving', data.reasonForLeaving);
      currentRow++; // Empty row

      // ===== LEGAL / DISCIPLINARY =====
      addSectionHeader('LEGAL / DISCIPLINARY HISTORY');
      addField('Convicted of Crime?', data.convictedOfCrime);
      if (data.convictedOfCrime === 'Yes') {
        addField('Crime Explanation', data.convictedOfCrimeExplanation);
      }
      addField('Disciplinary Actions?', data.disciplinaryActions);
      if (data.disciplinaryActions === 'Yes') {
        addField('Disciplinary Explanation', data.disciplinaryActionsExplanation);
      }
      addField('License Revoked?', data.licenseRevoked);
      if (data.licenseRevoked === 'Yes') {
        addField('License Revoked Explanation', data.licenseRevokedExplanation);
      }
      addField('Under Investigation?', data.underInvestigation);
      if (data.underInvestigation === 'Yes') {
        addField('Investigation Explanation', data.underInvestigationExplanation);
      }
      currentRow++; // Empty row

      // ===== HEALTH QUESTIONS =====
      addSectionHeader('HEALTH QUESTIONS');
      addField('Medical Condition Impairing Ability?', data.medicalConditionImpairAbility);
      if (data.medicalConditionImpairAbility === 'Yes') {
        addField('Medical Condition Explanation', data.medicalConditionExplanation);
      }
      addField('Substances Impairing Ability?', data.substancesImpairAbility);
      if (data.substancesImpairAbility === 'Yes') {
        addField('Substances Explanation', data.substancesExplanation);
      }
      addField('Substance Use Disorder (past 5 years)?', data.substanceUseDisorder);
      if (data.substanceUseDisorder === 'Yes') {
        addField('Substance Use Disorder Explanation', data.substanceUseDisorderExplanation);
      }
      currentRow++; // Empty row

      // ===== PHYSICAL DESCRIPTION =====
      addSectionHeader('PHYSICAL DESCRIPTION');
      addField('Eye Color', data.eyeColor);
      addField('Hair Color', data.hairColor);
      addField('Height', data.height);
      addField('Weight', data.weight);
      currentRow++; // Empty row

      // ===== PROFESSIONAL REFERENCES =====
      addSectionHeader('PROFESSIONAL REFERENCES');
      addField('Reference 1', data.professionalReference1);
      addField('Reference 2', data.professionalReference2);
      addField('Reference 3', data.professionalReference3);
      currentRow++; // Empty row
    }

    // ===== SENSITIVE INFORMATION =====
    addSectionHeader('SENSITIVE INFORMATION');
    addField('Social Security Number', data.socialSecurityNumber);
    currentRow++; // Empty row

    // ===== CERTIFICATION =====
    addSectionHeader('CERTIFICATION / SIGNATURE');
    if (data.isClinicalStaff === 'Yes') {
      addField('Printed Name', data.printedNameClinical);
      addField('Signature Date', data.dateClinical);
    } else {
      addField('Printed Name', data.printedName);
      addField('Signature Date', data.signatureDate);
    }
    currentRow++; // Empty row

    // ===== SUBMISSION METADATA =====
    addSectionHeader('SUBMISSION INFORMATION');
    addField('Submission ID', submission.id);
    addField('Submitted At', new Date(submission.timestamp).toLocaleString());
    addField('Status', submission.status || 'pending');

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
