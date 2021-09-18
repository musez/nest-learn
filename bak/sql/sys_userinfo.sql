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

 Date: 18/09/2021 17:42:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `sys_userinfo`;
CREATE TABLE `sys_userinfo`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `provinceId` int(11) NULL DEFAULT NULL COMMENT '省份',
  `cityId` int(11) NULL DEFAULT NULL COMMENT '城市',
  `districtId` int(11) NULL DEFAULT NULL COMMENT '区/县',
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '详细地址',
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_30c0bea662a051d2b8d548c3fb`(`userId`) USING BTREE,
  CONSTRAINT `FK_30c0bea662a051d2b8d548c3fbe` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_userinfo
-- ----------------------------
INSERT INTO `sys_userinfo` VALUES ('3decefdb-983e-45a9-8245-78e6dece63d1', NULL, NULL, NULL, NULL, '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16');
INSERT INTO `sys_userinfo` VALUES ('3ee10b75-e9b2-4dc1-9f96-7d2e000098b0', 1681, 1726, 1728, NULL, 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_userinfo` VALUES ('4fdff423-406a-4472-9a1d-7139eae22c6e', NULL, NULL, NULL, NULL, '053f07e2-678e-4446-a413-9dc87b33bc9f');
INSERT INTO `sys_userinfo` VALUES ('581bc866-9862-47fd-8a7b-c20e55b24dfa', NULL, NULL, NULL, NULL, '504b252b-5f4a-434e-a85d-cce0447871ed');
INSERT INTO `sys_userinfo` VALUES ('6075b214-5660-4f8d-98c6-8b97ac93298d', NULL, NULL, NULL, NULL, '15e0aa5a-bfab-4b73-afc0-0225ad7e937a');
INSERT INTO `sys_userinfo` VALUES ('75a9f148-bad7-406f-83fb-e4fd2a57c27d', NULL, NULL, NULL, NULL, '312a72da-eaa9-48d8-9192-a909ea295505');
INSERT INTO `sys_userinfo` VALUES ('7aac100e-9e4a-44e5-ab1e-2e06b0cd76b2', 1681, 1682, 1689, '关东街道曙光星城', '518e81b2-0bda-4729-be21-d25c94a424ff');
INSERT INTO `sys_userinfo` VALUES ('7dfc9ee1-f0ad-4690-b9a0-6a3d1db82b89', NULL, NULL, NULL, NULL, '6f8eff2e-8498-47cd-b3c8-695b7edd2bf6');
INSERT INTO `sys_userinfo` VALUES ('8e97b025-66c0-44c2-a6b3-f5f00dbaa3b9', NULL, NULL, NULL, NULL, '62310947-7b54-45c8-a5da-19837f2541a4');
INSERT INTO `sys_userinfo` VALUES ('b5cfcb62-e5d4-4a44-b47f-7abdd8c5b808', NULL, NULL, NULL, NULL, '43bbcd71-d17b-49f3-82a9-22aa816e2ad9');
INSERT INTO `sys_userinfo` VALUES ('c22760a1-5cc6-48ec-af83-f0b39f41ae76', NULL, NULL, NULL, NULL, 'e662387f-f7c8-4aee-b029-c7d5ff51474a');

SET FOREIGN_KEY_CHECKS = 1;
