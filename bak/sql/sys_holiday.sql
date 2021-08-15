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

 Date: 15/08/2021 16:19:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_holiday
-- ----------------------------
DROP TABLE IF EXISTS `sys_holiday`;
CREATE TABLE `sys_holiday`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '状态（0：禁用；1：启用）',
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '描述',
  `createTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT 0 COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `date` date NOT NULL COMMENT '日期',
  `weekday` tinyint(4) NULL DEFAULT NULL COMMENT '周几（1：一；2：二；3：三；4：四；5：五；6：六；0：日）',
  `restType` tinyint(4) NULL DEFAULT NULL COMMENT '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_holiday
-- ----------------------------
INSERT INTO `sys_holiday` VALUES ('017c0353-ea80-4f20-94d0-0ffce9e556f6', 1, NULL, '2021-08-15 14:31:54.354186', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.354186', NULL, 0, NULL, NULL, '劳动节', '2021-05-03', 1, 1);
INSERT INTO `sys_holiday` VALUES ('0af393ab-adb7-4d23-b248-08ee0528b419', 1, NULL, '2021-08-15 14:31:53.941941', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.941941', NULL, 0, NULL, NULL, '清明节', '2021-04-05', 1, 1);
INSERT INTO `sys_holiday` VALUES ('3494bbee-0bdc-42d2-85c8-2001269ea5c1', 1, NULL, '2021-08-15 14:31:54.923892', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:30:25.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '中秋节', '2021-09-20', 1, 1);
INSERT INTO `sys_holiday` VALUES ('3c314619-22c0-4ba6-87ea-24f2e49ed359', 1, NULL, '2021-08-15 14:31:54.390009', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.390009', NULL, 0, NULL, NULL, '劳动节', '2021-05-04', 2, 1);
INSERT INTO `sys_holiday` VALUES ('3cdd6a96-e337-484c-b4b4-4d54ad01a6a5', 1, NULL, '2021-08-15 14:31:54.591441', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.591441', NULL, 0, NULL, NULL, '劳动节', '2021-05-08', 6, 2);
INSERT INTO `sys_holiday` VALUES ('3d56e02e-2e7e-4a12-870f-ca45984e2800', 1, NULL, '2021-08-15 14:31:54.433557', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.433557', NULL, 0, NULL, NULL, '劳动节', '2021-05-05', 3, 1);
INSERT INTO `sys_holiday` VALUES ('3da22eb7-5731-449a-9e53-1e033f5a8df1', 1, NULL, '2021-08-15 14:31:54.642790', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.642790', NULL, 0, NULL, NULL, '端午节', '2021-06-12', 6, 1);
INSERT INTO `sys_holiday` VALUES ('3eb3def4-be24-4fcf-b9c3-72520b9f1992', 1, NULL, '2021-08-15 14:31:55.139828', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:52.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '国庆节', '2021-10-01', 5, 1);
INSERT INTO `sys_holiday` VALUES ('443a881a-2b61-4a6d-9095-789149f49e53', 1, NULL, '2021-08-15 14:31:55.196215', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:55.196215', NULL, 0, NULL, NULL, '国庆节', '2021-10-03', 0, 1);
INSERT INTO `sys_holiday` VALUES ('4ad8323b-9568-427d-a837-8f97a571b95b', 1, NULL, '2021-08-15 14:31:53.153940', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:24:01.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '元旦', '2021-01-02', 6, 1);
INSERT INTO `sys_holiday` VALUES ('51b79f51-aec6-41dd-bdd6-a81fca6a8f34', 1, NULL, '2021-08-15 14:31:54.967390', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:06.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '中秋节', '2021-09-21', 2, 1);
INSERT INTO `sys_holiday` VALUES ('5cb5f32f-698c-4a19-8924-be003e2518bb', 1, NULL, '2021-08-15 14:31:53.456015', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:27:04.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-13', 6, 1);
INSERT INTO `sys_holiday` VALUES ('63bd7a29-44ae-4049-a787-09e5a15808f5', 1, NULL, '2021-08-15 14:31:53.599506', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:26.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-14', 0, 1);
INSERT INTO `sys_holiday` VALUES ('64c214d1-ecb3-4d72-8c2f-d4aedd88f836', 1, NULL, '2021-08-15 14:31:53.248481', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:26:15.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '元旦', '2021-01-03', 0, 1);
INSERT INTO `sys_holiday` VALUES ('65017674-71a3-411a-a0e9-a34fcdb8b3a1', 1, NULL, '2021-08-15 14:31:54.881219', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:30:05.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '中秋节', '2021-09-19', 0, 1);
INSERT INTO `sys_holiday` VALUES ('795b3c6e-b6e6-4389-9be9-706876263c68', 1, NULL, '2021-08-15 14:31:54.269563', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:29:57.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '劳动节', '2021-05-02', 0, 1);
INSERT INTO `sys_holiday` VALUES ('799a4557-6048-48c2-afd6-c6bd301f82f6', 1, NULL, '2021-08-15 14:31:53.908590', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.908590', NULL, 0, NULL, NULL, '清明节', '2021-04-04', 0, 1);
INSERT INTO `sys_holiday` VALUES ('8114e68d-9e18-414c-a987-2db7eea8c10c', 1, NULL, '2021-08-15 14:31:53.772836', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.772836', NULL, 0, NULL, NULL, '春节', '2021-02-20', 6, 2);
INSERT INTO `sys_holiday` VALUES ('86e3d9b1-7139-4268-bc93-3059d0a5f992', 1, NULL, '2021-08-15 14:31:53.694451', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.694451', NULL, 0, NULL, NULL, '春节', '2021-02-17', 3, 1);
INSERT INTO `sys_holiday` VALUES ('965b9cee-5bfc-4802-baed-6c10dcc59ca6', 1, NULL, '2021-08-15 14:31:55.405719', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:55.405719', NULL, 0, NULL, NULL, '国庆节', '2021-10-06', 3, 1);
INSERT INTO `sys_holiday` VALUES ('9a5c5aa9-d674-4fb5-a72d-abd1a21f02cb', 1, NULL, '2021-08-15 14:31:55.376040', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:55.376040', NULL, 0, NULL, NULL, '国庆节', '2021-10-05', 2, 1);
INSERT INTO `sys_holiday` VALUES ('a12ea07f-0524-4c72-aacc-8619ed8ba9f3', 1, NULL, '2021-08-15 14:31:53.660795', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:34.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-16', 2, 1);
INSERT INTO `sys_holiday` VALUES ('a4622e79-794c-4fc5-8f40-4d0a32ae7bd9', 1, NULL, '2021-08-15 14:31:53.385607', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:13.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-11', 4, 1);
INSERT INTO `sys_holiday` VALUES ('a5c2fcc5-c350-498d-b7ad-16bdc402f694', 1, NULL, '2021-08-15 14:31:55.339028', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:55.339028', NULL, 0, NULL, NULL, '国庆节', '2021-10-04', 1, 1);
INSERT INTO `sys_holiday` VALUES ('a88ffe4c-bc6b-4cb9-ae36-69e64924eaa6', 1, NULL, '2021-08-15 14:31:52.852055', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:25:52.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '元旦', '2021-01-01', 5, 1);
INSERT INTO `sys_holiday` VALUES ('aae3a2a6-045a-40f8-826f-959066baac7a', 1, NULL, '2021-08-15 14:31:55.110522', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:55.110522', NULL, 0, NULL, NULL, '国庆节', '2021-09-26', 0, 2);
INSERT INTO `sys_holiday` VALUES ('af633061-4ee4-4de9-affe-d7933efc2130', 1, NULL, '2021-08-15 14:31:55.441708', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:29:03.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '国庆节', '2021-10-07', 4, 1);
INSERT INTO `sys_holiday` VALUES ('b3adc1c1-279b-4328-8028-062ba865a1ee', 1, NULL, '2021-08-15 14:31:54.705810', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.705810', NULL, 0, NULL, NULL, '端午节', '2021-06-14', 1, 1);
INSERT INTO `sys_holiday` VALUES ('b92bf47d-12f8-4057-aed3-f4d3247e6bc9', 1, NULL, '2021-08-15 14:31:53.357590', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:26:25.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-07', 0, 2);
INSERT INTO `sys_holiday` VALUES ('c03f3bae-d603-455f-945e-0c5461d60570', 1, NULL, '2021-08-15 14:31:54.844545', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.844545', NULL, 0, NULL, NULL, '中秋节', '2021-09-18', 6, 2);
INSERT INTO `sys_holiday` VALUES ('c2d9b573-cd02-40d3-a501-52fd45f20625', 1, NULL, '2021-08-15 14:31:55.632599', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:26:56.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '国庆节', '2021-10-09', 6, 2);
INSERT INTO `sys_holiday` VALUES ('d1a795b2-98ac-43da-b7bc-fe8b96cf5f3d', 1, NULL, '2021-08-15 14:31:54.674159', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.674159', NULL, 0, NULL, NULL, '端午节', '2021-06-13', 0, 1);
INSERT INTO `sys_holiday` VALUES ('e4ef04fa-0f84-4309-b6a9-2a0a245a112a', 1, NULL, '2021-08-15 14:31:53.970199', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.970199', NULL, 0, NULL, NULL, '劳动节', '2021-04-25', 0, 2);
INSERT INTO `sys_holiday` VALUES ('ea4f282f-d502-437f-b38d-97d9dab9b94d', 1, NULL, '2021-08-15 14:31:53.425321', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:28:20.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-12', 5, 1);
INSERT INTO `sys_holiday` VALUES ('f085046c-c8f8-48b4-9597-baf8464530bc', 1, NULL, '2021-08-15 14:31:53.862978', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:53.862978', NULL, 0, NULL, NULL, '清明节', '2021-04-03', 6, 1);
INSERT INTO `sys_holiday` VALUES ('f3a0971b-2b5e-444e-bed5-b0edf6c45c00', 1, NULL, '2021-08-15 14:31:55.173801', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:29:18.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '国庆节', '2021-10-02', 6, 1);
INSERT INTO `sys_holiday` VALUES ('f589a5a4-8a3b-4f95-a63f-560f5675c1cf', 1, NULL, '2021-08-15 14:31:53.633712', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 15:27:11.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 0, NULL, NULL, '春节', '2021-02-15', 1, 1);
INSERT INTO `sys_holiday` VALUES ('fa52302f-6eea-48df-b55c-c47132aa7773', 1, NULL, '2021-08-15 14:31:54.171525', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-15 14:31:54.171525', NULL, 0, NULL, NULL, '劳动节', '2021-05-01', 6, 1);

SET FOREIGN_KEY_CHECKS = 1;
