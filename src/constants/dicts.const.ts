// 状态类型
export const StatusDict = {
  '0': '禁用', // 禁用或未发布
  '1': '启用', // 启用或发布
  '2': '草稿', // 草稿
  '3': '回收站', // 回收站
};

// 删除类型
export const DeleteDict = {
  '0': '未删除', // 未删除
  '1': '删除', // 删除
};

// 用户类型
export const UserDict = {
  '0': '普通用户',
  '1': '管理员',
  '2': '超级管理员',
};

// 性别类型
export const SexDict = {
  '0': '保密',
  '1': '女',
  '2': '男',
};

// 文章类型
export const ArticleDict = {
  '0': '文本',
  '1': '链接',
  '2': '图片',
  '3': '组图',
  '4': '视频',
  '5': '音频',
};

// 文章允许评论
export const IsCommentDict = {
  '0': '禁用',
  '1': '启用',
};

// 评论类型
export const TopicTypeDict = {
  '0': '新闻',
};

// 评论回复类型
export const ReplyTypeDict = {
  '0': '评论',
  '1': '回复',
};

// 评论是否回复类型
export const IsReplyDict = {
  '0': '未回复',
  '1': '已回复'
}

// 字典类型
export const DictDict = {
  '0': '字符串',
  '1': '数组',
};

// 字典状态类型
export const DefaultDict = {
  '0': '非默认值',
  '1': '默认值',
};

// 周几类型
export const WeekdayDict = {
  '0': '星期天',
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
};

// 上班类型
export const RestDict = {
  '0': '工作日',
  '1': '法定节假日',
  '2': '休息日加班',
  '3': '休息日',
};

// 组织机构类型
export const OrgDict = {
  '0': '机构',
  '1': '部门',
};

// 权限类别
export const PermissionDict = {
  '1': '目录',
  '2': '菜单',
  '3': '操作',
  '4': '字段',
  '5': '数据',
};

// 权限路由 HIDDEN
export const PermissionHiddenDict = {
  '0': '显示',
  '1': '隐藏',
};

//地区级别
export const AreaLevelDict = {
  '1': '省份',
  '2': '城市',
  '3': '区/县',
  '4': '街道/办',
};
