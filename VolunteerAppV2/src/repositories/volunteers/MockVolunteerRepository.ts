// src/repositories/volunteers/MockVolunteerRepository.ts

import type { Volunteer } from '../../models/Volunteer';
import type { VolunteerRepository } from './VolunteerRepository';

/**
 * Temporary mock repository backed by the latest JSON contract from backend engineers.
 * Key rules:
 * - Treat `_id` as opaque primary key (domain `id`)
 * - Keep `name` as `displayId` (e.g., "VOL-0001")
 * - Drop sensitive/internal fields (Pass_Hash, __v, createdAt, updatedAt)
 * - Normalize "Yes"/"No" style fields where applicable
 */
// model used for fetch
  // differs from domain model
type VolunteerDto = {
  _id: string;
  name?: string;

  First_Name__c?: string;
  Last_Name__c?: string;
  Email__c?: string;
  Phone__c?: string;

  Date_of_Birth__c?: string;

  Volunteer_Type__c?: string;
  Status__c?: string;

  Text_Opt_In__c?: boolean;
  T_Shirt_Size__c?: string;
  Why_Volunteer__c?: string;

  Community_Service_Hours__c?: string; // "Yes" / "No" (per backend sample)
  Offender_Policy_Confirmed__c?: boolean;

  Electronic_Signature__c?: string;
  Signature_Date__c?: string;
  Registration_Date__c?: string;

  Total_Hours_Worked__c?: number;

  // internal fields we intentionally ignore:
  Pass_Hash?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
};

const MOCK_VOLUNTEERS_DTO: VolunteerDto[] = [
  {
    _id: '694f15697fa85a691e4c75a4',
    name: 'VOL-0001',
    First_Name__c: 'Jane',
    Last_Name__c: 'Jones',
    Email__c: 'janejones@gmail.com',
    Phone__c: '260-555-0001',
    Date_of_Birth__c: '1980-01-01T00:00:00.000Z',
    Volunteer_Type__c: 'Individual',
    Text_Opt_In__c: false,
    T_Shirt_Size__c: 'L',
    Why_Volunteer__c: 'Serve Community.',
    Community_Service_Hours__c: 'Yes',
    Offender_Policy_Confirmed__c: true,
    Electronic_Signature__c: 'Jane Jones',
    Signature_Date__c: '2025-12-26T23:08:23.560Z',
    Registration_Date__c: '2025-12-26T23:08:23.560Z',
    Status__c: 'Active',
    Total_Hours_Worked__c: 43,
  },
  {
    _id: '694f15697fa85a691e4c75a5',
    name: 'VOL-0002',
    First_Name__c: 'Emily',
    Last_Name__c: 'White',
    Email__c: 'volunteer@cohap.org',
    Phone__c: '260-555-0002',
    Date_of_Birth__c: '2000-05-15T00:00:00.000Z',
    Volunteer_Type__c: 'Individual',
    Text_Opt_In__c: false,
    T_Shirt_Size__c: 'M',
    Why_Volunteer__c: 'I want to help.',
    Community_Service_Hours__c: 'Yes',
    Offender_Policy_Confirmed__c: true,
    Electronic_Signature__c: 'Emily White',
    Signature_Date__c: '2025-12-26T23:08:23.611Z',
    Registration_Date__c: '2025-12-26T23:08:23.611Z',
    Status__c: 'Active',
    Total_Hours_Worked__c: 0,
  },
  {
    _id: '69505845d31902663ae4ad22',
    name: 'VOL-0003',
    First_Name__c: 'Kevin',
    Last_Name__c: 'Jackson',
    Email__c: 'john@example2.com',
    Phone__c: '260-555-1234',
    Date_of_Birth__c: '2000-05-15T00:00:00.000Z',
    Volunteer_Type__c: 'Individual',
    Text_Opt_In__c: false,
    T_Shirt_Size__c: 'L',
    Why_Volunteer__c: 'I want to help.',
    Community_Service_Hours__c: 'Yes',
    Offender_Policy_Confirmed__c: true,
    Electronic_Signature__c: 'Kevin Jackson',
    Signature_Date__c: '2024-03-01T00:00:00.000Z',
    Registration_Date__c: '2024-03-01T10:00:00.000Z',
    Status__c: 'Active',
    Total_Hours_Worked__c: 0,
  },
];
//parses yes/no to boolean
function yesNoToBool(value: string | undefined): boolean | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'yes') return true;
  if (v === 'no') return false;
  return undefined;
}
// normalizes from DTO to domain model
function toVolunteer(dto: VolunteerDto): Volunteer {
  return {
    id: dto._id,
    displayId: dto.name,

    firstName: dto.First_Name__c ?? '',
    lastName: dto.Last_Name__c ?? '',

    email: dto.Email__c ?? '',
    phone: dto.Phone__c,

    dateOfBirth: dto.Date_of_Birth__c,

    volunteerType: dto.Volunteer_Type__c,
    status: dto.Status__c,

    textOptIn: dto.Text_Opt_In__c,

    tShirtSize: dto.T_Shirt_Size__c,
    whyVolunteer: dto.Why_Volunteer__c,

    needsCommunityServiceHours: yesNoToBool(dto.Community_Service_Hours__c),

    offenderPolicyConfirmed: dto.Offender_Policy_Confirmed__c,

    signatureName: dto.Electronic_Signature__c,
    signatureDate: dto.Signature_Date__c,
    registrationDate: dto.Registration_Date__c,

    totalHoursWorked: dto.Total_Hours_Worked__c,
  };
}

export class MockVolunteerRepository implements VolunteerRepository {
  async getVolunteers(): Promise<Volunteer[]> {
    return Promise.resolve(MOCK_VOLUNTEERS_DTO.map(toVolunteer));
  }
//write the fetch here
  async getVolunteerById(id: string): Promise<Volunteer | null> {
    const dto = MOCK_VOLUNTEERS_DTO.find((v) => v._id === id) ?? null;
    return Promise.resolve(dto ? toVolunteer(dto) : null);
  }
}
export async function login(): Promise<any | null> {
  const response = await fetch('http://10.0.0.85:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ email: '', password: '' }),
  });
  return response.json();
}
