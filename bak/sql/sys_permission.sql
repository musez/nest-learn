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

 Date: 18/08/2021 19:00:46
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
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES ('06953b13-d8d0-493e-a630-792ddcacfef5', 1, '', '2021-08-07 01:02:58.601088', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:58.601088', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '岗位列表', 2, NULL, 160, 'account/post/post-list', 0, NULL, 'post-list');
INSERT INTO `sys_permission` VALUES ('0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb', 1, '', '2021-08-07 01:08:08.304193', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:08:08.304193', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '删除', 3, 'account:user:delete', 113, '', 0, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('10417cf5-f095-4abd-a9f0-5e8e8bcafb3c', 1, NULL, '2021-08-07 11:38:44.862212', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.862212', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '添加', 3, 'cms:article:add', 211, NULL, NULL, NULL, 'article-edit');
INSERT INTO `sys_permission` VALUES ('10ba71b0-69ba-402c-b19b-6d2ec4c8018a', 1, NULL, '2021-08-07 11:04:59.406351', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:59.406351', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '批量删除', 3, 'account:group:deleteBatch', 124, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('10dd853b-9272-4cd6-93bc-4a03bab7a18f', 1, '', '2021-08-07 01:02:34.057082', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:34.057082', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '权限列表', 2, NULL, 140, 'account/permission/permission-list', 0, NULL, 'permission-list');
INSERT INTO `sys_permission` VALUES ('250b7a06-2dbb-4c76-b483-1bd3542f1b99', 1, NULL, '2021-08-07 11:32:42.196404', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.196404', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '编辑', 3, 'account:permission:edit', 142, 'account/permission/permission-edit', NULL, NULL, 'permission-edit');
INSERT INTO `sys_permission` VALUES ('2531bbd4-f502-4818-af8c-d545e225547d', 1, NULL, '2021-08-07 11:38:44.769408', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.769408', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '批量删除', 3, 'account:post:deleteBatch', 164, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('25eef5c4-55de-4487-9812-28e76d238e7b', 1, NULL, '2021-08-07 11:51:37.924803', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.924803', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '分配权限', 3, 'cms:role:bindPermissions', 136, 'account/permission/permission-list', NULL, NULL, 'role-permission');
INSERT INTO `sys_permission` VALUES ('2b552e47-8a30-4ecc-a183-797e85db8ef5', 1, '', '2021-08-07 01:09:14.291728', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:14.291728', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '导出 EXCEL', 3, 'account:user:exportExcel', 115, NULL, 0, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('306e4a38-9e71-4e77-b66d-4aab6a0d94e5', 1, NULL, '2021-08-07 11:07:10.260672', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:10.260672', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '添加', 3, 'account:role:add', 131, 'account/role/role-edit', NULL, NULL, 'role-edit');
INSERT INTO `sys_permission` VALUES ('31292492-7a02-446c-b509-6ad4884beb0', 1, NULL, '2021-08-07 11:04:05.739022', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:05.739022', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '编辑', 3, 'account:group:edit', 122, 'account/group/group-edit', NULL, NULL, 'group-edit');
INSERT INTO `sys_permission` VALUES ('3abf143e-9da9-4750-9c4f-d01cc02ac4f5', 1, '', '2021-08-07 01:01:28.916468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:01:28.916468', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户组列表', 2, NULL, 120, 'account/group/group-list', 0, 'group', 'group-list');
INSERT INTO `sys_permission` VALUES ('4313ded5-ee99-49cb-88fd-44b70dc0bef1', 1, '', '2021-08-07 01:09:53.809433', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:53.809433', NULL, 0, NULL, NULL, NULL, '广告管理', 1, NULL, 200, 'Layout', 0, 'ads', '/article');
INSERT INTO `sys_permission` VALUES ('4365dca5-ba7b-4233-92d7-f31fdb01aaa8', 1, NULL, '2021-08-07 11:07:27.112174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:27.112174', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '编辑', 3, 'account:role:edit', 132, 'account/role/role-edit', NULL, NULL, 'role-edit');
INSERT INTO `sys_permission` VALUES ('4379e01f-ccd0-4f11-b410-bb2636b767cc', 1, NULL, '2021-08-07 11:07:54.374588', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:54.374588', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '删除', 3, 'account:role:delete', 133, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('484a14c2-82f9-4818-afd9-959ddccc5a96', 1, NULL, '2021-08-07 11:05:13.683272', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:05:13.683272', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '导出 EXCEL', 3, 'account:group:exportExcel', 125, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('4d4a312c-7046-4872-9efb-18af351296d5', 1, NULL, '2021-08-07 11:38:44.969581', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.969581', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '删除', 3, 'cms:article:delete', 213, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('547eba13-1039-4cc6-9719-6fb79d304a4c', 1, NULL, '2021-08-07 11:32:42.282497', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.282497', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '编辑', 3, 'account:org:edit', 152, 'account/org/org-edit', NULL, NULL, 'org-edit');
INSERT INTO `sys_permission` VALUES ('5d40f3ed-67f4-4147-9da6-3637a52324e1', 1, NULL, '2021-08-07 11:32:42.177006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.177006', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '添加', 3, 'account:permission:add', 141, 'account/permission/permission-edit', NULL, NULL, 'permission-edit');
INSERT INTO `sys_permission` VALUES ('63343802-c2a5-4cdf-a0ee-0a620c5c5926', 1, NULL, '2021-08-07 11:38:44.827421', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.827421', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '导出 EXCEL', 3, 'account:post:exportExcel', 165, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('636423f6-0657-412a-951a-80caa3930f21', 1, NULL, '2021-08-07 11:42:45.122572', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.122572', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '导出 EXCEL', 3, 'cms:articleCat:exportExcel', 235, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('66a7e4f0-46ad-4642-b348-0c85ee5860af', 1, NULL, '2021-08-07 11:38:44.558244', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.558244', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '添加', 3, 'account:post:add', 161, 'account/post/post-edit', NULL, NULL, 'post-edit');
INSERT INTO `sys_permission` VALUES ('676cec2a-d9ff-4961-9213-499369b1c902', 1, NULL, '2021-08-07 11:42:44.799968', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.799968', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '添加', 3, 'cms:articleCat:add', 231, NULL, NULL, NULL, 'article-cat-edit');
INSERT INTO `sys_permission` VALUES ('67f7c348-8bdb-486e-8585-e579e90b43c3', 1, NULL, '2021-08-07 11:42:45.047540', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.047540', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '批量删除', 3, 'cms:articleCat:deleteBatch', 234, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('6a5aee9a-2739-429f-83db-ebd2ec656205', 1, NULL, '2021-08-07 11:08:11.156613', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:11.156613', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '批量删除', 3, 'account:role:deleteBatch', 134, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('6d304bad-996b-40d5-a43a-7bab9ead2744', 1, '', '2021-08-07 01:10:25.568965', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:10:25.568965', NULL, 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '广告列表', 2, NULL, 210, 'cms/article/article-list', 0, 'ads', 'article-list');
INSERT INTO `sys_permission` VALUES ('78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', 1, '', '2021-08-07 01:02:19.758726', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:19.758726', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '角色列表', 2, NULL, 130, 'account/role/role-list', 0, NULL, 'role-list');
INSERT INTO `sys_permission` VALUES ('843528e7-3a86-4b12-b433-f93bcccbc7e7', 1, NULL, '2021-08-07 11:32:42.246868', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.246868', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '导出 EXCEL', 3, 'account:permission:exportExcel', 145, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('862d3a38-afac-4f7d-ab26-07ab7a258feb', 1, NULL, '2021-08-07 11:32:42.232150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.232150', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '批量删除', 3, 'account:permission:deleteBatch', 144, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('887460aa-df2c-47e3-bb13-116aec0fcd25', 1, NULL, '2021-08-07 11:32:42.216184', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.216184', NULL, 0, NULL, NULL, '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '删除', 3, 'account:permission:delete', 143, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('8d8814dc-e3ce-426c-8188-67c2dba77f72', 1, NULL, '2021-08-07 11:08:30.792743', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:30.792743', NULL, 0, NULL, NULL, '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '导出 EXCEL', 3, 'account:role:exportExcel', 135, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('969dcc20-b24f-4fd4-be01-141e294bd14e', 1, NULL, '2021-08-07 11:32:42.296168', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.296168', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '删除', 3, 'account:org:delete', 153, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('98af51d3-573b-4b3b-822e-df44ba01be91', 1, NULL, '2021-08-07 11:42:44.891699', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.891699', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '编辑', 3, 'cms:articleCat:edit', 232, NULL, NULL, NULL, 'article-cat-edit');
INSERT INTO `sys_permission` VALUES ('a0526cc2-26b4-4588-b822-e48643a58583', 1, NULL, '2021-08-07 11:32:42.324574', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.324574', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '导出 EXCEL', 3, 'account:org:exportExcel', 155, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a27048fe-6403-4234-97a9-545fc67b9d81', 1, NULL, '2021-08-07 11:42:44.957332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.957332', NULL, 0, NULL, NULL, 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '删除', 3, 'cms:articleCat:delete', 233, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a3c5c8ec-69ca-4c0f-b6a0-27d11f81775b', 1, NULL, '2021-08-07 11:32:42.311247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.311247', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '批量删除', 3, 'account:org:deleteBatch', 154, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('a52040ca-ded7-4ca3-b94c-b492871d25fb', 1, '', '2021-08-07 01:06:35.862749', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:06:35.862749', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '添加', 3, 'account:user:add', 111, 'account/user/user-edit', 0, NULL, 'user-edit');
INSERT INTO `sys_permission` VALUES ('b2f8ef54-dc2a-47fe-8e88-fa025866bcfe', 1, NULL, '2021-08-07 11:32:42.264030', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.264030', NULL, 0, NULL, NULL, 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '添加', 3, 'account:org:add', 151, 'account/org/org-edit', NULL, NULL, 'org-edit');
INSERT INTO `sys_permission` VALUES ('b4225a25-e636-4ada-b781-d7213cef053e', 1, NULL, '2021-08-07 11:38:45.052498', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.052498', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '批量删除', 3, 'cms:article:deleteBatch', 214, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', 1, '', '2021-08-07 01:02:45.322043', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:45.322043', NULL, 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '机构列表', 2, NULL, 150, 'account/org/org-list', 0, NULL, 'org-list');
INSERT INTO `sys_permission` VALUES ('b9b8e480-1a2b-409b-918a-c5969e65d900', 1, '', '2021-08-07 10:58:52.176087', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 10:58:52.176087', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '批量删除', 3, 'account:user:deleteBatch', 114, NULL, 0, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('ba3334a6-d382-4fc9-8e40-6f4f134d2206', 1, '', '2021-08-07 01:10:41.554006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:10:41.554006', NULL, 0, NULL, NULL, '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '栏目列表', 2, NULL, 230, 'cms/article-cat/article-cat-list', 0, NULL, 'article-cat-list');
INSERT INTO `sys_permission` VALUES ('c8a27d18-898a-46c7-9be1-666344cccc51', 1, NULL, '2021-08-07 11:03:42.266733', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:03:42.266733', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '添加', 3, 'account:group:add', 121, 'account/group/group-edit', NULL, NULL, 'group-edit');
INSERT INTO `sys_permission` VALUES ('c9b7eb18-db9d-4935-846e-32c93407905a', 1, '', '2021-08-07 01:00:10.988174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:42.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户列表', 2, NULL, 110, 'account/user/user-list', 0, 'peoples', 'user-list');
INSERT INTO `sys_permission` VALUES ('d6cdc6a9-f040-4dfa-9d68-2e0c15eafcd9', 1, NULL, '2021-08-07 11:04:35.882150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:35.882150', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '删除', 3, 'account:group:delete', 123, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('e7c705cb-c734-4160-b5bd-b15bf022dbe6', 1, NULL, '2021-08-07 11:38:44.608468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.608468', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '编辑', 3, 'account:post:edit', 162, 'account/post/post-edit', NULL, NULL, 'post-edit');
INSERT INTO `sys_permission` VALUES ('ef2db655-1acb-4aed-bbe6-0c12020d0562', 1, '', '2021-08-07 00:58:01.100343', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:33.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, NULL, '账户管理', 1, NULL, 100, 'Layout', 0, 'user', '/account');
INSERT INTO `sys_permission` VALUES ('f25c0cb5-8c15-4569-8c24-32a60c3c07a0', 1, '', '2021-08-07 01:07:31.300966', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:07:31.300966', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '编辑', 3, 'account:user:edit', 112, 'account/user/user-edit', 0, NULL, 'user-edit');
INSERT INTO `sys_permission` VALUES ('f49f5232-fd18-447f-bc48-9c0aa111351f', 1, NULL, '2021-08-07 11:51:37.852192', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.852192', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配角色', 3, 'cms:user:bindRoles', 117, NULL, NULL, NULL, 'user-role');
INSERT INTO `sys_permission` VALUES ('f52db313-0ab2-42d7-8e30-524b4ab308f6', 1, NULL, '2021-08-07 11:51:37.888762', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.888762', NULL, 0, NULL, NULL, '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '分配角色', 3, 'cms:grogp:bindRoles', 126, NULL, NULL, NULL, 'group-role');
INSERT INTO `sys_permission` VALUES ('f777da84-c818-4f58-ae72-41a2a43fc500', 1, NULL, '2021-08-07 11:38:45.077979', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.077979', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '导出 EXCEL', 3, 'cms:article:exportExcel', 215, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('f7a3c83a-d4b6-4776-9c99-ca6ccc005004', 1, NULL, '2021-08-07 11:38:44.898247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.898247', NULL, 0, NULL, NULL, '6d304bad-996b-40d5-a43a-7bab9ead2744', '编辑', 3, 'cms:article:edit', 212, NULL, NULL, NULL, 'article-edit');
INSERT INTO `sys_permission` VALUES ('f8a16ae2-78ea-4be6-85d7-2c02b76ea9ab', 1, NULL, '2021-08-07 11:38:44.644037', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.644037', NULL, 0, NULL, NULL, '06953b13-d8d0-493e-a630-792ddcacfef5', '删除', 3, 'account:post:delete', 163, NULL, NULL, NULL, NULL);
INSERT INTO `sys_permission` VALUES ('fb65a555-d8f5-4581-a61c-10309c38835e', 1, NULL, '2021-08-07 11:51:37.712827', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.712827', NULL, 0, NULL, NULL, 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配用户组', 3, 'cms:user:bindGroups', 116, NULL, NULL, NULL, 'user-group');

SET FOREIGN_KEY_CHECKS = 1;
