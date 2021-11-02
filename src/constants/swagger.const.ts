export const APIPrefix: string = '/api/v1';

export class BaseConstants {
  static readonly NAME_MAX_LENGTH: number = 50;

  static readonly DESCRIPTION_MAX_LENGTH: number = 255;
}

export class UserConstants {
  static readonly USERNAME_MIN_LENGTH: number = 4;
  static readonly USERNAME_MAX_LENGTH: number = 18;

  static readonly PASSWORD_MIN_LENGTH: number = 6;
  static readonly PASSWORD_MAX_LENGTH: number = 32;

  static readonly NAME_MIN_LENGTH: number = 2;
  static readonly NAME_MAX_LENGTH: number = 20;

  static readonly ADDRESS_MAX_LENGTH: number = 50;
}

export class OrgConstants {
  static readonly ORG_LEVEL_MAX_LENGTH: number = 100;
}

export class ArticleConstants {
  static readonly TITLE_MAX_LENGTH: number = 255;
  static readonly SUMMARY_MAX_LENGTH: number = 255;
  static readonly AUTHOR_MAX_LENGTH: number = 50;
  static readonly SOURCE_MAX_LENGTH: number = 50;
  static readonly KEYWORDS_MAX_LENGTH: number = 100;
}

export class ArticleCatConstants {
  static readonly CAT_NAME_MAX_LENGTH: number = 255;
}

export class DictItemConstants {
  static readonly ITEM_TEXT_MAX_LENGTH: number = 50;
  static readonly ITEM_VALUE_MAX_LENGTH: number = 50;
}
