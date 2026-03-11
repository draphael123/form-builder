import { FormConfig } from '@/types/form';

export const newHireFormConfig: FormConfig = {
  title: 'Fountain Onboarding: New Hire Information',
  description: 'Demographic / Personal Information\nPlease fill out all required fields. This form is for all new hires',
  submitButtonText: 'Submit',
  successMessage: 'Thank you! Your information has been submitted successfully.',
  sections: [
    {
      id: 'demographic-info',
      title: 'Fountain Onboarding: New Hire Information',
      description: 'Demographic / Personal Information',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'fullLegalName',
          type: 'short-text',
          label: 'Full Legal Name (First, Middle, Last, Suffix)',
          required: true,
        },
        {
          id: 'anyOtherNamesUsed',
          type: 'dropdown',
          label: 'Any Other Names Used',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          description: 'Example: January 7, 2019',
          required: true,
          validationType: 'birthDate',
        },
        {
          id: 'placeOfBirth',
          type: 'short-text',
          label: 'Place of Birth (City, State, Country)',
          required: true,
        },
        {
          id: 'genderPronouns',
          type: 'dropdown',
          label: 'Gender / Pronouns',
          placeholder: 'Select gender/pronouns',
          required: true,
          options: [
            { label: 'Female: She/Her', value: 'Female: She/Her' },
            { label: 'Male: He/Him', value: 'Male: He/Him' },
            { label: 'Non-binary: They/Them', value: 'Non-binary: They/Them' },
            { label: 'Prefer not to disclose', value: 'Prefer not to disclose' },
          ],
        },
        {
          id: 'socialSecurityNumber',
          type: 'short-text',
          label: 'Social Security Number',
          description: 'Format: ###-##-####',
          required: true,
          validationType: 'ssn',
        },
        {
          id: 'citizenshipStatus',
          type: 'dropdown',
          label: 'Citizenship / Immigration Status',
          placeholder: 'Select citizenship status',
          required: true,
          options: [
            { label: 'U.S. Citizen', value: 'U.S. Citizen' },
            { label: 'Permanent Resident', value: 'Permanent Resident' },
            { label: 'Temporary Visa Holder', value: 'Temporary Visa Holder' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          id: 'raceEthnicity',
          type: 'dropdown',
          label: 'Race / Ethnicity',
          description: 'Please select one or more of the following that best describes your race/ethnicity:',
          placeholder: 'Select race/ethnicity',
          required: true,
          options: [
            { label: 'Hispanic or Latino', value: 'Hispanic or Latino' },
            { label: 'White (Not Hispanic or Latino)', value: 'White (Not Hispanic or Latino)' },
            { label: 'Black or African American (Not Hispanic or Latino)', value: 'Black or African American (Not Hispanic or Latino)' },
            { label: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)', value: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)' },
            { label: 'Asian (Not Hispanic or Latino)', value: 'Asian (Not Hispanic or Latino)' },
            { label: 'American Indian or Alaska Native (Not Hispanic or Latino)', value: 'American Indian or Alaska Native (Not Hispanic or Latino)' },
            { label: 'Two or More Races (Not Hispanic or Latino)', value: 'Two or More Races (Not Hispanic or Latino)' },
            { label: 'Prefer not to answer', value: 'Prefer not to answer' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          id: 'homeMailingAddress',
          type: 'short-text',
          label: 'Home Mailing Address',
          required: true,
        },
        {
          id: 'cityStateZip',
          type: 'short-text',
          label: 'City / State / Zip Code',
          required: true,
        },
        {
          id: 'preferredPhoneNumber',
          type: 'short-text',
          label: 'Preferred Phone Number',
          description: 'Format: ###-###-####',
          required: true,
          validationType: 'phone',
        },
        {
          id: 'personalEmailAddress',
          type: 'short-text',
          label: 'Personal Email Address',
          required: true,
          validationType: 'email',
        },
        {
          id: 'emergencyContactName',
          type: 'short-text',
          label: 'Emergency Contact Name',
          required: true,
        },
        {
          id: 'emergencyContactNumber',
          type: 'short-text',
          label: 'Emergency Contact Number',
          required: true,
          validationType: 'phone',
        },
        {
          id: 'driversLicenseGovernmentId',
          type: 'file-upload',
          label: "Driver's License / Government ID",
          description: 'Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
        },
        {
          id: 'resumeCV',
          type: 'file-upload',
          label: 'Resume / CV',
          description: 'Accepted formats: PDF, DOC, DOCX (max 10MB)',
          required: true,
          accept: ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          maxSize: 10,
        },
      ],
    },
    {
      id: 'other-names-section',
      title: 'If Yes: Other Names Used',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'nameChangeDocuments',
          type: 'file-upload',
          label: 'Upload name change documents',
          description: 'Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
          showWhen: {
            field: 'anyOtherNamesUsed',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'languages-section',
      title: 'Languages',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'speaksOtherLanguages',
          type: 'dropdown',
          label: 'Do you speak any languages other than English fluently?',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'languagesSpoken',
          type: 'long-text',
          label: 'List all languages spoken fluently.',
          required: true,
          showWhen: {
            field: 'speaksOtherLanguages',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'clinical-question',
      title: 'Clinical Staff Check',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'isClinicalStaff',
          type: 'dropdown',
          label: 'Are you either a MD, DO, NP or RN',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },
    {
      id: 'non-clinical-signature',
      title: 'Certification / Signature (Non-Clinical Staff)',
      description: 'By submitting this form, I certify that the information provided above is accurate, complete, and truthful to the best of my knowledge.',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'printedName',
          type: 'short-text',
          label: 'Printed Name',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'No',
          },
        },
        {
          id: 'signatureDate',
          type: 'date',
          label: 'Date',
          description: 'Example: January 7, 2019',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'No',
          },
        },
      ],
    },
    {
      id: 'licensing-info',
      title: 'Licensing & Certifications Information (Clinical Staff)',
      description: 'For clinical staff (MD, DO, NP, RN) only. If you are not an MD, DO, NP, or RN, please enter "N/A" for questions that do not apply to you.',
      estimatedMinutes: 8,
      questions: [
        {
          id: 'maidenName',
          type: 'short-text',
          label: 'Maiden Name',
          description: 'To verify your license in specific states, please provide your maiden name.\nIf not applicable, enter NA.',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'otherNamesDetails',
          type: 'long-text',
          label: 'Provide full name and dates used',
          description: 'Example: John Rain Doe: 09/01/1986–11/01/2019',
          required: false,
          showWhen: {
            field: 'anyOtherNamesUsed',
            equals: 'Yes',
          },
        },
        {
          id: 'mothersMaidenName',
          type: 'short-text',
          label: 'Mothers Maiden Name',
          description: "To verify your license in specific states, please provide your mother's maiden name.\nIf not applicable, enter NA.",
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'typeOfProvider',
          type: 'dropdown',
          label: 'Type of Provider',
          placeholder: 'Select provider type',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'NP', value: 'NP' },
            { label: 'RN', value: 'RN' },
            { label: 'MD', value: 'MD' },
            { label: 'DO', value: 'DO' },
          ],
        },
        {
          id: 'specialty',
          type: 'short-text',
          label: 'Specialty',
          description: "Example: 'Family Health' or 'Internal Medicine'.\nIf not applicable, enter NA.",
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'deaLicenseNumbers',
          type: 'long-text',
          label: 'DEA License Numbers',
          description: 'Include the state, license number, issue date, and expiration date.\nFormat each entry on a new line.\nIf you are an RN, enter NA.\n\nExample:\nFL– MG123456 – Issued: 2/1/2022 – Exp: 1/31/2029',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'npi',
          type: 'short-text',
          label: 'National Provider Identifier - NPI',
          description: 'If you are an RN, enter NA.',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'statesLicensed',
          type: 'checkbox',
          label: 'States Licensed',
          description: "Please select all states where you're currently licensed",
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Alabama', value: 'Alabama' },
            { label: 'Alaska', value: 'Alaska' },
            { label: 'Arizona', value: 'Arizona' },
            { label: 'Arkansas', value: 'Arkansas' },
            { label: 'California', value: 'California' },
            { label: 'Colorado', value: 'Colorado' },
            { label: 'Connecticut', value: 'Connecticut' },
            { label: 'Delaware', value: 'Delaware' },
            { label: 'District of Columbia', value: 'District of Columbia' },
            { label: 'Florida', value: 'Florida' },
            { label: 'Georgia', value: 'Georgia' },
            { label: 'Hawaii', value: 'Hawaii' },
            { label: 'Idaho', value: 'Idaho' },
            { label: 'Illinois', value: 'Illinois' },
            { label: 'Indiana', value: 'Indiana' },
            { label: 'Iowa', value: 'Iowa' },
            { label: 'Kansas', value: 'Kansas' },
            { label: 'Kentucky', value: 'Kentucky' },
            { label: 'Louisiana', value: 'Louisiana' },
            { label: 'Maine', value: 'Maine' },
            { label: 'Maryland', value: 'Maryland' },
            { label: 'Massachusetts', value: 'Massachusetts' },
            { label: 'Michigan', value: 'Michigan' },
            { label: 'Minnesota', value: 'Minnesota' },
            { label: 'Mississippi', value: 'Mississippi' },
            { label: 'Missouri', value: 'Missouri' },
            { label: 'Montana', value: 'Montana' },
            { label: 'Nebraska', value: 'Nebraska' },
            { label: 'Nevada', value: 'Nevada' },
            { label: 'New Hampshire', value: 'New Hampshire' },
            { label: 'New Jersey', value: 'New Jersey' },
            { label: 'New Mexico', value: 'New Mexico' },
            { label: 'New York', value: 'New York' },
            { label: 'North Carolina', value: 'North Carolina' },
            { label: 'North Dakota', value: 'North Dakota' },
            { label: 'Ohio', value: 'Ohio' },
            { label: 'Oklahoma', value: 'Oklahoma' },
            { label: 'Oregon', value: 'Oregon' },
            { label: 'Pennsylvania', value: 'Pennsylvania' },
            { label: 'Puerto Rico', value: 'Puerto Rico' },
            { label: 'Rhode Island', value: 'Rhode Island' },
            { label: 'South Carolina', value: 'South Carolina' },
            { label: 'South Dakota', value: 'South Dakota' },
            { label: 'Tennessee', value: 'Tennessee' },
            { label: 'Texas', value: 'Texas' },
            { label: 'Utah', value: 'Utah' },
            { label: 'Vermont', value: 'Vermont' },
            { label: 'Virginia', value: 'Virginia' },
            { label: 'Washington', value: 'Washington' },
            { label: 'West Virginia', value: 'West Virginia' },
            { label: 'Wisconsin', value: 'Wisconsin' },
            { label: 'Wyoming', value: 'Wyoming' },
          ],
        },
        {
          id: 'statesLicenseDetailsActive',
          type: 'long-text',
          label: 'States License Details',
          description: 'List all active medical licenses, including the state, license number, issue date, and expiration date.\nFormat each entry on a new line.\n\nExample:\nCalifornia – A123456 – Issued: 2/1/2022 – Exp: 1/31/2028\nNew York – B987654 – Issued: 7/1/2023 – Exp: 6/30/2029',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'statesLicenseDetailsInactive',
          type: 'long-text',
          label: 'States License Details',
          description: 'List all inactive/expired medical licenses, including the state, license number, issue date, and expiration date.\nFormat each entry on a new line.\n\nExample:\nCalifornia – A123456 – Issued: 2/1/2020 – Exp: 1/31/2025\nNew York – B987654 – Issued: 7/1/2019 – Exp: 6/30/2025',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'hasCompactRNLicense',
          type: 'dropdown',
          label: 'Compact State RN License',
          description: 'Do you have a compact RN license?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'compactRNLicenseDetails',
          type: 'long-text',
          label: 'List all active Compact RN licenses.',
          description: 'Example:\nFlorida – A123456 – Issued: 2/1/2022 – Exp: 1/31/2028',
          required: true,
          showWhen: {
            field: 'hasCompactRNLicense',
            equals: 'Yes',
          },
        },
        {
          id: 'hasBoardCertificate',
          type: 'dropdown',
          label: 'Do you have a Board Certificate?',
          placeholder: 'Select an option',
          required: false,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'boardCertificationsList',
          type: 'long-text',
          label: 'List all active board certifications.',
          description: 'Format: Specialty - Certifying organization - Issued Date – Expiration date.\nFormat each entry on a new line.\n\nExample:\nFamily Nurse Practitioner – AANP 123456 – Issued: 2/1/2022 – Exp: 1/31/2028',
          required: true,
          showWhen: {
            field: 'hasBoardCertificate',
            equals: 'Yes',
          },
        },
        {
          id: 'boardCertificationsUpload',
          type: 'file-upload',
          label: 'Board Certifications',
          description: 'Upload copy of each certificate listed above. Accepted formats: PDF, JPG, PNG (max 15MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 15,
          showWhen: {
            field: 'hasBoardCertificate',
            equals: 'Yes',
          },
        },
        {
          id: 'csrDetails',
          type: 'long-text',
          label: 'CSR (Controlled Substance Registration)',
          description: 'List all CSR per state\nFormat each entry on a new line.\nFormat: UT CSR – Issued Date – Expiration Date\n\nExample:\nA123456 – Issued: 2/1/2022 – Exp: 1/31/2028\n\nIf you are an RN, enter NA.',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'npdbReport',
          type: 'file-upload',
          label: 'NPDB Self-Query Report',
          description: 'Upload your National Practitioner Data Bank (NPDB) Self-Query Report. The report must be dated within the last 90 days. Accepted formats: PDF (max 10MB)',
          required: true,
          accept: ['.pdf', 'application/pdf'],
          maxSize: 10,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['NP', 'MD', 'DO'],
          },
        },
      ],
    },
    {
      id: 'education-section',
      title: 'Education & Training',
      description: 'Format: School (City, State) / Program Name (Month & Year Attended) Completed: Month & Year\n\nExample:\nLincoln Middle School (Fort Collins, Colorado) (9/2005 – 6/2008) Completed: 6/2008',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'middleSchool',
          type: 'long-text',
          label: 'Middle School',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'highSchool',
          type: 'long-text',
          label: 'High School',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'undergraduateGraduatePrograms',
          type: 'long-text',
          label: 'All Undergraduate & Graduate Program(s)',
          description: 'Format: Undergraduate: School (City, State) / BS Program Name (Month & Year Attended) Completed: Month & Year\n\nFormat: Graduate: School (City, State) / MS Program Name (Month & Year Attended) Completed: Month & Year',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'medicalSchoolProgram',
          type: 'long-text',
          label: 'Medical School Program',
          description: 'Format: School (City, State) / Program Name (Month & Year Attended) Completed: Month & Year',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'internshipsResidenciesFellowships',
          type: 'long-text',
          label: 'Please list all internships, residencies, and fellowships in chronological order.',
          required: true,
          showWhen: {
            field: 'isMDorDO',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'work-history',
      title: 'Work History Entry',
      estimatedMinutes: 3,
      questions: [
        {
          id: 'employerPracticeName',
          type: 'short-text',
          label: 'Employer / Practice Name',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'contactNameSupervisorHR',
          type: 'short-text',
          label: 'Contact Name (Supervisor or HR)',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'contactPhoneNumber',
          type: 'short-text',
          label: 'Contact Phone Number',
          required: true,
          validationType: 'phone',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'datesOfEmployment',
          type: 'short-text',
          label: 'Dates of Employment (From–To)',
          description: 'Example: (01/2020 to 07/2023)',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'reasonForLeaving',
          type: 'long-text',
          label: 'Reason for Leaving',
          required: false,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'legal-disciplinary',
      title: 'License, Legal, or Disciplinary History',
      description: 'Please answer Yes or No to each question. If you answer Yes provide a brief explanation.',
      estimatedMinutes: 3,
      questions: [
        {
          id: 'convictedOfCrime',
          type: 'dropdown',
          label: 'Have you ever been convicted of, pled guilty or nolo contendere to a crime (felony or misdemeanor) in any jurisdiction?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'convictedOfCrimeExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'convictedOfCrime',
            equals: 'Yes',
          },
        },
        {
          id: 'disciplinaryActions',
          type: 'dropdown',
          label: 'Do you currently have any disciplinary actions, investigations, or pending complaints against any health care license in any jurisdiction?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'disciplinaryActionsExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'disciplinaryActions',
            equals: 'Yes',
          },
        },
        {
          id: 'licenseRevoked',
          type: 'dropdown',
          label: 'Have you ever had a license revoked, suspended, or otherwise acted against in another state or country?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'licenseRevokedExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'licenseRevoked',
            equals: 'Yes',
          },
        },
        {
          id: 'underInvestigation',
          type: 'dropdown',
          label: 'Are you currently under investigation in any jurisdiction?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'underInvestigationExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'underInvestigation',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'health-questions',
      title: 'Health Questions',
      description: 'Please answer Yes or No to each question. If you answer Yes provide a brief explanation',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'medicalConditionImpairAbility',
          type: 'dropdown',
          label: 'Do you have any medical condition(s) that could impair your ability to practice safely?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medicalConditionExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'medicalConditionImpairAbility',
            equals: 'Yes',
          },
        },
        {
          id: 'substancesImpairAbility',
          type: 'dropdown',
          label: 'Do you use any substances that impair your ability to practice safely?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'substancesExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'substancesImpairAbility',
            equals: 'Yes',
          },
        },
        {
          id: 'substanceUseDisorder',
          type: 'dropdown',
          label: 'Have you been treated for or diagnosed with a substance use disorder in the past 5 years?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'substanceUseDisorderExplanation',
          type: 'long-text',
          label: 'If Yes, please explain.',
          required: false,
          showWhen: {
            field: 'substanceUseDisorder',
            equals: 'Yes',
          },
        },
        {
          id: 'healthDocumentation',
          type: 'file-upload',
          label: 'Health Questions',
          description: 'If any of the three health questions above are answered Yes, documentation with the release/clearance date is required. Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: false,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'professional-references',
      title: 'Professional Reference',
      description: 'Please provide the following information for three professional references:\nFormat: Name, Title/Specialty, Phone, Email, and Known From–To (MM/YY)\n\nExample:\nDr. Jane Smith – Medical Director – (123) 456-7890 – jane.smith@email.com – 01/2020 to 07/2023',
      estimatedMinutes: 4,
      questions: [
        {
          id: 'professionalReference1',
          type: 'long-text',
          label: '1.) Professional Reference',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'professionalReference2',
          type: 'long-text',
          label: '2.) Professional Reference',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'professionalReference3',
          type: 'long-text',
          label: '3.) Professional Reference',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'physical-description',
      title: 'Physical Description',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'eyeColor',
          type: 'short-text',
          label: 'What is your eye color?',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'hairColor',
          type: 'short-text',
          label: 'What is your hair color?',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'height',
          type: 'short-text',
          label: 'What is your height?',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'weight',
          type: 'short-text',
          label: 'What is your weight?',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
      ],
    },
    {
      id: 'md-do-section',
      title: 'MD or DO Section',
      description: 'If you are an MD or DO, please select Yes in the section below.',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'isMDorDO',
          type: 'dropdown',
          label: 'Are you an MD or DO?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },
    {
      id: 'np-rn-section',
      title: 'NP or RN Section',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'nursysLicenseUpload',
          type: 'file-upload',
          label: 'Nursys Medical License Upload',
          description: 'Upload a recent Nursys-Quick Confirm-License-Verification-report pulled within the last 30 days. Accepted formats: PDF (max 10MB)',
          required: true,
          accept: ['.pdf', 'application/pdf'],
          maxSize: 10,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['NP', 'RN'],
          },
        },
        {
          id: 'isNPorRN',
          type: 'dropdown',
          label: 'Are you either a NP or RN?',
          placeholder: 'Select an option',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },
    {
      id: 'clinical-signature',
      title: 'Certification / Signature (Clinical Staff)',
      description: 'By submitting this form, I certify that the information provided above is accurate, complete, and truthful to the best of my knowledge.',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'printedNameClinical',
          type: 'short-text',
          label: 'Printed Name',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'dateClinical',
          type: 'date',
          label: 'Date',
          description: 'Example: January 7, 2019',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'rnProgram',
          type: 'long-text',
          label: 'RN Program (if applicable)',
          description: 'If not applicable, enter NA.',
          required: false,
          showWhen: {
            field: 'isNPorRN',
            equals: 'Yes',
          },
        },
        {
          id: 'npProgram',
          type: 'long-text',
          label: 'NP Program (if applicable)',
          description: 'If not applicable, enter NA.',
          required: false,
          showWhen: {
            field: 'isNPorRN',
            equals: 'Yes',
          },
        },
      ],
    },
  ],
};

// Helper function to get all field IDs for spreadsheet headers
export function getFormFieldIds(config: FormConfig): string[] {
  const fieldIds: string[] = ['timestamp'];

  config.sections.forEach((section) => {
    section.questions.forEach((question) => {
      if (question.type === 'multiple-choice-grid' || question.type === 'checkbox-grid') {
        // Grid questions have multiple fields
        const gridQuestion = question as { rows: { value: string }[] };
        gridQuestion.rows.forEach((row) => {
          fieldIds.push(`${question.id}_${row.value}`);
        });
      } else {
        fieldIds.push(question.id);
      }
    });
  });

  return fieldIds;
}

// Helper function to get human-readable headers
export function getFormHeaders(config: FormConfig): string[] {
  const headers: string[] = ['Timestamp'];

  config.sections.forEach((section) => {
    section.questions.forEach((question) => {
      if (question.type === 'multiple-choice-grid' || question.type === 'checkbox-grid') {
        const gridQuestion = question as { rows: { label: string; value: string }[] };
        gridQuestion.rows.forEach((row) => {
          headers.push(`${question.label} - ${row.label}`);
        });
      } else {
        headers.push(question.label);
      }
    });
  });

  return headers;
}
