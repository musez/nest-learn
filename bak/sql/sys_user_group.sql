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

 Date: 09/09/2021 10:23:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_group`;
CREATE TABLE `sys_user_group`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `groupId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_f92a05dbbb9215840ac2e7d4519`(`userId`) USING BTREE,
  INDEX `FK_6cf060e653685eda54fb44af8d4`(`groupId`) USING BTREE,
  CONSTRAINT `FK_6cf060e653685eda54fb44af8d4` FOREIGN KEY (`groupId`) REFERENCES `sys_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_f92a05dbbb9215840ac2e7d4519` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_group
-- ----------------------------
INSERT INTO `sys_user_group` VALUES ('148dc66f-0c0e-47b6-80a9-2d6837577645', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('537c5612-8dd2-4e70-bdeb-611137a6fe6b', 'd42d636b-cd41-4514-88e8-97ce499d4c32', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('977753c0-d0fd-42d3-99ab-663243f48586', '62310947-7b54-45c8-a5da-19837f2541a4', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('b499f632-dd40-4997-8492-0f1c7f91d0e2', '518e81b2-0bda-4729-be21-d25c94a424ff', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('e853ffcc-4fa3-4eff-95b9-29e1d0ec0a3c', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '0950c980-ab23-4244-8e0f-ce70e9628e13');

SET FOREIGN_KEY_CHECKS = 1;
