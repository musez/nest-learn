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

 Date: 09/09/2021 10:22:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_group_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_group_permission`;
CREATE TABLE `sys_group_permission`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `groupId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `permissionId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_e3001686fc4022909682c19d6ab`(`groupId`) USING BTREE,
  INDEX `FK_63230064a6608b30ad4ecbbf18f`(`permissionId`) USING BTREE,
  CONSTRAINT `FK_63230064a6608b30ad4ecbbf18f` FOREIGN KEY (`permissionId`) REFERENCES `sys_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_e3001686fc4022909682c19d6ab` FOREIGN KEY (`groupId`) REFERENCES `sys_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_group_permission
-- ----------------------------
INSERT INTO `sys_group_permission` VALUES ('37827c29-2b3b-4d84-b156-f1f45200907d', 'ef439baf-ba10-4662-b394-b91938a256e5', '3dfaeace-3a67-4106-b2d2-a33f630c8ca1');
INSERT INTO `sys_group_permission` VALUES ('885f97f8-d6e4-4ee7-a2ce-0fbf361469d9', 'ef439baf-ba10-4662-b394-b91938a256e5', '736b3334-8d0a-4c17-bd85-daa429a19a37');
INSERT INTO `sys_group_permission` VALUES ('a506bc26-e8b1-415d-a171-7d58a4b86838', 'ef439baf-ba10-4662-b394-b91938a256e5', '9a287221-8da7-455f-a6fe-89ef4969cd48');
INSERT INTO `sys_group_permission` VALUES ('afd353c7-4cf4-4df1-b8f8-24700ed18a11', 'ef439baf-ba10-4662-b394-b91938a256e5', '94c243a8-3cad-4382-bbb0-a0958f462e06');

SET FOREIGN_KEY_CHECKS = 1;
