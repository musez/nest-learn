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

 Date: 09/09/2021 10:23:21
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
INSERT INTO `sys_topic` VALUES ('03d98089-7918-4e00-9e26-56faafc59fb8', 1, NULL, '2021-08-13 13:53:27.059658', NULL, '2021-09-01 16:02:01.000000', NULL, 0, '2021-09-01 08:02:01', '62310947-7b54-45c8-a5da-19837f2541a4', '7483bae5-ce55-48fe-afc6-d14a13a20ad1', 0, '4', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_topic` VALUES ('201037b8-632b-4150-b9cf-904cde0baaae', 1, NULL, '2021-08-13 13:52:09.709658', NULL, '2021-08-13 13:52:09.709658', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '3', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_topic` VALUES ('37b85132-95ad-44cb-adcd-68afbb7f2bc3', 1, NULL, '2021-08-15 01:02:47.914006', NULL, '2021-08-15 01:02:47.914006', NULL, 0, NULL, NULL, 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', 0, '1-1', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('37bd195d-cff4-41d1-8d47-0fbc65a57bcf', 1, NULL, '2021-08-15 02:21:26.644948', NULL, '2021-08-15 02:21:26.644948', NULL, 0, NULL, NULL, 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', 0, '4-1', 'd42d636b-cd41-4514-88e8-97ce499d4c32');
INSERT INTO `sys_topic` VALUES ('3c9eee8b-dc33-4d38-85d3-a9894272b1e6', 1, NULL, '2021-08-15 02:20:38.157096', NULL, '2021-08-15 02:20:38.157096', NULL, 0, NULL, NULL, 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', 0, '3-1', '62310947-7b54-45c8-a5da-19837f2541a4');
INSERT INTO `sys_topic` VALUES ('500a83c3-6e22-45c1-8b8c-405164271a19', 1, NULL, '2021-08-15 00:47:59.294393', NULL, '2021-08-15 00:47:59.294393', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '1111', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('9f6a83c5-8c1c-4622-a591-2acd9643d1a8', 0, NULL, '2021-08-11 23:40:14.833981', NULL, '2021-09-01 16:01:58.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 08:01:58', '62310947-7b54-45c8-a5da-19837f2541a4', 'bdf078c5-bb0f-42b3-8317-1a06792fa1ee', 0, '2', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('a5f16158-509a-4a17-b2de-bb70fed4bc04', 1, NULL, '2021-08-11 23:33:29.494321', NULL, '2021-09-01 16:02:06.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '16eda59a-2953-453b-aac0-0bba030d57c6', 0, '1', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('b7e934f6-8fc5-459b-8d8a-eca000728475', 1, NULL, '2021-08-15 12:42:43.804260', NULL, '2021-08-15 12:42:43.804260', NULL, 0, NULL, NULL, 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', 0, '4-3', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('bb78a26c-eadc-40d1-9909-4ccd69afc4b7', 1, NULL, '2021-08-15 01:02:52.889570', NULL, '2021-08-15 01:02:52.889570', NULL, 0, NULL, NULL, 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', 0, '2-1', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('bce0e55e-4aa7-4375-a653-eafbb1f8109f', 1, NULL, '2021-08-15 00:58:18.213165', NULL, '2021-08-15 00:58:18.213165', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, 'errterytryr', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('cf0e07e8-aeeb-4ddc-8bb6-6d1d7965278', 1, NULL, '2021-08-12 10:27:29.882396', NULL, '2021-08-12 10:27:29.882396', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, '2', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_topic` VALUES ('e745e34d-a62c-4e97-9170-8cee69d11285', 1, NULL, '2021-08-15 00:48:24.797105', NULL, '2021-08-15 00:48:24.797105', NULL, 0, NULL, NULL, '90caa2d6-2194-49be-8108-01860297fcaa', 0, 'reterggdfg', '518e81b2-0bda-4729-be21-d25c94a424ff');

SET FOREIGN_KEY_CHECKS = 1;
