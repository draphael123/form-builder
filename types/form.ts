// Question Types
export type QuestionType =
  | 'short-text'
  | 'long-text'
  | 'multiple-choice'
  | 'checkbox'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'linear-scale'
  | 'multiple-choice-grid'
  | 'checkbox-grid'
  | 'file-upload';

// Validation types for fields
export type ValidationType = 'email' | 'ssn' | 'phone' | 'birthDate' | 'signatureDate' | 'pastDate';

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  required?: boolean;
  showWhen?: ConditionalLogic;
  tooltip?: string;
}

// Conditional logic for showing/hiding questions
export interface ConditionalLogic {
  field: string;
  equals: string | string[];
}

// Specific question types
export interface TextQuestion extends BaseQuestion {
  type: 'short-text' | 'long-text';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  validationType?: ValidationType;
}

export interface ChoiceOption {
  label: string;
  value: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: ChoiceOption[];
  allowOther?: boolean;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  options: ChoiceOption[];
  minSelected?: number;
  maxSelected?: number;
}

export interface DropdownQuestion extends BaseQuestion {
  type: 'dropdown';
  options: ChoiceOption[];
  placeholder?: string;
}

export interface DateQuestion extends BaseQuestion {
  type: 'date';
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  validationType?: 'birthDate' | 'signatureDate' | 'pastDate';
}

export interface TimeQuestion extends BaseQuestion {
  type: 'time';
}

export interface LinearScaleQuestion extends BaseQuestion {
  type: 'linear-scale';
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface GridOption {
  label: string;
  value: string;
}

export interface GridQuestion extends BaseQuestion {
  type: 'multiple-choice-grid' | 'checkbox-grid';
  rows: GridOption[];
  columns: GridOption[];
}

export interface FileUploadQuestion extends BaseQuestion {
  type: 'file-upload';
  accept?: string[];
  maxSize?: number; // in MB
}

// Union type for all questions
export type Question =
  | TextQuestion
  | MultipleChoiceQuestion
  | CheckboxQuestion
  | DropdownQuestion
  | DateQuestion
  | TimeQuestion
  | LinearScaleQuestion
  | GridQuestion
  | FileUploadQuestion;

// Form section
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  estimatedMinutes?: number; // Estimated time to complete this section in minutes
}

// Complete form configuration
export interface FormConfig {
  title: string;
  description?: string;
  sections: FormSection[];
  submitButtonText?: string;
  successMessage?: string;
}

// Form submission data
export interface FormSubmission {
  [key: string]: string | string[] | Record<string, string>;
}
