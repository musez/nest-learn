export const APIPrefix: string = '/api/v1';

export class BaseConstants {
  static readonly NAME_MAX_LENGTH: number = 50;
  static readonly DESCRIPTION_MAX_LENGTH: number = 255;
}

export class UserConstants {
  static readonly USERNAME_MIN_LENGTH: number = 4;
  static readonly USERNAME_MAX_LENGTH: number = 18;
  static readonly PASSWORD_MIN_LENGTH: number = 6;
  static readonly PASSWORD_MAX_LENGTH: number = 18;
  static readonly NAME_MIN_LENGTH: number = 2;
  static readonly NAME_MAX_LENGTH: number = 20;
  static readonly ADDRESS_MAX_LENGTH: number = 50;
}
