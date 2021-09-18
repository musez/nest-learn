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

 Date: 18/09/2021 17:48:01
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
INSERT INTO `sys_group` VALUES ('0950c980-ab23-4244-8e0f-ce70e9628e13', 1, '管理员', '2021-08-07 00:51:28.351289', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:28.351289', NULL, 0, NULL, NULL, '管理员');
INSERT INTO `sys_group` VALUES ('c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', 1, '用户', '2021-08-07 00:51:44.197858', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:44.197858', NULL, 0, NULL, NULL, '用户');
INSERT INTO `sys_group` VALUES ('ef439baf-ba10-4662-b394-b91938a256e5', 1, '运营', '2021-08-07 00:52:15.403309', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:52:15.403309', NULL, 0, NULL, NULL, '运营');

SET FOREIGN_KEY_CHECKS = 1;
