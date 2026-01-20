// src/domain/Volunteer.ts

export type VolunteerStatus = 'Active' | 'Inactive' | 'Pending' | string;

export type VolunteerType = 'Individual' | 'Group' | 'Corporate' | string;

export type Volunteer = {
  id: string;

  displayId?: string;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string;

  dateOfBirth?: string;

  volunteerType?: VolunteerType;
  status?: VolunteerStatus;

  textOptIn?: boolean;

  tShirtSize?: string;

  whyVolunteer?: string;

  needsCommunityServiceHours?: boolean;

  offenderPolicyConfirmed?: boolean;

  signatureName?: string;
  signatureDate?: string;

  registrationDate?: string;

  totalHoursWorked?: number;
};
