import { MockRegistrationsRepository } from './MockRegistrationsRepository';
import type { RegistrationsRepository } from './RegistrationsRepository';

export const registrationsRepository: RegistrationsRepository =
    new MockRegistrationsRepository();
