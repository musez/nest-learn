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

 Date: 18/09/2021 17:49:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
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
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '岗位名称',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES ('2131469d-a86a-407a-93db-cbb9f434c836', 1, '', '2021-08-07 01:22:48.058919', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:48.058919', NULL, 0, NULL, NULL, '产品经理', 0);
INSERT INTO `sys_post` VALUES ('7dfef594-176f-4d2f-962c-30c0541b2526', 1, '', '2021-08-07 01:22:04.349356', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:04.349356', NULL, 0, NULL, NULL, '开发', 0);
INSERT INTO `sys_post` VALUES ('8482cf36-2249-4712-814c-c7c2e3c272fb', 1, '', '2021-08-07 01:22:36.484242', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:36.484242', NULL, 0, NULL, NULL, '项目经理', 0);
INSERT INTO `sys_post` VALUES ('bf20018f-3b08-430b-8aea-56051873e3cb', 1, '', '2021-08-07 01:22:18.468089', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:18.468089', NULL, 0, NULL, NULL, '测试', 0);
INSERT INTO `sys_post` VALUES ('e6463cb3-47f7-4427-a8c2-dfd216b8f4cc', 1, '', '2021-08-07 01:22:11.958332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:11.958332', NULL, 0, NULL, NULL, '运营', 0);

SET FOREIGN_KEY_CHECKS = 1;
