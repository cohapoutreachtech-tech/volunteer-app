import { LoginResponseDto } from '../dto/auth.dto';

export interface VolunteerDomain {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}

export interface LoginDomain {
  token: string;
  volunteer: VolunteerDomain;
}

export function mapLoginResponseDtoToDomain(dto: LoginResponseDto): LoginDomain {
  return {
    token: dto.token,
    volunteer: {
      id: dto.volunteer.id,
      email: dto.volunteer.Email__c,
      firstName: dto.volunteer.First_Name__c,
      lastName: dto.volunteer.Last_Name__c,
      status: dto.volunteer.Status__c,
    },
  };
}

