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

 Date: 13/08/2021 14:51:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_topic
-- ----------------------------
DROP TABLE IF EXISTS `sys_topic`;
CREATE TABLE `sys_topic`  (
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
  `topicId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主题 id',
  `topicType` tinyint(4) NOT NULL COMMENT '主题类型（0：Article）',
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '评论内容',
  `fromUid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '评论用户 id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_topic
-- ----------------------------
INSERT INTO `sys_topic` VALUES ('032d0c08-e36d-4b35-b9af-df9fabd7e6a4', 1, NULL, '2021-08-12 10:26:26.319555', NULL, '2021-08-12 10:26:26.319555', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '1', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('03d98089-7918-4e00-9e26-56faafc59fb8', 1, NULL, '2021-08-13 13:53:27.059658', NULL, '2021-08-13 13:53:27.059658', NULL, 0, NULL, NULL, '7483bae5-ce55-48fe-afc6-d14a13a20ad1', 0, '4', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_topic` VALUES ('201037b8-632b-4150-b9cf-904cde0baaae', 1, NULL, '2021-08-13 13:52:09.709658', NULL, '2021-08-13 13:52:09.709658', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '3', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_topic` VALUES ('cf0e07e8-aeeb-4ddc-8bb6-6d1d7965278', 1, NULL, '2021-08-12 10:27:29.882396', NULL, '2021-08-12 10:27:29.882396', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '2', '518e81b2-0bda-4729-be21-d25c94a424ff');

SET FOREIGN_KEY_CHECKS = 1;
