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

 Date: 09/09/2021 10:22:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_group`;
CREATE TABLE `sys_group`  (
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
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_group
-- ----------------------------
INSERT INTO `sys_group` VALUES ('0078b5ce-ba44-45c8-9a02-142d085cb311', 1, '游客', '2021-08-07 00:52:03.708245', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:52:03.708245', NULL, 0, NULL, NULL, '游客');
INSERT INTO `sys_group` VALUES ('092e5256-96d0-4c97-bf59-9cfa159046be', 0, '', '2021-08-16 23:45:07.682065', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:41:12.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, '2021-09-01 07:41:12', '62310947-7b54-45c8-a5da-19837f2541a4', '用户组8');
INSERT INTO `sys_group` VALUES ('0950c980-ab23-4244-8e0f-ce70e9628e13', 1, '管理员', '2021-08-07 00:51:28.351289', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:28.351289', NULL, 0, NULL, NULL, '管理员');
INSERT INTO `sys_group` VALUES ('1a7f3416-c391-4d4f-a14c-03179bb367a9', 0, '', '2021-08-16 23:44:28.044708', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 02:00:05.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '用户组3');
INSERT INTO `sys_group` VALUES ('1cd464f2-e5e5-4ce7-a0c7-2e1e0e450911', 0, '', '2021-08-16 23:44:14.531189', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 02:00:09.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '用户组1');
INSERT INTO `sys_group` VALUES ('45988235-0592-4cd1-a21f-ed5e8d6d00ac', 0, '', '2021-08-16 23:44:44.354415', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 01:59:57.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '用户组5');
INSERT INTO `sys_group` VALUES ('63cee2d7-1b89-4bfc-bf52-9025f6fda134', 0, '', '2021-08-16 23:44:59.188127', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:41:12.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:41:12', '62310947-7b54-45c8-a5da-19837f2541a4', '用户组7');
INSERT INTO `sys_group` VALUES ('6da24ae8-2652-445f-8ee3-9472027f8eda', 0, '', '2021-08-16 23:44:35.924830', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:39:27.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:39:27', '62310947-7b54-45c8-a5da-19837f2541a4', '用户组4');
INSERT INTO `sys_group` VALUES ('73093f3b-1165-4b5b-8b2e-92dfe4d4ff2d', 0, '', '2021-08-16 23:44:51.143524', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:55:19.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:55:19', '62310947-7b54-45c8-a5da-19837f2541a4', '用户组6');
INSERT INTO `sys_group` VALUES ('c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', 1, '用户', '2021-08-07 00:51:44.197858', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:44.197858', NULL, 0, NULL, NULL, '用户');
INSERT INTO `sys_group` VALUES ('ce36d5fa-fcc7-4726-88d8-89b58b799b45', 0, '', '2021-08-16 23:45:14.830223', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:41:08.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:41:08', '62310947-7b54-45c8-a5da-19837f2541a4', '用户组9');
INSERT INTO `sys_group` VALUES ('dc5715dc-1c3c-4d01-a974-8a36f07d2a27', 0, '', '2021-08-16 23:44:21.320372', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 02:00:07.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '用户组2');
INSERT INTO `sys_group` VALUES ('ef439baf-ba10-4662-b394-b91938a256e5', 1, '运营', '2021-08-07 00:52:15.403309', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:52:15.403309', NULL, 0, NULL, NULL, '运营');

SET FOREIGN_KEY_CHECKS = 1;
