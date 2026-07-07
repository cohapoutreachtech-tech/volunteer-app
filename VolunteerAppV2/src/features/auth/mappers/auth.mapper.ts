import { LoginResponseDto, VolunteerDto } from '../dto/auth.dto';

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

export function mapVolunteerDtoToDomain(dto: VolunteerDto): VolunteerDomain {
  return {
    id: dto.id,
    email: dto.Email__c,
    firstName: dto.First_Name__c,
    lastName: dto.Last_Name__c,
    status: dto.Status__c,
  };
}

export function mapLoginResponseDtoToDomain(dto: LoginResponseDto): LoginDomain {
  return {
    token: dto.token,
    volunteer: mapVolunteerDtoToDomain(dto.volunteer),
  };
}

