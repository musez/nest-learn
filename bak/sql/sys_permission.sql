/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : cms_nest

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 19/08/2021 19:28:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '状态（0：禁用；1：启用）',
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '描述',
  `createTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT 0 COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '删除人 id',
  `parentId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '父 id',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `type` tinyint(4) NOT NULL COMMENT '权限类别（1：目录；2：菜单；3：操作；4：字段；5：数据）',
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '权限 CODE 代码',
  `sort` int(11) NULL DEFAULT 0 COMMENT '权限 SORT',
  `routerComponent` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '权限路由 COMPONENT',
  `routerHidden` tinyint(4) NULL DEFAULT NULL COMMENT '权限路由 HIDDEN（0：显示；1：隐藏；）',
  `routerIcon` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '权限路由 ICON',
  `routerPath` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '权限路由 PATH',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES ('0364b319-a138-4b7e-93f8-deadf7d0963c', 1, '', '2021-08-18 22:31:29.721538', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:50:18.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '收获地址添加/编辑', 2, NULL, 10701, 'account/user-address/user-address-edit', 1, NULL, 'user-address-edit');
INSERT INTO `sys_permission` VALUES ('06953b13-d8d0-493e-a630-792ddcacfef5', 1, '', '2021-08-07 01:02:58.601088', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:34:40.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '岗位列表', 2, NULL, 10600, 'account/post/post-list', 0, 'post', 'post-list');
INSERT INTO `sys_permission` VALUES ('0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb', 1, '', '2021-08-07 01:08:08.304193', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:08:08.304193', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '删除', 3, 'account:user:delete', 10103, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('10417cf5-f095-4abd-a9f0-5e8e8bcafb3c', 1, NULL, '2021-08-07 11:38:44.862212', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.862212', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '添加', 3, 'cms:article:add', 20101, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('10ba71b0-69ba-402c-b19b-6d2ec4c8018a', 1, NULL, '2021-08-07 11:04:59.406351', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:59.406351', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '批量删除', 3, 'account:group:deleteBatch', 10204, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('10dd853b-9272-4cd6-93bc-4a03bab7a18f', 1, '', '2021-08-07 01:02:34.057082', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:12:40.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '权限列表', 2, NULL, 10900, 'account/permission/permission-list', 0, 'permission', 'permission-list');
INSERT INTO `sys_permission` VALUES ('1339af5e-f1fe-409c-9e73-5327fea90e4f', 1, '', '2021-08-18 22:49:34.151993', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:53:33.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '节假日添加/编辑', 2, NULL, 30301, 'system/holiday/holiday-edit', 1, NULL, 'holiday-edit');
INSERT INTO `sys_permission` VALUES ('19ea905e-99f5-425a-83ec-a7b08a3edfca', 1, '', '2021-08-18 22:27:55.378422', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:52:06.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '文章添加/编辑', 2, NULL, 20101, 'cms/article/article-edit', 1, NULL, 'article-edit');
INSERT INTO `sys_permission` VALUES ('1dee7029-7781-4016-8a0e-a55f014f8086', 1, NULL, '2021-08-18 20:45:01.397138', NULL, '2021-08-18 23:01:59.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '字典列表', 2, NULL, 30100, 'system/dict/dict-list', 0, 'dict', 'dict-list');
INSERT INTO `sys_permission` VALUES ('250b7a06-2dbb-4c76-b483-1bd3542f1b99', 1, NULL, '2021-08-07 11:32:42.196404', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.196404', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '编辑', 3, 'account:permission:edit', 10402, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('2531bbd4-f502-4818-af8c-d545e225547d', 1, NULL, '2021-08-07 11:38:44.769408', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.769408', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '批量删除', 3, 'account:post:deleteBatch', 10604, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('25eef5c4-55de-4487-9812-28e76d238e7b', 1, NULL, '2021-08-07 11:51:37.924803', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.924803', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '分配权限', 3, 'account:role:bindPermissions', 10306, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('2b552e47-8a30-4ecc-a183-797e85db8ef5', 1, '', '2021-08-07 01:09:14.291728', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:14.291728', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '导出 EXCEL', 3, 'account:user:exportExcel', 10105, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('306e4a38-9e71-4e77-b66d-4aab6a0d94e5', 1, NULL, '2021-08-07 11:07:10.260672', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:10.260672', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '添加', 3, 'account:role:add', 10301, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('31292492-7a02-446c-b509-6ad4884beb0', 1, NULL, '2021-08-07 11:04:05.739022', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:05.739022', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '编辑', 3, 'account:group:edit', 10202, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('35e3ca31-3803-4652-b1bd-1074df0e8136', 1, NULL, '2021-08-18 20:45:01.815797', NULL, '2021-08-18 20:45:01.815797', NULL, 0, NULL, NULL, '864b38b3-518f-4455-a1b2-e774418fd193', '添加', 3, 'system:holiday:add', 30301, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('3abf143e-9da9-4750-9c4f-d01cc02ac4f5', 1, '', '2021-08-07 01:01:28.916468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:06:53.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户组列表', 2, NULL, 10500, 'account/group/group-list', 0, 'group', 'group-list');
INSERT INTO `sys_permission` VALUES ('3dfaeace-3a67-4106-b2d2-a33f630c8ca1', 1, NULL, '2021-08-18 20:45:01.956327', NULL, '2021-08-18 22:58:44.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, NULL, '系统工具', 1, '', 40000, 'Layout', 0, 'skill', '/tools');
INSERT INTO `sys_permission` VALUES ('40eb06b2-fc51-45c0-a028-97c628e1c5f1', 1, NULL, '2021-08-18 20:45:01.622684', NULL, '2021-08-18 23:02:20.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '地区列表', 2, NULL, 30200, 'system/area/area-list', 0, 'area', 'area-list');
INSERT INTO `sys_permission` VALUES ('4313ded5-ee99-49cb-88fd-44b70dc0bef1', 1, '', '2021-08-07 01:09:53.809433', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:53.809433', NULL, 0, NULL, NULL, NULL, '广告管理', 1, NULL, 20000, 'Layout', 0, 'ads', '/article');
INSERT INTO `sys_permission` VALUES ('4365dca5-ba7b-4233-92d7-f31fdb01aaa8', 1, NULL, '2021-08-07 11:07:27.112174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:27.112174', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '编辑', 3, 'account:role:edit', 10302, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('4379e01f-ccd0-4f11-b410-bb2636b767cc', 1, NULL, '2021-08-07 11:07:54.374588', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:54.374588', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '删除', 3, 'account:role:delete', 10303, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('45365966-61af-4e2a-8f32-740ccc36d20f', 1, NULL, '2021-08-18 20:45:01.586776', NULL, '2021-08-18 20:45:01.586776', NULL, 0, NULL, NULL, '1dee7029-7781-4016-8a0e-a55f014f8086', '导出', 3, 'system:dict:exportExcel', 30105, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('47fa4926-a808-44ce-a321-206887d08298', 1, '', '2021-08-19 09:12:00.248169', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:12:00.248169', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '角色添加/编辑', 2, NULL, 10700, 'account/role/role-edit', 1, NULL, 'role-edit');
INSERT INTO `sys_permission` VALUES ('484a14c2-82f9-4818-afd9-959ddccc5a96', 1, NULL, '2021-08-07 11:05:13.683272', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:05:13.683272', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '导出 EXCEL', 3, 'account:group:exportExcel', 10205, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('4d4a312c-7046-4872-9efb-18af351296d5', 1, NULL, '2021-08-07 11:38:44.969581', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.969581', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '删除', 3, 'cms:article:delete', 20103, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('547eba13-1039-4cc6-9719-6fb79d304a4c', 1, NULL, '2021-08-07 11:32:42.282497', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.282497', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '编辑', 3, 'account:org:edit', 10502, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('5d40f3ed-67f4-4147-9da6-3637a52324e1', 1, NULL, '2021-08-07 11:32:42.177006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.177006', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '添加', 3, 'account:permission:add', 10401, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('63343802-c2a5-4cdf-a0ee-0a620c5c5926', 1, NULL, '2021-08-07 11:38:44.827421', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.827421', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '导出 EXCEL', 3, 'account:post:exportExcel', 10605, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('633440f8-488f-4788-967c-1990c1091973', 1, '', '2021-08-18 22:27:13.409574', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 00:16:39.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '回收站', 2, NULL, 20300, 'cms/article/article-recycle', 0, 'recycle', 'article-recycle');
INSERT INTO `sys_permission` VALUES ('636423f6-0657-412a-951a-80caa3930f21', 1, NULL, '2021-08-07 11:42:45.122572', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.122572', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '导出 EXCEL', 3, 'cms:articleCat:exportExcel', 20405, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('65688bf5-4de8-44c6-81ca-25038a5e7044', 1, '', '2021-08-18 22:19:35.103345', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:06:04.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户分配角色', 2, NULL, 10400, 'account/user/user-role', 1, NULL, 'user-role');
INSERT INTO `sys_permission` VALUES ('66a7e4f0-46ad-4642-b348-0c85ee5860af', 1, NULL, '2021-08-07 11:38:44.558244', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.558244', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '添加', 3, 'account:post:add', 10601, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('676cec2a-d9ff-4961-9213-499369b1c902', 1, NULL, '2021-08-07 11:42:44.799968', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.799968', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '添加', 3, 'cms:articleCat:add', 20401, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('67f7c348-8bdb-486e-8585-e579e90b43c3', 1, NULL, '2021-08-07 11:42:45.047540', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.047540', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '批量删除', 3, 'cms:articleCat:deleteBatch', 20404, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('6a5aee9a-2739-429f-83db-ebd2ec656205', 1, NULL, '2021-08-07 11:08:11.156613', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:11.156613', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '批量删除', 3, 'account:role:deleteBatch', 10304, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('6d304bad-996b-40d5-a43a-7bab9ead2744', 1, '', '2021-08-07 01:10:25.568965', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:06:07.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '广告列表', 2, NULL, 20100, 'cms/article/article-list', 0, 'lanmu', 'article-list');
INSERT INTO `sys_permission` VALUES ('710fbbc8-8e54-450d-b81c-624f1ec07c1a', 1, '', '2021-08-18 22:25:23.964268', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:49:57.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '岗位添加/编辑', 2, NULL, 10601, 'account/post/post-edit', 1, NULL, 'post-edit');
INSERT INTO `sys_permission` VALUES ('736b3334-8d0a-4c17-bd85-daa429a19a37', 1, NULL, '2021-08-18 20:45:02.027323', NULL, '2021-08-18 23:01:12.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '3dfaeace-3a67-4106-b2d2-a33f630c8ca1', '图标管理', 2, NULL, 40003, 'tools/icons/index', 0, 'tubiaoguanli', 'icons');
INSERT INTO `sys_permission` VALUES ('76726c38-e251-4573-9648-050efee195d5', 1, NULL, '2021-08-18 20:45:01.266715', NULL, '2021-08-18 23:05:02.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, NULL, '系统管理', 1, NULL, 30000, 'Layout', 0, 'component', '/system');
INSERT INTO `sys_permission` VALUES ('78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', 1, '', '2021-08-07 01:02:19.758726', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:10:53.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '角色列表', 2, NULL, 10600, 'account/role/role-list', 0, 'role', 'role-list');
INSERT INTO `sys_permission` VALUES ('7925d314-0758-4ff0-9096-409cbab1966a', 1, '', '2021-08-19 09:20:04.194867', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:20:04.194867', NULL, 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '广告评论管理', 2, NULL, 0, 'cms/article/article-topic', 1, NULL, 'article-topic');
INSERT INTO `sys_permission` VALUES ('7d6a6b43-fd8f-4cc4-8265-0c7519189a36', 1, '', '2021-08-19 09:22:13.515030', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:22:13.515030', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '查看评论', 3, 'cms:article:findCommentPageById', 0, NULL, 0, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('8147557c-45ea-4740-8f48-3cd5fcb68f3d', 1, NULL, '2021-08-18 20:45:01.505199', NULL, '2021-08-18 20:45:01.505199', NULL, 0, NULL, NULL, '1dee7029-7781-4016-8a0e-a55f014f8086', '删除', 3, 'system:dict:delete', 30103, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('82d16d1f-63fa-4e1b-b872-9514a90607e6', 1, NULL, '2021-08-18 20:45:01.432813', NULL, '2021-08-18 20:45:01.432813', NULL, 0, NULL, NULL, '1dee7029-7781-4016-8a0e-a55f014f8086', '添加', 3, 'system:dict:add', 30101, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('843528e7-3a86-4b12-b433-f93bcccbc7e7', 1, NULL, '2021-08-07 11:32:42.246868', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.246868', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '导出 EXCEL', 3, 'account:permission:exportExcel', 10405, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('862d3a38-afac-4f7d-ab26-07ab7a258feb', 1, NULL, '2021-08-07 11:32:42.232150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.232150', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '批量删除', 3, 'account:permission:deleteBatch', 10404, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('864b38b3-518f-4455-a1b2-e774418fd193', 1, NULL, '2021-08-18 20:45:01.718601', NULL, '2021-08-18 23:02:41.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '节假日管理', 2, NULL, 30300, 'system/holiday/holiday-list', 0, 'holiday', 'holiday-list');
INSERT INTO `sys_permission` VALUES ('866c1f11-4203-4475-951f-84a55b60c6b9', 1, '', '2021-08-18 22:26:18.498423', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 00:16:25.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '草稿箱', 2, NULL, 20200, 'cms/article/article-draft', 0, 'draft', 'article-draft');
INSERT INTO `sys_permission` VALUES ('887460aa-df2c-47e3-bb13-116aec0fcd25', 1, NULL, '2021-08-07 11:32:42.216184', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.216184', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '删除', 3, 'account:permission:delete', 10403, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('8d8814dc-e3ce-426c-8188-67c2dba77f72', 1, NULL, '2021-08-07 11:08:30.792743', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:30.792743', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '导出 EXCEL', 3, 'account:role:exportExcel', 10305, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('9101147b-8975-44ee-9dd4-77a75e5f7f13', 1, NULL, '2021-08-18 20:45:01.551260', NULL, '2021-08-18 20:45:01.551260', NULL, 0, NULL, NULL, '1dee7029-7781-4016-8a0e-a55f014f8086', '批量删除', 3, 'system:dict:deleteBatch', 30104, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('94c243a8-3cad-4382-bbb0-a0958f462e06', 1, NULL, '2021-08-18 20:45:02.051274', NULL, '2021-08-19 09:34:03.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '3dfaeace-3a67-4106-b2d2-a33f630c8ca1', 'SQL 管理', 2, NULL, 40002, 'tools/sql/index', 0, 'database', 'sql');
INSERT INTO `sys_permission` VALUES ('969dcc20-b24f-4fd4-be01-141e294bd14e', 1, NULL, '2021-08-07 11:32:42.296168', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.296168', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '删除', 3, 'account:org:delete', 10503, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('98af51d3-573b-4b3b-822e-df44ba01be91', 1, NULL, '2021-08-07 11:42:44.891699', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.891699', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '编辑', 3, 'cms:articleCat:edit', 20402, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('9a287221-8da7-455f-a6fe-89ef4969cd48', 1, NULL, '2021-08-18 20:45:01.991096', NULL, '2021-08-18 22:59:57.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '3dfaeace-3a67-4106-b2d2-a33f630c8ca1', '接口管理', 2, NULL, 40001, 'tools/swagger/index', 0, 'api', 'swagger');
INSERT INTO `sys_permission` VALUES ('a0526cc2-26b4-4588-b822-e48643a58583', 1, NULL, '2021-08-07 11:32:42.324574', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.324574', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '导出 EXCEL', 3, 'account:org:exportExcel', 10505, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a27048fe-6403-4234-97a9-545fc67b9d81', 1, NULL, '2021-08-07 11:42:44.957332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.957332', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '删除', 3, 'cms:articleCat:delete', 20403, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a3c5c8ec-69ca-4c0f-b6a0-27d11f81775b', 1, NULL, '2021-08-07 11:32:42.311247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.311247', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '批量删除', 3, 'account:org:deleteBatch', 10504, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a52040ca-ded7-4ca3-b94c-b492871d25fb', 1, '', '2021-08-07 01:06:35.862749', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:06:35.862749', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '添加', 3, 'account:user:add', 10101, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('ac7facf6-fb8a-4465-9693-6b822663ab94', 1, NULL, '2021-08-18 20:45:01.883762', NULL, '2021-08-19 09:17:37.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '评论管理', 2, NULL, 30400, 'system/comment/topic-list', 0, 'topic', 'topic-list');
INSERT INTO `sys_permission` VALUES ('ad645f1d-eb39-4c17-92df-8a8e70033921', 1, '', '2021-08-18 22:24:32.503382', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:49:25.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '机构添加/编辑', 2, NULL, 10501, 'account/org/org-edit', 1, NULL, 'org-edit');
INSERT INTO `sys_permission` VALUES ('b17495d5-acf5-4414-8a66-aec02770d65c', 1, '', '2021-08-18 22:21:03.710288', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:08:45.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户组角色配置', 2, NULL, 10600, 'account/group/group-role', 1, NULL, 'group-role');
INSERT INTO `sys_permission` VALUES ('b2f8ef54-dc2a-47fe-8e88-fa025866bcfe', 1, NULL, '2021-08-07 11:32:42.264030', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.264030', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '添加', 3, 'account:org:add', 10501, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('b4225a25-e636-4ada-b781-d7213cef053e', 1, NULL, '2021-08-07 11:38:45.052498', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.052498', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '批量删除', 3, 'cms:article:deleteBatch', 20104, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', 1, '', '2021-08-07 01:02:45.322043', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 22:53:40.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '机构列表', 2, NULL, 10500, 'account/org/org-list', 0, 'tree', 'org-list');
INSERT INTO `sys_permission` VALUES ('b63c6ab5-9e67-4937-8c0c-86500ccdecd8', 1, '', '2021-08-19 00:08:31.094986', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:13:03.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '权限添加/编辑', 2, NULL, 11000, 'account/permission/permission-edit', 1, NULL, 'permission-edit');
INSERT INTO `sys_permission` VALUES ('b9b8e480-1a2b-409b-918a-c5969e65d900', 1, '', '2021-08-07 10:58:52.176087', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 10:58:52.176087', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '批量删除', 3, 'account:user:deleteBatch', 10104, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('ba3334a6-d382-4fc9-8e40-6f4f134d2206', 1, '', '2021-08-07 01:10:41.554006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:05:41.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '栏目列表', 2, NULL, 20400, 'cms/article-cat/article-cat-list', 0, 'tree-table', 'article-cat-list');
INSERT INTO `sys_permission` VALUES ('baf3a0ba-3fcd-44a6-8bb3-0c00a18dd082', 1, '', '2021-08-18 22:28:50.378559', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:52:27.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '评论添加/编辑', 2, NULL, 20406, 'cms/article-cat/article-cat-edit', 1, NULL, 'article-cat-edit');
INSERT INTO `sys_permission` VALUES ('c01471fd-978e-467f-a150-71463ae73ac2', 1, NULL, '2021-08-18 20:45:01.859303', NULL, '2021-08-18 20:45:01.859303', NULL, 0, NULL, NULL, '864b38b3-518f-4455-a1b2-e774418fd193', '编辑', 3, 'system:holiday:edit', 30302, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('c10bfe91-f8af-495b-adb3-1460877dee6b', 1, '', '2021-08-19 09:08:06.871773', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:13:45.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户组添加/编辑', 2, NULL, 10600, 'account/group/group-edit', 1, NULL, 'group-edit');
INSERT INTO `sys_permission` VALUES ('c11ca131-3791-4185-b5a0-3b5aaf9a648d', 1, NULL, '2021-08-18 20:45:01.919533', NULL, '2021-08-18 23:04:17.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '评论回复管理', 2, NULL, 30500, 'system/comment/comment-list', 0, 'comment', 'comment-list');
INSERT INTO `sys_permission` VALUES ('c47a7db4-c9f4-415d-8ec5-8df778f00fc4', 1, NULL, '2021-08-18 20:45:01.468601', NULL, '2021-08-18 20:45:01.468601', NULL, 0, NULL, NULL, '1dee7029-7781-4016-8a0e-a55f014f8086', '编辑', 3, 'system:dict:edit', 30102, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('c7350e65-4609-4b2e-8dcb-9b03c34585c4', 1, '', '2021-08-18 22:30:34.753689', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:07:29.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '收货地址', 2, NULL, 10700, 'account/user-address/index', 1, 'guide', 'user-address');
INSERT INTO `sys_permission` VALUES ('c8a27d18-898a-46c7-9be1-666344cccc51', 1, NULL, '2021-08-07 11:03:42.266733', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:03:42.266733', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '添加', 3, 'account:group:add', 10201, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('c9b7eb18-db9d-4935-846e-32c93407905a', 1, '', '2021-08-07 01:00:10.988174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:42.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户列表', 2, NULL, 10100, 'account/user/user-list', 0, 'peoples', 'user-list');
INSERT INTO `sys_permission` VALUES ('d6cdc6a9-f040-4dfa-9d68-2e0c15eafcd9', 1, NULL, '2021-08-07 11:04:35.882150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:35.882150', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '删除', 3, 'account:group:delete', 10203, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('da95aca8-d0a4-4560-a4bc-1fde6c10e84b', 1, '', '2021-08-18 22:48:37.229749', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:53:15.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '字典添加/编辑', 2, NULL, 30101, 'system/dict/dict-edit', 1, NULL, 'dict-edit');
INSERT INTO `sys_permission` VALUES ('dc5e76e3-8eba-4a4d-8e40-55da17c438b1', 1, NULL, '2021-08-18 20:45:01.658306', NULL, '2021-08-19 09:33:43.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '76726c38-e251-4573-9648-050efee195d5', '文件管理', 2, NULL, 30600, 'system/file/index', 0, 'file', 'file');
INSERT INTO `sys_permission` VALUES ('ddb72cfa-0c8c-4f12-b495-5bc1cf220166', 1, '', '2021-08-18 22:18:50.118325', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:05:38.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', ' 用户分配用户组', 2, NULL, 10300, 'account/user/user-group', 1, NULL, 'user-group');
INSERT INTO `sys_permission` VALUES ('e1fa542f-5dc5-4874-9841-a6878df76701', 1, '', '2021-08-18 22:46:24.012879', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:29:51.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'c7350e65-4609-4b2e-8dcb-9b03c34585c4', '添加', 3, 'account:userAddress:add', 10702, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('e482737d-c04b-4b88-b76d-f5d7643958e4', 1, '', '2021-08-18 22:46:46.635191', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-18 23:30:11.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'c7350e65-4609-4b2e-8dcb-9b03c34585c4', '编辑', 3, 'account:userAddress:edit', 10703, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('e7c705cb-c734-4160-b5bd-b15bf022dbe6', 1, NULL, '2021-08-07 11:38:44.608468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.608468', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '编辑', 3, 'account:post:edit', 10602, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('ec62871f-f5f5-4fca-b244-ed04b35612cb', 1, '', '2021-08-18 22:17:15.942361', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:05:12.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户添加/编辑', 2, NULL, 10200, 'account/user/user-edit', 1, '404', 'user-edit');
INSERT INTO `sys_permission` VALUES ('ee8f4801-155f-4d3a-aaa1-804a0a59ef16', 1, '', '2021-08-18 22:21:36.899460', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-19 09:12:26.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '角色权限配置', 2, NULL, 10800, 'account/role/role-permission', 1, 'education', 'role-permission');
INSERT INTO `sys_permission` VALUES ('ef2db655-1acb-4aed-bbe6-0c12020d0562', 1, '', '2021-08-07 00:58:01.100343', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:33.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, NULL, '账户管理', 1, NULL, 10000, 'Layout', 0, 'user', '/account');
INSERT INTO `sys_permission` VALUES ('f25c0cb5-8c15-4569-8c24-32a60c3c07a0', 1, '', '2021-08-07 01:07:31.300966', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:07:31.300966', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '编辑', 3, 'account:user:edit', 10102, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f49f5232-fd18-447f-bc48-9c0aa111351f', 1, NULL, '2021-08-07 11:51:37.852192', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.852192', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配角色', 3, 'account:user:bindRoles', 10107, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f52db313-0ab2-42d7-8e30-524b4ab308f6', 1, NULL, '2021-08-07 11:51:37.888762', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.888762', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '分配角色', 3, 'account:grogp:bindRoles', 10206, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f777da84-c818-4f58-ae72-41a2a43fc500', 1, NULL, '2021-08-07 11:38:45.077979', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.077979', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '导出 EXCEL', 3, 'cms:article:exportExcel', 20105, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f7a3c83a-d4b6-4776-9c99-ca6ccc005004', 1, NULL, '2021-08-07 11:38:44.898247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.898247', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '编辑', 3, 'cms:article:edit', 20102, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f8a16ae2-78ea-4be6-85d7-2c02b76ea9ab', 1, NULL, '2021-08-07 11:38:44.644037', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.644037', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '删除', 3, 'account:post:delete', 10603, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('fb65a555-d8f5-4581-a61c-10309c38835e', 1, NULL, '2021-08-07 11:51:37.712827', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.712827', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配用户组', 3, 'account:user:bindGroups', 10106, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
