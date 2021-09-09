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

 Date: 09/09/2021 10:23:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user_address
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_address`;
CREATE TABLE `sys_user_address`  (
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
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '姓名',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `sex` tinyint(4) NULL DEFAULT 0 COMMENT '性别（0：保密；1：男；2：女）',
  `provinceId` int(11) NULL DEFAULT NULL COMMENT '省份',
  `cityId` int(11) NULL DEFAULT NULL COMMENT '城市',
  `districtId` int(11) NULL DEFAULT NULL COMMENT '区/县',
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '详细地址',
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_18ae11f917ae18ab46bb1e1781`(`userId`) USING BTREE,
  CONSTRAINT `FK_18ae11f917ae18ab46bb1e17816` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_address
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
