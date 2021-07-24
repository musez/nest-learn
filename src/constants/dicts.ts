// 状态类型
export enum StatusType {
  ENABLE = 1,// 启用或发布
  DISABLE = 0,// 禁用或未发布
  DRAFT = 2,
  RECYCLE = 3
}

// 删除类型
export enum DeleteType {
  DEFAULT = 0,// 未删除
  DEL = 1,// 删除
}

// 用户类型
export enum UserType {
  NORMAL = 0,
  ADMIN = 1,
  SUPER_ADMIN = 2,
}

// 性别类型
export enum SexType {
  DEFAULT = 0,
  FEMALE = 1,
  MALE = 2,
}

// 文章类型
export enum ArticleType {
  TEXT = 0,
  LINK = 1,
  PICTURE = 2,
  PICTURE_GROUP = 3,
  VIDEO = 4,
  AUDIO = 5,
}

// 文章允许评论
export enum IsCommentType {
  ENABLE = 1,
  DISABLE = 0,
}

// 字典类型
export enum DictType {
  TEXT = 0,
  NUM = 1,
}

// 字典状态类型
export enum DefaultType {
  NOT_DEFAULT,
  DEFAULT = 1,
}

// 周几类型
export enum WeekdayType {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// 上班类型
export enum RestType {
  DEFAULT = 0,
  UNREST = 1,
}

// 组织机构类型
export enum OrgType {
  ORG = 0,
  DEPT = 1,
}

// 权限类别
export enum PermissionType {
  NAVIGATION = 0,
  PAGE = 1,
  ACTION = 2,
  FIELD = 3,
}

// 权限路由 HIDDEN
export enum PermissionHiddenType {
  ENABLE = 1,
  DISABLE = 0,
}


