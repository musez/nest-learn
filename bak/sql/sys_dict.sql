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

 Date: 09/09/2021 10:21:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict`  (
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
  `dictName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '字典名称',
  `dictCode` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '字典编码',
  `type` tinyint(4) NULL DEFAULT 0 COMMENT '字典类型（0：string；1：number；）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
INSERT INTO `sys_dict` VALUES ('0da20d9a-3161-4f45-92dd-e5183d362c4c', 1, '', '2021-08-07 02:04:14.510940', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.510940', NULL, 0, NULL, NULL, '文章类型', 'article', 0);
INSERT INTO `sys_dict` VALUES ('129b8071-9e16-461a-ae03-d2a8ed8cb3bb', 1, '', '2021-08-17 00:11:39.797056', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:48.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:48', '62310947-7b54-45c8-a5da-19837f2541a4', '字典5', 'dict5', 0);
INSERT INTO `sys_dict` VALUES ('2d0cb100-4b1b-48ef-8b1c-57429bac5e8c', 1, '', '2021-08-07 02:01:58.101370', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:58.101370', NULL, 0, NULL, NULL, '删除类型', 'delete', 0);
INSERT INTO `sys_dict` VALUES ('4b725da9-ff66-412a-95bc-cf3fdf985fd5', 1, '', '2021-08-22 01:16:42.634361', '62310947-7b54-45c8-a5da-19837f2541a4', '2021-09-01 16:29:17.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '文章来源', 'source', 0);
INSERT INTO `sys_dict` VALUES ('6d8d28a8-033c-46e7-877a-22f624186a14', 0, '', '2021-08-17 00:11:03.349085', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 01:17:14.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '字典2', 'dict2', 0);
INSERT INTO `sys_dict` VALUES ('84e80ce6-e98e-47b2-a372-35cdcd034e6f', 1, '', '2021-08-17 00:11:59.019492', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-21 14:58:04.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '评论类型', 'topic', 0);
INSERT INTO `sys_dict` VALUES ('9b566677-a809-4879-984b-1fe60a0dcb68', 1, '', '2021-08-07 02:03:05.407799', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.407799', NULL, 0, NULL, NULL, '性别类型', 'sex', 0);
INSERT INTO `sys_dict` VALUES ('a430f477-afb9-4921-a551-2082114c3fa8', 0, '', '2021-08-17 00:11:28.598667', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:52.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:52', '62310947-7b54-45c8-a5da-19837f2541a4', '字典4', 'dict4', 0);
INSERT INTO `sys_dict` VALUES ('b3e25844-7b49-4d14-9d25-b3a0e8d217f9', 0, '', '2021-08-17 00:11:16.363952', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 01:17:12.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '字典3', 'dict3', 0);
INSERT INTO `sys_dict` VALUES ('d210f0d6-984c-43b7-905a-b7db139e4b49', 1, '', '2021-08-07 02:02:35.700726', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.700726', NULL, 0, NULL, NULL, '用户类型', 'user', 0);
INSERT INTO `sys_dict` VALUES ('d65eefd0-32c2-42e4-bb68-21a2fc2b114e', 0, '', '2021-08-17 00:10:50.581056', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 01:17:15.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '字典1', 'dict1', 0);
INSERT INTO `sys_dict` VALUES ('d6d46c10-c36f-444b-a5e2-baa8f771e921', 1, '', '2021-08-07 02:01:13.022870', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:13.022870', NULL, 0, NULL, NULL, '状态类型', 'status', 0);

SET FOREIGN_KEY_CHECKS = 1;
