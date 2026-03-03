import { FormConfig } from '@/types/form';

export const newHireFormConfig: FormConfig = {
  title: 'New Hire Information Form',
  description: 'Please complete this form with your information. All fields marked with * are required.',
  submitButtonText: 'Submit',
  successMessage: 'Thank you! Your information has been submitted successfully.',
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Please provide your basic personal details.',
      questions: [
        {
          id: 'firstName',
          type: 'short-text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
        },
        {
          id: 'middleName',
          type: 'short-text',
          label: 'Middle Name',
          placeholder: 'Enter your middle name (if applicable)',
          required: false,
        },
        {
          id: 'lastName',
          type: 'short-text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
        },
        {
          id: 'preferredName',
          type: 'short-text',
          label: 'Preferred Name',
          description: 'What would you like to be called?',
          placeholder: 'Enter your preferred name',
          required: false,
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          required: true,
        },
        {
          id: 'gender',
          type: 'dropdown',
          label: 'Gender',
          required: false,
          placeholder: 'Select your gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'non-binary' },
            { label: 'Prefer not to say', value: 'prefer-not-to-say' },
          ],
        },
      ],
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How can we reach you?',
      questions: [
        {
          id: 'email',
          type: 'short-text',
          label: 'Personal Email Address',
          placeholder: 'example@email.com',
          required: true,
        },
        {
          id: 'phone',
          type: 'short-text',
          label: 'Phone Number',
          placeholder: '(555) 123-4567',
          required: true,
        },
        {
          id: 'streetAddress',
          type: 'short-text',
          label: 'Street Address',
          placeholder: '123 Main Street',
          required: true,
        },
        {
          id: 'apartmentUnit',
          type: 'short-text',
          label: 'Apartment/Unit Number',
          placeholder: 'Apt 4B',
          required: false,
        },
        {
          id: 'city',
          type: 'short-text',
          label: 'City',
          placeholder: 'City name',
          required: true,
        },
        {
          id: 'state',
          type: 'dropdown',
          label: 'State',
          required: true,
          placeholder: 'Select your state',
          options: [
            { label: 'Alabama', value: 'AL' },
            { label: 'Alaska', value: 'AK' },
            { label: 'Arizona', value: 'AZ' },
            { label: 'Arkansas', value: 'AR' },
            { label: 'California', value: 'CA' },
            { label: 'Colorado', value: 'CO' },
            { label: 'Connecticut', value: 'CT' },
            { label: 'Delaware', value: 'DE' },
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
          ],
        },
        {
          id: 'zipCode',
          type: 'short-text',
          label: 'ZIP Code',
          placeholder: '12345',
          required: true,
        },
      ],
    },
    {
      id: 'emergency-contact',
      title: 'Emergency Contact',
      description: 'Please provide emergency contact information.',
      questions: [
        {
          id: 'emergencyContactName',
          type: 'short-text',
          label: 'Emergency Contact Name',
          placeholder: 'Full name',
          required: true,
        },
        {
          id: 'emergencyContactRelationship',
          type: 'dropdown',
          label: 'Relationship',
          required: true,
          placeholder: 'Select relationship',
          options: [
            { label: 'Spouse', value: 'spouse' },
            { label: 'Parent', value: 'parent' },
            { label: 'Sibling', value: 'sibling' },
            { label: 'Child', value: 'child' },
            { label: 'Friend', value: 'friend' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          id: 'emergencyContactPhone',
          type: 'short-text',
          label: 'Emergency Contact Phone',
          placeholder: '(555) 123-4567',
          required: true,
        },
        {
          id: 'emergencyContactEmail',
          type: 'short-text',
          label: 'Emergency Contact Email',
          placeholder: 'email@example.com',
          required: false,
        },
      ],
    },
    {
      id: 'employment-info',
      title: 'Employment Information',
      description: 'Details about your position.',
      questions: [
        {
          id: 'startDate',
          type: 'date',
          label: 'Expected Start Date',
          required: true,
        },
        {
          id: 'department',
          type: 'dropdown',
          label: 'Department',
          required: true,
          placeholder: 'Select your department',
          options: [
            { label: 'Administration', value: 'administration' },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Finance', value: 'finance' },
            { label: 'Human Resources', value: 'hr' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Operations', value: 'operations' },
            { label: 'Sales', value: 'sales' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          id: 'jobTitle',
          type: 'short-text',
          label: 'Job Title',
          placeholder: 'Your position title',
          required: true,
        },
        {
          id: 'employmentType',
          type: 'multiple-choice',
          label: 'Employment Type',
          required: true,
          options: [
            { label: 'Full-time', value: 'full-time' },
            { label: 'Part-time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Temporary', value: 'temporary' },
          ],
        },
        {
          id: 'workLocation',
          type: 'multiple-choice',
          label: 'Work Location Preference',
          required: true,
          options: [
            { label: 'On-site', value: 'onsite' },
            { label: 'Remote', value: 'remote' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
        },
      ],
    },
    {
      id: 'additional-info',
      title: 'Additional Information',
      questions: [
        {
          id: 'shirtSize',
          type: 'dropdown',
          label: 'T-Shirt Size (for company swag)',
          required: false,
          placeholder: 'Select your size',
          options: [
            { label: 'XS', value: 'xs' },
            { label: 'S', value: 's' },
            { label: 'M', value: 'm' },
            { label: 'L', value: 'l' },
            { label: 'XL', value: 'xl' },
            { label: '2XL', value: '2xl' },
            { label: '3XL', value: '3xl' },
          ],
        },
        {
          id: 'dietaryRestrictions',
          type: 'checkbox',
          label: 'Dietary Restrictions (select all that apply)',
          required: false,
          options: [
            { label: 'None', value: 'none' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-free', value: 'gluten-free' },
            { label: 'Dairy-free', value: 'dairy-free' },
            { label: 'Nut allergy', value: 'nut-allergy' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          id: 'howDidYouHear',
          type: 'multiple-choice',
          label: 'How did you hear about this position?',
          required: false,
          allowOther: true,
          options: [
            { label: 'Job Board (Indeed, LinkedIn, etc.)', value: 'job-board' },
            { label: 'Company Website', value: 'company-website' },
            { label: 'Employee Referral', value: 'referral' },
            { label: 'Social Media', value: 'social-media' },
            { label: 'Career Fair', value: 'career-fair' },
          ],
        },
        {
          id: 'additionalComments',
          type: 'long-text',
          label: 'Additional Comments or Information',
          description: 'Is there anything else you would like us to know?',
          placeholder: 'Enter any additional information here...',
          required: false,
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
