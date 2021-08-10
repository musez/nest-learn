// 状态类型
export enum StatusType {
  DISABLE = 0,// 禁用或未发布
  ENABLE = 1,// 启用或发布
  DRAFT = 2,// 草稿
  RECYCLE = 3// 回收站
}

// 删除类型
export enum DeleteType {
  UN_DEL = 0,// 未删除
  DEL = 1,// 删除
}

// 用户类型
export enum UserType {
  NORMAL = 0,// 普通用户
  ADMIN = 1,// 管理员
  SUPER_ADMIN = 2,// 超级管理员
}

// 性别类型
export enum SexType {
  SECRET = 0,// 保密
  FEMALE = 1,// 女
  MALE = 2,// 男
}

// 文章类型
export enum ArticleType {
  TEXT = 0,// 文本
  LINK = 1,// 链接
  PICTURE = 2,// 图片
  PICTURE_GROUP = 3,// 组图
  VIDEO = 4,// 视频
  AUDIO = 5,// 音频
}

// 文章允许评论
export enum IsCommentType {
  DISABLE = 0,// 禁用
  ENABLE = 1,// 启用
}

// 评论类型
export enum TopicType {
  ARTICLE = 0,
}

// 评论回复类型
export enum ReplyType {
  COMMENT = 0,
  REPLY = 1,
}

// 字典类型
export enum DictType {
  TEXT = 0,// 字符串
  NUM = 1,// 数组
}

// 字典状态类型
export enum DefaultType {
  UN_DEFAULT = 0,// 非默认值
  DEFAULT = 1,// 默认值
}

// 周几类型
export enum WeekdayType {
  SUNDAY = 0,// 星期天
  MONDAY = 1,// 星期一
  TUESDAY = 2,// 星期二
  WEDNESDAY = 3,// 星期三
  THURSDAY = 4,// 星期四
  FRIDAY = 5,// 星期五
  SATURDAY = 6,// 星期六
}

// 上班类型
export enum RestType {
  WORK = 0,// 工作日
  REST_LAW = 1,// 法定节假日
  WORK_OVERTIME = 2,// 休息日加班
  REST = 3,// 休息日
}

// 组织机构类型
export enum OrgType {
  ORG = 0,// 机构
  DEPT = 1,// 部门
}

// 权限类别
export enum PermissionType {
  DIRECTORY = 1,// 目录
  PAGE = 2,// 菜单
  ACTION = 3,// 操作
  FIELD = 4,// 字段
  DATA = 5,// 数据
}

// 权限路由 HIDDEN
export enum PermissionHiddenType {
  SHOW = 0,// 显示
  HIDE = 1,// 隐藏
}

//地区级别
export enum AreaLevelType {
  PROVINCE = 1,// 省份
  CITY = 2,// 城市
  DISTRICT = 3,// 区/县
  STREET = 4,// 街道/办
}


