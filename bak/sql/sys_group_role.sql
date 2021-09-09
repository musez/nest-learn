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

 Date: 09/09/2021 10:22:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_group_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_group_role`;
CREATE TABLE `sys_group_role`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `groupId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `roleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_db3609e0b29fc26d93abc69e4df`(`groupId`) USING BTREE,
  INDEX `FK_064c66c3c1a2f8fe7ed4b42dff8`(`roleId`) USING BTREE,
  CONSTRAINT `FK_064c66c3c1a2f8fe7ed4b42dff8` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_db3609e0b29fc26d93abc69e4df` FOREIGN KEY (`groupId`) REFERENCES `sys_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_group_role
-- ----------------------------
INSERT INTO `sys_group_role` VALUES ('0122cfd6-6034-409e-a787-da101b88ab99', 'c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', '983fea12-af42-4c00-a5d7-053614ca0a5c');
INSERT INTO `sys_group_role` VALUES ('228adb4b-1cbf-4e29-be5b-c1a429cec08b', 'c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', 'c11cf8fb-d40b-4acc-becf-3eb7a92fa477');
INSERT INTO `sys_group_role` VALUES ('78b9e52b-0bec-45bf-93d4-32dd61f335ae', '0950c980-ab23-4244-8e0f-ce70e9628e13', '26622aaf-bfa4-460e-a88b-d133ba10d01e');
INSERT INTO `sys_group_role` VALUES ('88b90000-45f2-4bf3-b027-5fbdbe2722e1', '0950c980-ab23-4244-8e0f-ce70e9628e13', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab');
INSERT INTO `sys_group_role` VALUES ('df6a83ce-0810-45f3-8b12-795dac80382b', 'ef439baf-ba10-4662-b394-b91938a256e5', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c');

SET FOREIGN_KEY_CHECKS = 1;
