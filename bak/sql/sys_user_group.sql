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

 Date: 18/09/2021 17:46:03
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
INSERT INTO `sys_user_group` VALUES ('20cb55d3-a2a2-474a-bbe4-0a05e6b1bbe5', '62310947-7b54-45c8-a5da-19837f2541a4', 'ef439baf-ba10-4662-b394-b91938a256e5');
INSERT INTO `sys_user_group` VALUES ('7c8a7411-782b-47d0-a543-367e1c137ce8', '62310947-7b54-45c8-a5da-19837f2541a4', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('afcd1500-24d7-459b-9513-34b246c94fc7', '62310947-7b54-45c8-a5da-19837f2541a4', 'c61ecdb2-ca08-4bfd-afbe-8a86ea53f438');
INSERT INTO `sys_user_group` VALUES ('b499f632-dd40-4997-8492-0f1c7f91d0e2', '518e81b2-0bda-4729-be21-d25c94a424ff', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('c470ab20-91f3-46a7-b851-ccc41b674e40', '62310947-7b54-45c8-a5da-19837f2541a4', '0078b5ce-ba44-45c8-9a02-142d085cb311');

SET FOREIGN_KEY_CHECKS = 1;
