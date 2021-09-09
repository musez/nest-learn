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

 Date: 09/09/2021 10:23:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `roleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_3c879483a655a9387b8c4876085`(`userId`) USING BTREE,
  INDEX `FK_3ec9b31612c830bf0221b9e7f36`(`roleId`) USING BTREE,
  CONSTRAINT `FK_3c879483a655a9387b8c4876085` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_3ec9b31612c830bf0221b9e7f36` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES ('1591d72a-d14b-4a84-abb8-04a809a7d66b', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '983fea12-af42-4c00-a5d7-053614ca0a5c');

SET FOREIGN_KEY_CHECKS = 1;
