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

 Date: 09/09/2021 10:23:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
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
  `userName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `userPwd` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `userType` tinyint(4) NOT NULL DEFAULT 0 COMMENT '用户类型（0：普通用户；1：管理员；2：超级管理员；）',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '姓名',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `sex` tinyint(4) NULL DEFAULT 0 COMMENT '性别（0：保密；1：男；2：女）',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `loginTime` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `loginCount` int(11) NULL DEFAULT 0 COMMENT '登录次数',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_f6a2048fab3882df93b31edfa2`(`userName`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 1, NULL, '2021-08-16 23:42:37.889220', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:54:57.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 1, '2021-09-01 07:54:57', '62310947-7b54-45c8-a5da-19837f2541a4', 'kelan', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, '柯南', NULL, NULL, 0, NULL, '2021-09-01 15:54:57', 0);
INSERT INTO `sys_user` VALUES ('053f07e2-678e-4446-a413-9dc87b33bc9f', 1, NULL, '2021-08-16 23:41:36.749765', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-16 23:41:36.749765', NULL, 0, NULL, NULL, 'liuw', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, 'liuw', NULL, NULL, 0, NULL, '2021-08-16 23:41:36', 0);
INSERT INTO `sys_user` VALUES ('15e0aa5a-bfab-4b73-afc0-0225ad7e937a', 1, NULL, '2021-08-16 23:45:44.750712', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-21 13:11:22.000000', NULL, 1, '2021-08-21 05:11:22', '518e81b2-0bda-4729-be21-d25c94a424ff', 'qiaol', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, '乔苓', NULL, NULL, 0, NULL, '2021-09-01 16:36:44', 0);
INSERT INTO `sys_user` VALUES ('312a72da-eaa9-48d8-9192-a909ea295505', 1, NULL, '2021-08-16 23:41:26.018730', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-16 23:41:26.018730', NULL, 0, NULL, NULL, 'chenx', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, 'chenx', NULL, NULL, 0, NULL, '2021-08-16 23:41:26', 0);
INSERT INTO `sys_user` VALUES ('43bbcd71-d17b-49f3-82a9-22aa816e2ad9', 1, NULL, '2021-08-16 23:43:42.401080', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:54:51.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 1, '2021-09-01 07:54:51', '62310947-7b54-45c8-a5da-19837f2541a4', 'luguang', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, '陆光', NULL, NULL, 0, NULL, '2021-09-01 16:36:44', 0);
INSERT INTO `sys_user` VALUES ('504b252b-5f4a-434e-a85d-cce0447871ed', 1, NULL, '2021-08-16 23:43:01.984284', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-23 20:45:02.000000', NULL, 1, '2021-08-23 12:45:02', '62310947-7b54-45c8-a5da-19837f2541a4', 'chengxs', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, '程小时', NULL, NULL, 0, NULL, '2021-08-23 20:45:02', 0);
INSERT INTO `sys_user` VALUES ('518e81b2-0bda-4729-be21-d25c94a424ff', 1, NULL, '2021-08-07 00:40:19.358524', NULL, '2021-08-31 18:11:11.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'wangyue', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 2, '王小月', '15172501111', '15172501111@qq.com', 0, NULL, '2021-09-01 16:36:44', 37);
INSERT INTO `sys_user` VALUES ('62310947-7b54-45c8-a5da-19837f2541a4', 1, NULL, '2021-08-07 12:34:03.510161', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-02 13:41:04.000000', NULL, 0, NULL, NULL, 'admin', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 2, '超级管理员', NULL, NULL, 0, NULL, '2021-09-02 13:41:04', 16);
INSERT INTO `sys_user` VALUES ('6f8eff2e-8498-47cd-b3c8-695b7edd2bf6', 1, NULL, '2021-08-16 23:41:50.872183', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:54:57.000000', NULL, 1, '2021-09-01 07:54:57', '62310947-7b54-45c8-a5da-19837f2541a4', 'pengyz', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, 'pengyz', NULL, NULL, 0, NULL, '2021-09-01 15:54:57', 0);
INSERT INTO `sys_user` VALUES ('a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', 1, NULL, '2021-08-06 23:22:01.374500', NULL, '2021-09-01 15:41:28.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 1, '2021-09-01 07:41:28', '62310947-7b54-45c8-a5da-19837f2541a4', 'chengmz', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 2, '小卓', NULL, NULL, 0, NULL, '2021-09-01 16:36:44', 0);
INSERT INTO `sys_user` VALUES ('d42d636b-cd41-4514-88e8-97ce499d4c32', 1, NULL, '2021-08-06 23:19:53.818955', NULL, '2021-08-16 23:40:36.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, 'wangy', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 2, '王小月', NULL, NULL, 0, NULL, '2021-09-01 16:36:44', 1);
INSERT INTO `sys_user` VALUES ('e662387f-f7c8-4aee-b029-c7d5ff51474a', 1, NULL, '2021-08-16 23:42:23.526314', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-21 13:11:38.000000', NULL, 1, '2021-08-21 05:11:38', '518e81b2-0bda-4729-be21-d25c94a424ff', 'zoum', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', 0, 'zoum', NULL, NULL, 0, NULL, '2021-08-21 13:11:38', 0);

SET FOREIGN_KEY_CHECKS = 1;
