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

 Date: 13/08/2021 14:51:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_comment
-- ----------------------------
DROP TABLE IF EXISTS `sys_comment`;
CREATE TABLE `sys_comment`  (
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
  `commentId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '评论 id',
  `replyId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '回复目标 id。如果 reply_type 是 comment 的话，那么 reply_id ＝commit_id，如果 reply_type 是 reply 的话，这表示这条回复的父回复',
  `replyType` tinyint(4) NOT NULL COMMENT '回复类型（0：评论；1：回复）。因为回复可以是针对评论的回复（comment），也可以是针对回复的回复（reply）， 通过这个字段来区分两种情景',
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '回复内容',
  `fromUid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '回复用户 id',
  `toUid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '目标用户 id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_comment
-- ----------------------------
INSERT INTO `sys_comment` VALUES ('4d0f40b0-2b64-4c0f-8d96-586f023a8344', 1, NULL, '2021-08-13 14:16:47.972179', NULL, '2021-08-13 14:16:47.972179', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', '201037b8-632b-4150-b9cf-904cde0baaae', 0, NULL, 'd42d636b-cd41-4514-88e8-97ce499d4c32', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_comment` VALUES ('963f26db-f657-47f9-b502-a07ef2e89a1f', 1, NULL, '2021-08-13 14:09:47.048514', NULL, '2021-08-13 14:09:47.048514', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 'cf0e07e8-aeeb-4ddc-8bb6-6d1d7965278', 0, '3', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_comment` VALUES ('acd39dbf-f39e-4fa1-90a7-5a143ce6a9bb', 1, NULL, '2021-08-13 14:12:16.844051', NULL, '2021-08-13 14:12:16.844051', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', '963f26db-f657-47f9-b502-a07ef2e89a1f', 1, '4', '518e81b2-0bda-4729-be21-d25c94a424ff', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_comment` VALUES ('cb403657-92c7-49e6-b821-b71d6fa5a317', 1, NULL, '2021-08-12 10:52:16.169299', NULL, '2021-08-12 10:52:16.169299', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', '032d0c08-e36d-4b35-b9af-df9fabd7e6a4', 0, '1', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_comment` VALUES ('f3cbb734-c5b6-4db8-8928-1af8145a1530', 1, NULL, '2021-08-13 13:58:03.245117', NULL, '2021-08-13 13:58:03.245117', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 'cb403657-92c7-49e6-b821-b71d6fa5a317', 1, '2', '518e81b2-0bda-4729-be21-d25c94a424ff', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');

SET FOREIGN_KEY_CHECKS = 1;
