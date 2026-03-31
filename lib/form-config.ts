import { FormConfig } from '@/types/form';

// Country code options reused across multiple phone fields
const countryCodeOptions = [
  { label: 'United States / Canada (+1)', value: '+1' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'Australia (+61)', value: '+61' },
  { label: 'Germany (+49)', value: '+49' },
  { label: 'France (+33)', value: '+33' },
  { label: 'India (+91)', value: '+91' },
  { label: 'China (+86)', value: '+86' },
  { label: 'Japan (+81)', value: '+81' },
  { label: 'Mexico (+52)', value: '+52' },
  { label: 'Brazil (+55)', value: '+55' },
  { label: 'Philippines (+63)', value: '+63' },
  { label: 'South Korea (+82)', value: '+82' },
  { label: 'Italy (+39)', value: '+39' },
  { label: 'Spain (+34)', value: '+34' },
  { label: 'Netherlands (+31)', value: '+31' },
  { label: 'Other', value: 'Other' },
];

// Full country list for Country of Birth (Item 9)
const countryOptions = [
  { label: 'United States', value: 'United States' },
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Dominican Republic', value: 'Dominican Republic' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Haiti', value: 'Haiti' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'Hong Kong', value: 'Hong Kong' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Jamaica', value: 'Jamaica' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Lebanon', value: 'Lebanon' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Panama', value: 'Panama' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Puerto Rico', value: 'Puerto Rico' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Taiwan', value: 'Taiwan' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Venezuela', value: 'Venezuela' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Other', value: 'Other' },
];

// US States list
const usStateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

// Race/Ethnicity options for multi-select checkbox (Item 3)
const raceEthnicityOptions = [
  { label: 'Hispanic or Latino', value: 'Hispanic or Latino' },
  { label: 'White (Not Hispanic or Latino)', value: 'White (Not Hispanic or Latino)' },
  { label: 'Black or African American (Not Hispanic or Latino)', value: 'Black or African American (Not Hispanic or Latino)' },
  { label: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)', value: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)' },
  { label: 'Asian (Not Hispanic or Latino)', value: 'Asian (Not Hispanic or Latino)' },
  { label: 'American Indian or Alaska Native (Not Hispanic or Latino)', value: 'American Indian or Alaska Native (Not Hispanic or Latino)' },
  { label: 'Two or More Races (Not Hispanic or Latino)', value: 'Two or More Races (Not Hispanic or Latino)' },
  { label: 'Prefer not to answer', value: 'Prefer not to answer' },
];

// Relationship options for emergency contacts
const relationshipOptions = [
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Child', value: 'Child' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Other Relative', value: 'Other Relative' },
  { label: 'Other', value: 'Other' },
];

export const newHireFormConfig: FormConfig = {
  title: 'Fountain Onboarding: New Hire Information',
  description: 'Demographic / Personal Information\nPlease fill out all required fields. This form is for all new hires',
  submitButtonText: 'Submit',
  successMessage: 'Thank you! Your information has been submitted successfully.',
  sections: [
    // ============================================================
    // SECTION 1A: Basic Personal Information
    // ============================================================
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Name, date of birth, and place of birth',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'firstName',
          type: 'short-text',
          label: 'First Name',
          required: true,
        },
        {
          id: 'middleName',
          type: 'short-text',
          label: 'Middle Name (optional)',
          required: false,
        },
        {
          id: 'lastName',
          type: 'short-text',
          label: 'Last Name',
          required: true,
        },
        {
          id: 'suffix',
          type: 'dropdown',
          label: 'Suffix (optional)',
          placeholder: 'Select if applicable',
          required: false,
          options: [
            { label: 'Jr.', value: 'Jr.' },
            { label: 'Sr.', value: 'Sr.' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ],
        },
        {
          id: 'preferredName',
          type: 'short-text',
          label: 'Preferred Name (optional)',
          description: 'What name do you go by day-to-day?',
          required: false,
        },
        {
          id: 'anyOtherNamesUsed',
          type: 'dropdown',
          label: 'Have you used any other names?',
          description: 'Including maiden names, aliases, or previous legal names',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'otherNamesUsedText',
          type: 'short-text',
          label: 'Other Names Used',
          description: 'List all other names you have used',
          required: true,
          showWhen: {
            field: 'anyOtherNamesUsed',
            equals: 'Yes',
          },
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'birthDate',
        },
        {
          id: 'countryOfBirth',
          type: 'dropdown',
          label: 'Country of Birth',
          placeholder: 'Select country',
          required: true,
          options: countryOptions,
        },
        {
          id: 'placeOfBirth',
          type: 'short-text',
          label: 'Place of Birth (City, State)',
          placeholder: 'e.g., Miami, FL',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'United States',
          },
        },
        {
          id: 'placeOfBirthInternational',
          type: 'short-text',
          label: 'Place of Birth (City)',
          placeholder: 'e.g., London',
          description: 'Enter the city where you were born',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'Other',
          },
        },
        {
          id: 'countryOfBirthOther',
          type: 'short-text',
          label: 'Country of Birth (specify)',
          placeholder: 'Enter your country of birth',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'Other',
          },
        },
      ],
    },

    // ============================================================
    // SECTION 1B: Identity & Demographics
    // ============================================================
    {
      id: 'identity-demographics',
      title: 'Identity & Demographics',
      description: 'Gender, citizenship, and demographic information',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'gender',
          type: 'dropdown',
          label: 'Gender',
          placeholder: 'Select gender',
          required: true,
          options: [
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
            { label: 'Non-binary', value: 'Non-binary' },
            { label: 'Prefer not to disclose', value: 'Prefer not to disclose' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          id: 'pronouns',
          type: 'short-text',
          label: 'Pronouns (optional)',
          placeholder: 'e.g., she/her, he/him, they/them',
          required: false,
        },
        {
          id: 'citizenshipStatus',
          type: 'dropdown',
          label: 'Citizenship / Immigration Status',
          description: 'Required for I-9 employment verification',
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
          type: 'checkbox',
          label: 'Race / Ethnicity',
          description: 'Select all that apply. This information is collected for EEO compliance purposes.',
          required: true,
          options: raceEthnicityOptions,
        },
      ],
    },

    // ============================================================
    // SECTION 1C: Contact Information
    // ============================================================
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Address, phone, and email',
      estimatedMinutes: 2,
      questions: [
        {
          // Item 4: Street Address is required (already was, confirming)
          id: 'homeMailingAddress',
          type: 'short-text',
          label: 'Street Address',
          placeholder: 'Street address, P.O. box',
          required: true,
        },
        {
          id: 'addressLine2',
          type: 'short-text',
          label: 'Address Line 2',
          placeholder: 'Apartment, suite, unit, building, floor, etc.',
          required: false,
        },
        {
          id: 'city',
          type: 'short-text',
          label: 'City',
          required: true,
        },
        {
          id: 'addressCountry',
          type: 'dropdown',
          label: 'Country',
          placeholder: 'Select country',
          required: true,
          options: [
            { label: 'United States', value: 'United States' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          // Conditional: Show state dropdown for US addresses
          id: 'state',
          type: 'dropdown',
          label: 'State',
          placeholder: 'Select state',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'United States',
          },
          options: usStateOptions,
        },
        {
          // Conditional: Show free text for international addresses
          id: 'stateProvinceInternational',
          type: 'short-text',
          label: 'State / Province / Region',
          placeholder: 'Enter your state, province, or region',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'Other',
          },
        },
        {
          // Conditional: Show country name for international addresses
          id: 'countryName',
          type: 'short-text',
          label: 'Country Name',
          placeholder: 'Enter your country',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'Other',
          },
        },
        {
          // Item 6: Added zipCode validation type for US ZIP format
          id: 'zipCode',
          type: 'short-text',
          label: 'Zip / Postal Code',
          placeholder: '12345 or 12345-6789',
          description: 'US format: 5 digits or ZIP+4',
          required: true,
          validationType: 'zipCode',
        },
        {
          id: 'preferredPhoneCountryCode',
          type: 'dropdown',
          label: 'Phone Country Code',
          placeholder: 'Select country code',
          required: true,
          options: countryCodeOptions,
        },
        {
          id: 'preferredPhoneCountryCodeOther',
          type: 'short-text',
          label: 'Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter your country code with + sign',
          required: true,
          showWhen: {
            field: 'preferredPhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          // Item 7: Phone input masking is handled in TextField component
          id: 'preferredPhoneNumber',
          type: 'short-text',
          label: 'Preferred Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
        },
        {
          id: 'personalEmailAddress',
          type: 'short-text',
          label: 'Personal Email Address',
          required: true,
          validationType: 'email',
        },
        {
          // Item 8: Added Confirm Email field
          id: 'confirmEmailAddress',
          type: 'short-text',
          label: 'Confirm Personal Email Address',
          description: 'Please re-enter your email address to confirm',
          required: true,
          validationType: 'confirmEmail',
        },
      ],
    },

    // ============================================================
    // SECTION 1D: Emergency Contacts
    // ============================================================
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      description: 'Who should we contact in case of emergency?',
      estimatedMinutes: 2,
      questions: [
        // Emergency Contact 1 (Required)
        {
          id: 'emergencyContact1Name',
          type: 'short-text',
          label: 'Emergency Contact 1 - Name',
          required: true,
        },
        {
          id: 'emergencyContact1Relationship',
          type: 'dropdown',
          label: 'Emergency Contact 1 - Relationship',
          placeholder: 'Select relationship',
          required: true,
          options: relationshipOptions,
        },
        {
          id: 'emergencyContact1PhoneCountryCode',
          type: 'dropdown',
          label: 'Emergency Contact 1 - Country Code',
          placeholder: 'Select country code',
          required: true,
          options: countryCodeOptions,
        },
        {
          id: 'emergencyContact1PhoneCountryCodeOther',
          type: 'short-text',
          label: 'Emergency Contact 1 - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: true,
          showWhen: {
            field: 'emergencyContact1PhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          id: 'emergencyContact1Phone',
          type: 'short-text',
          label: 'Emergency Contact 1 - Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
        },

        // Emergency Contact 2 (Optional)
        // Item 5: EC2 Name is always visible, but other EC2 fields are hidden until name is entered
        {
          id: 'emergencyContact2Name',
          type: 'short-text',
          label: 'Emergency Contact 2 - Name',
          description: 'Optional secondary contact',
          required: false,
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2Relationship',
          type: 'dropdown',
          label: 'Emergency Contact 2 - Relationship',
          placeholder: 'Select relationship',
          required: false,
          options: relationshipOptions,
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2PhoneCountryCode',
          type: 'dropdown',
          label: 'Emergency Contact 2 - Country Code',
          placeholder: 'Select country code',
          required: false,
          options: countryCodeOptions,
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
        {
          id: 'emergencyContact2PhoneCountryCodeOther',
          type: 'short-text',
          label: 'Emergency Contact 2 - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: false,
          showWhen: {
            field: 'emergencyContact2PhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2Phone',
          type: 'short-text',
          label: 'Emergency Contact 2 - Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: false,
          validationType: 'phoneInternational',
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
      ],
    },

    // ============================================================
    // SECTION 1E: Document Uploads
    // ============================================================
    {
      id: 'document-uploads',
      title: 'Document Uploads',
      description: 'Upload required identification documents',
      estimatedMinutes: 2,
      questions: [
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

    // ============================================================
    // SECTION: Other Names Documentation (Item 2 - Conditional on anyOtherNamesUsed)
    // Only shown if user answered "Yes" to "Have you used any other names?"
    // ============================================================
    {
      id: 'other-names-section',
      title: 'Other Names Documentation',
      estimatedMinutes: 1,
      // Item 2: Section-level conditional - only show if user has other names
      showWhen: {
        field: 'anyOtherNamesUsed',
        equals: 'Yes',
      },
      questions: [
        {
          id: 'nameChangeDocuments',
          type: 'file-upload',
          label: 'Upload name change documents',
          description: 'Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
        },
      ],
    },

    // ============================================================
    // SECTION: Languages
    // ============================================================
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

    // ============================================================
    // SECTION: Clinical Staff Check
    // ============================================================
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

    // ============================================================
    // SECTION: Non-Clinical Signature
    // ============================================================
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
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'No',
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Licensing & Certifications (Clinical Staff Only)
    // ============================================================
    {
      id: 'licensing-info',
      title: 'Licensing & Certifications Information',
      description: 'For clinical staff (MD, DO, NP, RN) only.',
      estimatedMinutes: 8,
      showWhen: {
        field: 'isClinicalStaff',
        equals: 'Yes',
      },
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
          description: 'Example: John Rain Doe: 09/01/1986â11/01/2019',
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
          description: 'Include the state, license number, issue date, and expiration date.\nFormat each entry on a new line.\nIf you are an RN, enter NA.\n\nExample:\nFLâ MG123456 â Issued: 2/1/2022 â Exp: 1/31/2029',
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
          label: 'Active State License Details',
          description: 'List all active medical licenses. Enter each license on its own line using the format:\n[State] â [License Number] â Issued: MM/DD/YYYY â Exp: MM/DD/YYYY\n\nExample:\nCalifornia â A123456 â Issued: 02/01/2022 â Exp: 01/31/2028\nNew York â B987654 â Issued: 07/01/2023 â Exp: 06/30/2029',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'statesLicenseDetailsInactive',
          type: 'long-text',
          label: 'Inactive/Expired State License Details',
          description: 'List all inactive/expired medical licenses. Enter each license on its own line using the format:\n[State] â [License Number] â Issued: MM/DD/YYYY â Exp: MM/DD/YYYY\n\nExample:\nCalifornia â A123456 â Issued: 02/01/2020 â Exp: 01/31/2025\nNew York â B987654 â Issued: 07/01/2019 â Exp: 06/30/2025',
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
          description: 'Example:\nFlorida â A123456 â Issued: 2/1/2022 â Exp: 1/31/2028',
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
          description: 'Format: Specialty - Certifying organization - Issued Date â Expiration date.\nFormat each entry on a new line.\n\nExample:\nFamily Nurse Practitioner â AANP 123456 â Issued: 2/1/2022 â Exp: 1/31/2028',
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
          description: 'List all CSR per state\nFormat each entry on a new line.\nFormat: UT CSR â Issued Date â Expiration Date\n\nExample:\nA123456 â Issued: 2/1/2022 â Exp: 1/31/2028\n\nIf you are an RN, enter NA.',
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
          description: 'Upload your National Practitioner Data Bank (NPDB) Self-Query Report. The report must be dated within the last 90 days. Accepted formats: PDF (max 10MB)\n\nPlease note the Licensing Team will be reaching out to gather login information to submit applications and renewals on your behalf. This will help them initiate and process applications efficiently.',
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

    // ============================================================
    // SECTION: Education & Training
    // ============================================================
    {
      id: 'education-section',
      title: 'Education & Training',
      description: 'Format: School (City, State) / Program Name (Month & Year Attended) Completed: Month & Year\n\nExample:\nLincoln Middle School (Fort Collins, Colorado) (9/2005 â 6/2008) Completed: 6/2008',
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
          label: 'Internships, Residencies, and Fellowships',
          description: 'List all internships, residencies, and fellowships in chronological order. Enter each entry on its own line using the format:\nProgram Name â Role/Title â Start: MM/DD/YYYY â End: MM/DD/YYYY\n\nExample:\nJohns Hopkins Hospital â Internal Medicine Residency â Start: 07/01/2018 â End: 06/30/2021\nMayo Clinic â Cardiology Fellowship â Start: 07/01/2021 â End: 06/30/2024',
          required: true,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['MD', 'DO'],
          },
        },
        {
          id: 'facultyAppointments',
          type: 'long-text',
          label: 'Faculty Appointments',
          description: 'List all faculty appointments. Enter each appointment on its own line using the format:\nInstitution Name â Title/Position â Start: MM/DD/YYYY â End: MM/DD/YYYY\n\nExample:\nHarvard Medical School â Associate Professor â Start: 08/15/2019 â End: Present\nStanford University â Clinical Instructor â Start: 07/01/2016 â End: 07/31/2019',
          required: false,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['MD', 'DO'],
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Work History
    // ============================================================
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
          id: 'contactPhoneCountryCode',
          type: 'dropdown',
          label: 'Contact Phone - Country Code',
          placeholder: 'Select country code',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: countryCodeOptions,
        },
        {
          id: 'contactPhoneCountryCodeOther',
          type: 'short-text',
          label: 'Contact Phone - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: true,
          showWhen: {
            field: 'contactPhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          id: 'contactPhoneNumber',
          type: 'short-text',
          label: 'Contact Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'datesOfEmployment',
          type: 'short-text',
          label: 'Dates of Employment (FromâTo)',
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

    // ============================================================
    // SECTION: Legal / Disciplinary History
    // ============================================================
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
          label: 'If Yes, please explain (Crime).',
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
          label: 'If Yes, please explain (Disciplinary).',
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
          label: 'If Yes, please explain (License Revoked).',
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
          label: 'If Yes, please explain (Investigation).',
          required: false,
          showWhen: {
            field: 'underInvestigation',
            equals: 'Yes',
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Health Questions
    // ============================================================
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
          label: 'If Yes, please explain (Medical Condition).',
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
          label: 'If Yes, please explain (Substances).',
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
          label: 'If Yes, please explain (Substance Use Disorder).',
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

    // ============================================================
    // SECTION: Professional References
    // ============================================================
    {
      id: 'professional-references',
      title: 'Professional Reference',
      description: 'Please provide the following information for three professional references:\nFormat: Name, Title/Specialty, Phone, Email, and Known FromâTo (MM/YY)\n\nExample:\nDr. Jane Smith â Medical Director â (123) 456-7890 â jane.smith@email.com â 01/2020 to 07/2023',
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

    // ============================================================
    // SECTION: Physical Description
    // ============================================================
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

    // ============================================================
    // SECTION: MD or DO Section (only for MD/DO providers)
    // ============================================================
    {
      id: 'md-do-section',
      title: 'MD or DO Section',
      description: 'Additional information for physicians.',
      estimatedMinutes: 1,
      showWhen: {
        field: 'typeOfProvider',
        equals: ['MD', 'DO'],
      },
      questions: [
        {
          id: 'physicianConfirmation',
          type: 'dropdown',
          label: 'Please confirm you are a licensed physician (MD or DO)',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes, I confirm', value: 'Yes' },
          ],
        },
      ],
    },

    // ============================================================
    // SECTION: NP or RN Section (only for NP/RN providers)
    // ============================================================
    {
      id: 'np-rn-section',
      title: 'NP or RN Section',
      estimatedMinutes: 2,
      showWhen: {
        field: 'typeOfProvider',
        equals: ['NP', 'RN'],
      },
      questions: [
        {
          id: 'nursysLicenseUpload',
          type: 'file-upload',
          label: 'Nursys-Quick Confirm License Verification Report',
          description: 'Upload a recent Nursys-Quick Confirm-License-Verification-report pulled within the last 30 days. Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
        },
      ],
    },

    // ============================================================
    // SECTION: Sensitive Information
    // ============================================================
    {
      id: 'sensitive-info',
      title: 'Sensitive Information',
      description: 'This information is encrypted and securely stored. It will only be used for employment verification and tax purposes.',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'socialSecurityNumber',
          type: 'short-text',
          label: 'Social Security Number',
          description: 'Format: ###-##-####. Your SSN is encrypted and protected.',
          required: true,
          validationType: 'ssn',
        },
      ],
    },

    // ============================================================
    // SECTION: Clinical Signature
    // ============================================================
    {
      id: 'clinical-signature',
      title: 'Certification / Signature (Clinical Staff)',
      description: 'By submitting this form, I certify that the information provided above is accurate, complete, and truthful to the best of my knowledge.',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'printedNameClinical',
          type: 'short-text',
          label: 'Printed Name (Clinical)',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'dateClinical',
          type: 'date',
          label: 'Date (Clinical)',
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
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

// Helper function to check if a field should be visible based on conditional logic
export function isFieldVisible(
  config: FormConfig,
  fieldId: string,
  formData: Record<string, unknown>
): boolean {
  // Find the question and its section
  for (const section of config.sections) {
    // Check section-level visibility first
    if (section.showWhen) {
      if (!checkCondition(section.showWhen, formData)) {
        // If section is hidden, all its questions are hidden
        const questionInSection = section.questions.find(q => {
          if (q.type === 'multiple-choice-grid' || q.type === 'checkbox-grid') {
            const gridQuestion = q as { rows: { value: string }[] };
            return gridQuestion.rows.some(row => `${q.id}_${row.value}` === fieldId);
          }
          return q.id === fieldId;
        });
        if (questionInSection) {
          return false;
        }
      }
    }

    // Check question-level visibility
    for (const question of section.questions) {
      const isMatch = question.type === 'multiple-choice-grid' || question.type === 'checkbox-grid'
        ? (question as { rows: { value: string }[] }).rows.some(row => `${question.id}_${row.value}` === fieldId)
        : question.id === fieldId;

      if (isMatch) {
        if (question.showWhen) {
          return checkCondition(question.showWhen, formData);
        }
        return true; // No showWhen means always visible
      }
    }
  }

  // Field not found in config, assume visible (e.g., timestamp)
  return true;
}

// Helper to check a conditional logic condition
function checkCondition(
  condition: { field: string; equals?: string | string[]; notEmpty?: boolean },
  formData: Record<string, unknown>
): boolean {
  const { field, equals, notEmpty } = condition;
  const currentValue = formData[field];

  // Handle "notEmpty" condition
  if (notEmpty) {
    if (currentValue === undefined || currentValue === null || currentValue === '') {
      return false;
    }
    if (Array.isArray(currentValue)) {
      return currentValue.length > 0;
    }
    if (typeof currentValue === 'string') {
      return currentValue.trim().length > 0;
    }
    return true;
  }

  // Handle "equals" condition
  if (currentValue === undefined || currentValue === null) {
    return false;
  }

  if (Array.isArray(equals)) {
    return typeof currentValue === 'string' && equals.includes(currentValue);
  }

  return currentValue === equals;
}

// Helper function to escape special characters for spreadsheet/CSV compatibility
export function escapeForSpreadsheet(value: string): string {
  if (!value) return value;

  // Replace newlines with space (or could use \n literal)
  let escaped = value.replace(/\r?\n/g, ' ');

  // Escape double quotes by doubling them
  escaped = escaped.replace(/"/g, '""');

  return escaped;
}
import { FormConfig } from '@/types/form';

// Country code options reused across multiple phone fields
const countryCodeOptions = [
  { label: 'United States / Canada (+1)', value: '+1' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'Australia (+61)', value: '+61' },
  { label: 'Germany (+49)', value: '+49' },
  { label: 'France (+33)', value: '+33' },
  { label: 'India (+91)', value: '+91' },
  { label: 'China (+86)', value: '+86' },
  { label: 'Japan (+81)', value: '+81' },
  { label: 'Mexico (+52)', value: '+52' },
  { label: 'Brazil (+55)', value: '+55' },
  { label: 'Philippines (+63)', value: '+63' },
  { label: 'South Korea (+82)', value: '+82' },
  { label: 'Italy (+39)', value: '+39' },
  { label: 'Spain (+34)', value: '+34' },
  { label: 'Netherlands (+31)', value: '+31' },
  { label: 'Other', value: 'Other' },
];

// Full country list for Country of Birth (Item 9)
const countryOptions = [
  { label: 'United States', value: 'United States' },
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Dominican Republic', value: 'Dominican Republic' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Haiti', value: 'Haiti' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'Hong Kong', value: 'Hong Kong' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Jamaica', value: 'Jamaica' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Lebanon', value: 'Lebanon' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Panama', value: 'Panama' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Puerto Rico', value: 'Puerto Rico' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Taiwan', value: 'Taiwan' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Venezuela', value: 'Venezuela' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Other', value: 'Other' },
];

// US States list
const usStateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

// Race/Ethnicity options for multi-select checkbox (Item 3)
const raceEthnicityOptions = [
  { label: 'Hispanic or Latino', value: 'Hispanic or Latino' },
  { label: 'White (Not Hispanic or Latino)', value: 'White (Not Hispanic or Latino)' },
  { label: 'Black or African American (Not Hispanic or Latino)', value: 'Black or African American (Not Hispanic or Latino)' },
  { label: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)', value: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)' },
  { label: 'Asian (Not Hispanic or Latino)', value: 'Asian (Not Hispanic or Latino)' },
  { label: 'American Indian or Alaska Native (Not Hispanic or Latino)', value: 'American Indian or Alaska Native (Not Hispanic or Latino)' },
  { label: 'Two or More Races (Not Hispanic or Latino)', value: 'Two or More Races (Not Hispanic or Latino)' },
  { label: 'Prefer not to answer', value: 'Prefer not to answer' },
];

// Relationship options for emergency contacts
const relationshipOptions = [
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Child', value: 'Child' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Other Relative', value: 'Other Relative' },
  { label: 'Other', value: 'Other' },
];

export const newHireFormConfig: FormConfig = {
  title: 'Fountain Onboarding: New Hire Information',
  description: 'Demographic / Personal Information\nPlease fill out all required fields. This form is for all new hires',
  submitButtonText: 'Submit',
  successMessage: 'Thank you! Your information has been submitted successfully.',
  sections: [
    // ============================================================
    // SECTION 1A: Basic Personal Information
    // ============================================================
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Name, date of birth, and place of birth',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'firstName',
          type: 'short-text',
          label: 'First Name',
          required: true,
        },
        {
          id: 'middleName',
          type: 'short-text',
          label: 'Middle Name (optional)',
          required: false,
        },
        {
          id: 'lastName',
          type: 'short-text',
          label: 'Last Name',
          required: true,
        },
        {
          id: 'suffix',
          type: 'dropdown',
          label: 'Suffix (optional)',
          placeholder: 'Select if applicable',
          required: false,
          options: [
            { label: 'Jr.', value: 'Jr.' },
            { label: 'Sr.', value: 'Sr.' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ],
        },
        {
          id: 'preferredName',
          type: 'short-text',
          label: 'Preferred Name (optional)',
          description: 'What name do you go by day-to-day?',
          required: false,
        },
        {
          id: 'anyOtherNamesUsed',
          type: 'dropdown',
          label: 'Have you used any other names?',
          description: 'Including maiden names, aliases, or previous legal names',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'otherNamesUsedText',
          type: 'short-text',
          label: 'Other Names Used',
          description: 'List all other names you have used',
          required: true,
          showWhen: {
            field: 'anyOtherNamesUsed',
            equals: 'Yes',
          },
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'birthDate',
        },
        {
          id: 'countryOfBirth',
          type: 'dropdown',
          label: 'Country of Birth',
          placeholder: 'Select country',
          required: true,
          options: countryOptions,
        },
        {
          id: 'placeOfBirth',
          type: 'short-text',
          label: 'Place of Birth (City, State)',
          placeholder: 'e.g., Miami, FL',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'United States',
          },
        },
        {
          id: 'placeOfBirthInternational',
          type: 'short-text',
          label: 'Place of Birth (City)',
          placeholder: 'e.g., London',
          description: 'Enter the city where you were born',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'Other',
          },
        },
        {
          id: 'countryOfBirthOther',
          type: 'short-text',
          label: 'Country of Birth (specify)',
          placeholder: 'Enter your country of birth',
          required: true,
          showWhen: {
            field: 'countryOfBirth',
            equals: 'Other',
          },
        },
      ],
    },

    // ============================================================
    // SECTION 1B: Identity & Demographics
    // ============================================================
    {
      id: 'identity-demographics',
      title: 'Identity & Demographics',
      description: 'Gender, citizenship, and demographic information',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'gender',
          type: 'dropdown',
          label: 'Gender',
          placeholder: 'Select gender',
          required: true,
          options: [
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
            { label: 'Non-binary', value: 'Non-binary' },
            { label: 'Prefer not to disclose', value: 'Prefer not to disclose' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          id: 'pronouns',
          type: 'short-text',
          label: 'Pronouns (optional)',
          placeholder: 'e.g., she/her, he/him, they/them',
          required: false,
        },
        {
          id: 'citizenshipStatus',
          type: 'dropdown',
          label: 'Citizenship / Immigration Status',
          description: 'Required for I-9 employment verification',
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
          type: 'checkbox',
          label: 'Race / Ethnicity',
          description: 'Select all that apply. This information is collected for EEO compliance purposes.',
          required: true,
          options: raceEthnicityOptions,
        },
      ],
    },

    // ============================================================
    // SECTION 1C: Contact Information
    // ============================================================
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Address, phone, and email',
      estimatedMinutes: 2,
      questions: [
        {
          // Item 4: Street Address is required (already was, confirming)
          id: 'homeMailingAddress',
          type: 'short-text',
          label: 'Street Address',
          placeholder: 'Street address, P.O. box',
          required: true,
        },
        {
          id: 'addressLine2',
          type: 'short-text',
          label: 'Address Line 2',
          placeholder: 'Apartment, suite, unit, building, floor, etc.',
          required: false,
        },
        {
          id: 'city',
          type: 'short-text',
          label: 'City',
          required: true,
        },
        {
          id: 'addressCountry',
          type: 'dropdown',
          label: 'Country',
          placeholder: 'Select country',
          required: true,
          options: [
            { label: 'United States', value: 'United States' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          // Conditional: Show state dropdown for US addresses
          id: 'state',
          type: 'dropdown',
          label: 'State',
          placeholder: 'Select state',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'United States',
          },
          options: usStateOptions,
        },
        {
          // Conditional: Show free text for international addresses
          id: 'stateProvinceInternational',
          type: 'short-text',
          label: 'State / Province / Region',
          placeholder: 'Enter your state, province, or region',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'Other',
          },
        },
        {
          // Conditional: Show country name for international addresses
          id: 'countryName',
          type: 'short-text',
          label: 'Country Name',
          placeholder: 'Enter your country',
          required: true,
          showWhen: {
            field: 'addressCountry',
            equals: 'Other',
          },
        },
        {
          // Item 6: Added zipCode validation type for US ZIP format
          id: 'zipCode',
          type: 'short-text',
          label: 'Zip / Postal Code',
          placeholder: '12345 or 12345-6789',
          description: 'US format: 5 digits or ZIP+4',
          required: true,
          validationType: 'zipCode',
        },
        {
          id: 'preferredPhoneCountryCode',
          type: 'dropdown',
          label: 'Phone Country Code',
          placeholder: 'Select country code',
          required: true,
          options: countryCodeOptions,
        },
        {
          id: 'preferredPhoneCountryCodeOther',
          type: 'short-text',
          label: 'Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter your country code with + sign',
          required: true,
          showWhen: {
            field: 'preferredPhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          // Item 7: Phone input masking is handled in TextField component
          id: 'preferredPhoneNumber',
          type: 'short-text',
          label: 'Preferred Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
        },
        {
          id: 'personalEmailAddress',
          type: 'short-text',
          label: 'Personal Email Address',
          required: true,
          validationType: 'email',
        },
        {
          // Item 8: Added Confirm Email field
          id: 'confirmEmailAddress',
          type: 'short-text',
          label: 'Confirm Personal Email Address',
          description: 'Please re-enter your email address to confirm',
          required: true,
          validationType: 'confirmEmail',
        },
      ],
    },

    // ============================================================
    // SECTION 1D: Emergency Contacts
    // ============================================================
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      description: 'Who should we contact in case of emergency?',
      estimatedMinutes: 2,
      questions: [
        // Emergency Contact 1 (Required)
        {
          id: 'emergencyContact1Name',
          type: 'short-text',
          label: 'Emergency Contact 1 - Name',
          required: true,
        },
        {
          id: 'emergencyContact1Relationship',
          type: 'dropdown',
          label: 'Emergency Contact 1 - Relationship',
          placeholder: 'Select relationship',
          required: true,
          options: relationshipOptions,
        },
        {
          id: 'emergencyContact1PhoneCountryCode',
          type: 'dropdown',
          label: 'Emergency Contact 1 - Country Code',
          placeholder: 'Select country code',
          required: true,
          options: countryCodeOptions,
        },
        {
          id: 'emergencyContact1PhoneCountryCodeOther',
          type: 'short-text',
          label: 'Emergency Contact 1 - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: true,
          showWhen: {
            field: 'emergencyContact1PhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          id: 'emergencyContact1Phone',
          type: 'short-text',
          label: 'Emergency Contact 1 - Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
        },

        // Emergency Contact 2 (Optional)
        // Item 5: EC2 Name is always visible, but other EC2 fields are hidden until name is entered
        {
          id: 'emergencyContact2Name',
          type: 'short-text',
          label: 'Emergency Contact 2 - Name',
          description: 'Optional secondary contact',
          required: false,
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2Relationship',
          type: 'dropdown',
          label: 'Emergency Contact 2 - Relationship',
          placeholder: 'Select relationship',
          required: false,
          options: relationshipOptions,
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2PhoneCountryCode',
          type: 'dropdown',
          label: 'Emergency Contact 2 - Country Code',
          placeholder: 'Select country code',
          required: false,
          options: countryCodeOptions,
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
        {
          id: 'emergencyContact2PhoneCountryCodeOther',
          type: 'short-text',
          label: 'Emergency Contact 2 - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: false,
          showWhen: {
            field: 'emergencyContact2PhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          // Item 5: Hidden until EC2 Name has a value
          id: 'emergencyContact2Phone',
          type: 'short-text',
          label: 'Emergency Contact 2 - Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: false,
          validationType: 'phoneInternational',
          showWhen: {
            field: 'emergencyContact2Name',
            notEmpty: true,
          },
        },
      ],
    },

    // ============================================================
    // SECTION 1E: Document Uploads
    // ============================================================
    {
      id: 'document-uploads',
      title: 'Document Uploads',
      description: 'Upload required identification documents',
      estimatedMinutes: 2,
      questions: [
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

    // ============================================================
    // SECTION: Other Names Documentation (Item 2 - Conditional on anyOtherNamesUsed)
    // Only shown if user answered "Yes" to "Have you used any other names?"
    // ============================================================
    {
      id: 'other-names-section',
      title: 'Other Names Documentation',
      estimatedMinutes: 1,
      // Item 2: Section-level conditional - only show if user has other names
      showWhen: {
        field: 'anyOtherNamesUsed',
        equals: 'Yes',
      },
      questions: [
        {
          id: 'nameChangeDocuments',
          type: 'file-upload',
          label: 'Upload name change documents',
          description: 'Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
        },
      ],
    },

    // ============================================================
    // SECTION: Languages
    // ============================================================
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

    // ============================================================
    // SECTION: Clinical Staff Check
    // ============================================================
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

    // ============================================================
    // SECTION: Non-Clinical Signature
    // ============================================================
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
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'No',
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Licensing & Certifications (Clinical Staff Only)
    // ============================================================
    {
      id: 'licensing-info',
      title: 'Licensing & Certifications Information',
      description: 'For clinical staff (MD, DO, NP, RN) only.',
      estimatedMinutes: 8,
      showWhen: {
        field: 'isClinicalStaff',
        equals: 'Yes',
      },
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
          label: 'Active State License Details',
          description: 'List all active medical licenses. Enter each license on its own line using the format:\n[State] – [License Number] – Issued: MM/DD/YYYY – Exp: MM/DD/YYYY\n\nExample:\nCalifornia – A123456 – Issued: 02/01/2022 – Exp: 01/31/2028\nNew York – B987654 – Issued: 07/01/2023 – Exp: 06/30/2029',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'statesLicenseDetailsInactive',
          type: 'long-text',
          label: 'Inactive/Expired State License Details',
          description: 'List all inactive/expired medical licenses. Enter each license on its own line using the format:\n[State] – [License Number] – Issued: MM/DD/YYYY – Exp: MM/DD/YYYY\n\nExample:\nCalifornia – A123456 – Issued: 02/01/2020 – Exp: 01/31/2025\nNew York – B987654 – Issued: 07/01/2019 – Exp: 06/30/2025',
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
          description: 'Upload your National Practitioner Data Bank (NPDB) Self-Query Report. The report must be dated within the last 90 days. Accepted formats: PDF (max 10MB)\n\nPlease note the Licensing Team will be reaching out to gather login information to submit applications and renewals on your behalf. This will help them initiate and process applications efficiently.',
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

    // ============================================================
    // SECTION: Education & Training
    // ============================================================
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
          label: 'Internships, Residencies, and Fellowships',
          description: 'List all internships, residencies, and fellowships in chronological order. Enter each entry on its own line using the format:\nProgram Name – Role/Title – Start: MM/DD/YYYY – End: MM/DD/YYYY\n\nExample:\nJohns Hopkins Hospital – Internal Medicine Residency – Start: 07/01/2018 – End: 06/30/2021\nMayo Clinic – Cardiology Fellowship – Start: 07/01/2021 – End: 06/30/2024',
          required: true,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['MD', 'DO'],
          },
        },
        {
          id: 'facultyAppointments',
          type: 'long-text',
          label: 'Faculty Appointments',
          description: 'List all faculty appointments. Enter each appointment on its own line using the format:\nInstitution Name – Title/Position – Start: MM/DD/YYYY – End: MM/DD/YYYY\n\nExample:\nHarvard Medical School – Associate Professor – Start: 08/15/2019 – End: Present\nStanford University – Clinical Instructor – Start: 07/01/2016 – End: 07/31/2019',
          required: false,
          showWhen: {
            field: 'typeOfProvider',
            equals: ['MD', 'DO'],
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Work History
    // ============================================================
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
          id: 'contactPhoneCountryCode',
          type: 'dropdown',
          label: 'Contact Phone - Country Code',
          placeholder: 'Select country code',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
          options: countryCodeOptions,
        },
        {
          id: 'contactPhoneCountryCodeOther',
          type: 'short-text',
          label: 'Contact Phone - Other Country Code',
          placeholder: 'e.g., +353',
          description: 'Enter country code with + sign',
          required: true,
          showWhen: {
            field: 'contactPhoneCountryCode',
            equals: 'Other',
          },
        },
        {
          id: 'contactPhoneNumber',
          type: 'short-text',
          label: 'Contact Phone Number',
          description: 'Enter phone number without country code',
          placeholder: 'e.g., 555-123-4567',
          required: true,
          validationType: 'phoneInternational',
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

    // ============================================================
    // SECTION: Legal / Disciplinary History
    // ============================================================
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
          label: 'If Yes, please explain (Crime).',
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
          label: 'If Yes, please explain (Disciplinary).',
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
          label: 'If Yes, please explain (License Revoked).',
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
          label: 'If Yes, please explain (Investigation).',
          required: false,
          showWhen: {
            field: 'underInvestigation',
            equals: 'Yes',
          },
        },
      ],
    },

    // ============================================================
    // SECTION: Health Questions
    // ============================================================
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
          label: 'If Yes, please explain (Medical Condition).',
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
          label: 'If Yes, please explain (Substances).',
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
          label: 'If Yes, please explain (Substance Use Disorder).',
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

    // ============================================================
    // SECTION: Professional References
    // ============================================================
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

    // ============================================================
    // SECTION: Physical Description
    // ============================================================
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

    // ============================================================
    // SECTION: MD or DO Section (only for MD/DO providers)
    // ============================================================
    {
      id: 'md-do-section',
      title: 'MD or DO Section',
      description: 'Additional information for physicians.',
      estimatedMinutes: 1,
      showWhen: {
        field: 'typeOfProvider',
        equals: ['MD', 'DO'],
      },
      questions: [
        {
          id: 'physicianConfirmation',
          type: 'dropdown',
          label: 'Please confirm you are a licensed physician (MD or DO)',
          placeholder: 'Select an option',
          required: true,
          options: [
            { label: 'Yes, I confirm', value: 'Yes' },
          ],
        },
      ],
    },

    // ============================================================
    // SECTION: NP or RN Section (only for NP/RN providers)
    // ============================================================
    {
      id: 'np-rn-section',
      title: 'NP or RN Section',
      estimatedMinutes: 2,
      showWhen: {
        field: 'typeOfProvider',
        equals: ['NP', 'RN'],
      },
      questions: [
        {
          id: 'nursysLicenseUpload',
          type: 'file-upload',
          label: 'Nursys-Quick Confirm License Verification Report',
          description: 'Upload a recent Nursys-Quick Confirm-License-Verification-report pulled within the last 30 days. Accepted formats: PDF, JPG, PNG (max 10MB)',
          required: true,
          accept: ['.pdf', '.jpg', '.jpeg', '.png', 'image/*', 'application/pdf'],
          maxSize: 10,
        },
      ],
    },

    // ============================================================
    // SECTION: Sensitive Information
    // ============================================================
    {
      id: 'sensitive-info',
      title: 'Sensitive Information',
      description: 'This information is encrypted and securely stored. It will only be used for employment verification and tax purposes.',
      estimatedMinutes: 1,
      questions: [
        {
          id: 'socialSecurityNumber',
          type: 'short-text',
          label: 'Social Security Number',
          description: 'Format: ###-##-####. Your SSN is encrypted and protected.',
          required: true,
          validationType: 'ssn',
        },
      ],
    },

    // ============================================================
    // SECTION: Clinical Signature
    // ============================================================
    {
      id: 'clinical-signature',
      title: 'Certification / Signature (Clinical Staff)',
      description: 'By submitting this form, I certify that the information provided above is accurate, complete, and truthful to the best of my knowledge.',
      estimatedMinutes: 2,
      questions: [
        {
          id: 'printedNameClinical',
          type: 'short-text',
          label: 'Printed Name (Clinical)',
          required: true,
          showWhen: {
            field: 'isClinicalStaff',
            equals: 'Yes',
          },
        },
        {
          id: 'dateClinical',
          type: 'date',
          label: 'Date (Clinical)',
          description: 'Format: MM/DD/YYYY',
          placeholder: 'MM/DD/YYYY',
          required: true,
          validationType: 'signatureDate',
          showWhen: {
            field: 'isClinicalStaff',
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

// Helper function to check if a field should be visible based on conditional logic
export function isFieldVisible(
  config: FormConfig,
  fieldId: string,
  formData: Record<string, unknown>
): boolean {
  // Find the question and its section
  for (const section of config.sections) {
    // Check section-level visibility first
    if (section.showWhen) {
      if (!checkCondition(section.showWhen, formData)) {
        // If section is hidden, all its questions are hidden
        const questionInSection = section.questions.find(q => {
          if (q.type === 'multiple-choice-grid' || q.type === 'checkbox-grid') {
            const gridQuestion = q as { rows: { value: string }[] };
            return gridQuestion.rows.some(row => `${q.id}_${row.value}` === fieldId);
          }
          return q.id === fieldId;
        });
        if (questionInSection) {
          return false;
        }
      }
    }

    // Check question-level visibility
    for (const question of section.questions) {
      const isMatch = question.type === 'multiple-choice-grid' || question.type === 'checkbox-grid'
        ? (question as { rows: { value: string }[] }).rows.some(row => `${question.id}_${row.value}` === fieldId)
        : question.id === fieldId;

      if (isMatch) {
        if (question.showWhen) {
          return checkCondition(question.showWhen, formData);
        }
        return true; // No showWhen means always visible
      }
    }
  }

  // Field not found in config, assume visible (e.g., timestamp)
  return true;
}

// Helper to check a conditional logic condition
function checkCondition(
  condition: { field: string; equals?: string | string[]; notEmpty?: boolean },
  formData: Record<string, unknown>
): boolean {
  const { field, equals, notEmpty } = condition;
  const currentValue = formData[field];

  // Handle "notEmpty" condition
  if (notEmpty) {
    if (currentValue === undefined || currentValue === null || currentValue === '') {
      return false;
    }
    if (Array.isArray(currentValue)) {
      return currentValue.length > 0;
    }
    if (typeof currentValue === 'string') {
      return currentValue.trim().length > 0;
    }
    return true;
  }

  // Handle "equals" condition
  if (currentValue === undefined || currentValue === null) {
    return false;
  }

  if (Array.isArray(equals)) {
    return typeof currentValue === 'string' && equals.includes(currentValue);
  }

  return currentValue === equals;
}

// Helper function to escape special characters for spreadsheet/CSV compatibility
export function escapeForSpreadsheet(value: string): string {
  if (!value) return value;

  // Replace newlines with space (or could use \n literal)
  let escaped = value.replace(/\r?\n/g, ' ');

  // Escape double quotes by doubling them
  escaped = escaped.replace(/"/g, '""');

  return escaped;
}
