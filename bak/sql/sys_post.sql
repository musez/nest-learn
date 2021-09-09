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

 Date: 09/09/2021 10:22:55
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
INSERT INTO `sys_post` VALUES ('054e46b3-0f67-4e14-9d07-7b37bd68ce18', 0, '', '2021-08-16 23:59:17.836777', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 02:01:05.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位2', 0);
INSERT INTO `sys_post` VALUES ('2131469d-a86a-407a-93db-cbb9f434c836', 1, '', '2021-08-07 01:22:48.058919', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:48.058919', NULL, 0, NULL, NULL, '产品经理', 0);
INSERT INTO `sys_post` VALUES ('35a92938-cb3f-418e-857a-7bf99e1c9312', 1, '', '2021-08-16 23:59:24.083974', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 16:30:22.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位3', 0);
INSERT INTO `sys_post` VALUES ('48831999-3392-4793-abcf-700e4e110f4e', 1, '', '2021-08-17 00:00:27.661364', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 16:30:19.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位6', 0);
INSERT INTO `sys_post` VALUES ('6c2b01f5-5a45-425a-9d09-6dd47ae1c3f7', 1, '', '2021-08-17 00:00:21.614330', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 16:30:20.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位5', 0);
INSERT INTO `sys_post` VALUES ('7ce671c3-69c3-4139-99a8-e2436da2e6a0', 0, '', '2021-08-17 00:00:41.004451', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:11.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:11', '62310947-7b54-45c8-a5da-19837f2541a4', '岗位8', 0);
INSERT INTO `sys_post` VALUES ('7dfef594-176f-4d2f-962c-30c0541b2526', 1, '', '2021-08-07 01:22:04.349356', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:04.349356', NULL, 0, NULL, NULL, '开发', 0);
INSERT INTO `sys_post` VALUES ('8482cf36-2249-4712-814c-c7c2e3c272fb', 1, '', '2021-08-07 01:22:36.484242', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:36.484242', NULL, 0, NULL, NULL, '项目经理', 0);
INSERT INTO `sys_post` VALUES ('84ecb19f-93bf-44db-be36-16259f48f479', 1, '', '2021-08-17 00:00:15.634700', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 16:30:20.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位4', 0);
INSERT INTO `sys_post` VALUES ('aba2f2e7-7746-4b7c-9e16-76b47832e06e', 0, '', '2021-08-17 00:00:54.253363', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:06.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, '2021-09-01 07:57:06', '62310947-7b54-45c8-a5da-19837f2541a4', '岗位10', 0);
INSERT INTO `sys_post` VALUES ('ac8a6d78-6e2b-4c83-a885-1f26ba7ecd17', 1, '', '2021-08-17 00:00:33.960486', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 16:30:19.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位7', 0);
INSERT INTO `sys_post` VALUES ('bf20018f-3b08-430b-8aea-56051873e3cb', 1, '', '2021-08-07 01:22:18.468089', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:18.468089', NULL, 0, NULL, NULL, '测试', 0);
INSERT INTO `sys_post` VALUES ('d6bf6ed0-7120-4b4c-b0f7-cfb7cc572b6a', 0, '', '2021-08-17 00:00:48.195387', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-09-01 15:57:11.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, '2021-09-01 07:57:11', '62310947-7b54-45c8-a5da-19837f2541a4', '岗位9', 0);
INSERT INTO `sys_post` VALUES ('e3d20f25-c975-49cb-893a-3e3576f79dfc', 0, '', '2021-08-16 23:59:11.778626', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-22 02:01:06.000000', '62310947-7b54-45c8-a5da-19837f2541a4', 0, NULL, NULL, '岗位1', 0);
INSERT INTO `sys_post` VALUES ('e6463cb3-47f7-4427-a8c2-dfd216b8f4cc', 1, '', '2021-08-07 01:22:11.958332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:11.958332', NULL, 0, NULL, NULL, '运营', 0);

SET FOREIGN_KEY_CHECKS = 1;
