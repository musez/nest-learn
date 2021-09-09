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

 Date: 09/09/2021 10:22:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_org
-- ----------------------------
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org`  (
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
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机构名称',
  `shortName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '机构简称',
  `orgType` tinyint(4) NOT NULL COMMENT '机构类型（0：机构；1：部门；)',
  `orgLevel` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '机构级次码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_org
-- ----------------------------
INSERT INTO `sys_org` VALUES ('16c8e260-a8cd-47b1-89bf-5c3e14f16bd8', 1, '', '2021-08-07 01:23:23.777916', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:56:56.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:56:56', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '片片海协调科技发展有限公司', '片片海', 0, '003000000');
INSERT INTO `sys_org` VALUES ('24b2bc6b-d807-4e3b-afec-1e36c23a2479', 1, '', '2021-08-07 01:25:06.492863', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:28:01.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '877451ad-b564-47eb-825b-958b6302aed6', '人事部', NULL, 1, '001004000');
INSERT INTO `sys_org` VALUES ('4b189366-9334-4f16-a9e2-9fcb81d48ddd', 1, '', '2021-08-07 01:23:36.539771', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:00.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, '2021-09-01 07:57:00', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '武汉优品楚鼎科技有限公司', '优品', 0, '002000000');
INSERT INTO `sys_org` VALUES ('877451ad-b564-47eb-825b-958b6302aed6', 1, '', '2021-08-07 01:23:56.605494', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:38:39.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '武汉佳软信息技术有限公司', '佳软', 0, '001000000');
INSERT INTO `sys_org` VALUES ('c0538323-cb03-4603-8d6a-9f881e82afc4', 1, '', '2021-08-07 01:24:41.796777', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:27:26.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '877451ad-b564-47eb-825b-958b6302aed6', '项目二部', NULL, 1, '001002000');
INSERT INTO `sys_org` VALUES ('c0ce7f52-bfd8-4a4a-9157-8340741877e6', 1, '', '2021-08-07 01:24:26.635954', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:26:49.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '877451ad-b564-47eb-825b-958b6302aed6', '项目一部', NULL, 1, '001001000');
INSERT INTO `sys_org` VALUES ('d2143c17-b14c-4a55-be60-a4be59106668', 1, '', '2021-08-07 01:24:53.212135', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:27:37.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '877451ad-b564-47eb-825b-958b6302aed6', '项目三部', NULL, 1, '001003000');
INSERT INTO `sys_org` VALUES ('e6dc87dc-be22-4bad-b706-95169bb64ac3', 1, '', '2021-08-07 01:25:21.885246', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:28:09.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '877451ad-b564-47eb-825b-958b6302aed6', '商务部', NULL, 1, '001005000');

SET FOREIGN_KEY_CHECKS = 1;
