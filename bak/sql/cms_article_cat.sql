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

 Date: 09/09/2021 10:21:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cms_article_cat
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_cat`;
CREATE TABLE `cms_article_cat`  (
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
  `catName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '栏目名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cms_article_cat
-- ----------------------------
INSERT INTO `cms_article_cat` VALUES ('066180a9-325c-4cbb-b0b1-463061eae25a', 1, NULL, '2021-08-17 00:09:25.489020', NULL, '2021-09-01 16:29:53.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目4');
INSERT INTO `cms_article_cat` VALUES ('1527bffa-33e5-43a4-a51e-8c6cf77a7afc', 1, NULL, '2021-08-07 01:35:57.275245', NULL, '2021-08-07 01:35:57.275245', NULL, 0, NULL, NULL, 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '后端');
INSERT INTO `cms_article_cat` VALUES ('1c04aa01-4be4-4f08-821f-6ff93974db78', 0, NULL, '2021-08-17 00:10:10.195013', NULL, '2021-09-01 15:57:27.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, '2021-09-01 07:57:27', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '栏目10');
INSERT INTO `cms_article_cat` VALUES ('23a2eb7e-2072-47a8-abfe-90ae20a7d589', 1, NULL, '2021-08-07 01:33:08.690836', NULL, '2021-08-07 01:33:08.690836', NULL, 0, NULL, NULL, 'ac31b881-acb5-4134-8e60-68e541ee97e5', '测试');
INSERT INTO `cms_article_cat` VALUES ('29bf0e97-8ef6-4929-95c8-89a635d34b0c', 0, NULL, '2021-08-17 00:09:45.269402', NULL, '2021-09-01 15:57:36.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:36', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '栏目7');
INSERT INTO `cms_article_cat` VALUES ('2e100845-163c-49ac-b8ae-beaf0ef842b8', 1, NULL, '2021-08-17 00:09:31.734177', NULL, '2021-09-01 16:29:52.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目5');
INSERT INTO `cms_article_cat` VALUES ('3cb5d0f7-a134-4efb-a77e-99d1b9200815', 1, NULL, '2021-08-17 00:09:19.914987', NULL, '2021-09-01 16:29:53.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目3');
INSERT INTO `cms_article_cat` VALUES ('461be376-da43-41df-873d-5e89caed8081', 1, NULL, '2021-08-07 01:32:19.285488', NULL, '2021-08-07 01:32:19.285488', NULL, 0, NULL, NULL, NULL, '会计');
INSERT INTO `cms_article_cat` VALUES ('4a09215f-8aad-43e4-a491-2a807eb159bc', 0, NULL, '2021-08-17 00:10:02.239477', NULL, '2021-09-01 15:57:31.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:31', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '栏目9');
INSERT INTO `cms_article_cat` VALUES ('5eb5681d-56b7-4b4b-953f-6bfe4df4fa46', 0, NULL, '2021-08-17 00:09:51.382641', NULL, '2021-09-01 15:57:31.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:31', '62310947-7b54-45c8-a5da-19837f2541a4', NULL, '栏目8');
INSERT INTO `cms_article_cat` VALUES ('8624221c-f185-47b7-b426-4dee8e6d9502', 1, NULL, '2021-08-07 01:33:59.000000', NULL, '2021-08-07 01:34:24.000000', NULL, 0, '2021-08-06 17:34:24', '518e81b2-0bda-4729-be21-d25c94a424ff', 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '前端');
INSERT INTO `cms_article_cat` VALUES ('a896c791-d001-4ab4-97f5-d808a91b3dfa', 1, NULL, '2021-08-17 00:09:13.490459', NULL, '2021-09-01 16:29:54.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目2');
INSERT INTO `cms_article_cat` VALUES ('abe935a3-ad05-43f8-b093-8d8a6cb8d411', 1, NULL, '2021-08-07 01:32:26.828831', NULL, '2021-08-07 01:32:26.828831', NULL, 0, NULL, NULL, NULL, '金融');
INSERT INTO `cms_article_cat` VALUES ('ac31b881-acb5-4134-8e60-68e541ee97e5', 1, NULL, '2021-08-07 01:32:06.171883', NULL, '2021-09-01 16:29:56.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '计算机');
INSERT INTO `cms_article_cat` VALUES ('b4311311-b633-4c93-b348-1ad3673e47f3', 1, NULL, '2021-08-07 01:36:19.224224', NULL, '2021-08-07 01:36:19.224224', NULL, 0, NULL, NULL, 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '全栈');
INSERT INTO `cms_article_cat` VALUES ('d7ee8336-d965-4a4e-9e7b-820392bb3dd8', 1, NULL, '2021-08-07 01:32:56.459408', NULL, '2021-08-07 01:32:56.459408', NULL, 0, NULL, NULL, 'ac31b881-acb5-4134-8e60-68e541ee97e5', '开发');
INSERT INTO `cms_article_cat` VALUES ('e2e75157-7427-43e5-8ff3-73c9aac59919', 1, NULL, '2021-08-17 00:09:07.085447', NULL, '2021-09-01 16:29:56.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目1');
INSERT INTO `cms_article_cat` VALUES ('e7e52bb1-03b1-46d0-8a08-ebf1dfbe8483', 1, NULL, '2021-08-17 00:09:37.990014', NULL, '2021-09-01 15:57:37.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, NULL, '栏目6');

SET FOREIGN_KEY_CHECKS = 1;
