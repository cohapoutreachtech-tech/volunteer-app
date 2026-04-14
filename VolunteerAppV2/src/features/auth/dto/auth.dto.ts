// DTO for login request and response
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  volunteer: {
    id: string;
    Email__c: string;
    First_Name__c: string;
    Last_Name__c: string;
    Status__c: string;
  };
}

