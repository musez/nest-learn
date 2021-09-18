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

 Date: 18/09/2021 17:45:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
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
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('26622aaf-bfa4-460e-a88b-d133ba10d01e', 0, '', '2021-08-07 00:53:48.222151', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:53:48.222151', NULL, 0, NULL, NULL, '普通管理员');
INSERT INTO `sys_role` VALUES ('424185b8-06df-43bf-b9f9-1e1cecf1a9ec', 1, '', '2021-08-07 00:54:45.058381', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:45.058381', NULL, 0, NULL, NULL, '宣传运营');
INSERT INTO `sys_role` VALUES ('983fea12-af42-4c00-a5d7-053614ca0a5c', 1, '', '2021-08-07 00:54:09.555852', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:09.555852', NULL, 0, NULL, NULL, '管理端用户');
INSERT INTO `sys_role` VALUES ('c11cf8fb-d40b-4acc-becf-3eb7a92fa477', 1, '', '2021-08-07 00:54:21.593555', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:21.593555', NULL, 0, NULL, NULL, '客户端用户');
INSERT INTO `sys_role` VALUES ('cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 1, '', '2021-08-07 00:53:13.754279', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:53:13.754279', NULL, 0, NULL, NULL, '超级管理员');
INSERT INTO `sys_role` VALUES ('d4a7ab71-d161-424d-96da-2bca8c80ed7c', 1, '', '2021-08-07 00:54:55.148290', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:55.148290', NULL, 0, NULL, NULL, '营销运营');

SET FOREIGN_KEY_CHECKS = 1;
