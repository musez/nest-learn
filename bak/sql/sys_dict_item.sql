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

 Date: 09/09/2021 10:21:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dict_item
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE `sys_dict_item`  (
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
  `parentId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '父 id',
  `itemText` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '字典项名称',
  `itemValue` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '字典项值',
  `defaultValue` tinyint(4) NOT NULL COMMENT '默认值（0：否；1：是）',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `dictId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_d3b250cf3cf827b56103cab2f33`(`dictId`) USING BTREE,
  CONSTRAINT `FK_d3b250cf3cf827b56103cab2f33` FOREIGN KEY (`dictId`) REFERENCES `sys_dict` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_item
-- ----------------------------
INSERT INTO `sys_dict_item` VALUES ('05437b01-d8de-44a5-b3cb-da26cae22778', 1, '', '2021-08-07 02:02:35.755356', NULL, '2021-08-07 02:02:35.755356', NULL, 0, NULL, NULL, NULL, '管理员', '1', 0, 0, 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('08154ff5-920d-41d0-b9df-697eedbbc90d', 1, '', '2021-08-22 01:16:42.738568', NULL, '2021-08-22 01:16:42.000000', NULL, 0, NULL, NULL, NULL, '列文虎克', 'lwhk', 0, 1, '4b725da9-ff66-412a-95bc-cf3fdf985fd5');
INSERT INTO `sys_dict_item` VALUES ('0a5652fb-4aba-459e-add8-8e00c5547afc', 1, '', '2021-08-07 02:04:14.453170', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.453170', NULL, 0, NULL, NULL, NULL, '音频', '5', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('0f1eef7b-04d1-4c84-9cb1-c942765e15bc', 1, '', '2021-08-21 14:57:31.052819', NULL, '2021-08-21 02:57:31.000000', NULL, 0, NULL, NULL, NULL, 'article', '0', 0, 0, '84e80ce6-e98e-47b2-a372-35cdcd034e6f');
INSERT INTO `sys_dict_item` VALUES ('0f253952-afed-47a0-839a-0aacea70d0d9', 1, '', '2021-08-07 02:03:05.533324', NULL, '2021-08-07 02:03:05.533324', NULL, 0, NULL, NULL, NULL, '男', '2', 0, 0, '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('16e6ca48-137c-457e-af5f-be5584a32621', 1, '', '2021-08-07 02:04:14.698535', NULL, '2021-08-07 02:04:14.698535', NULL, 0, NULL, NULL, NULL, '视频', '4', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('1a6067ec-0581-41dd-b27e-79f022151683', 1, '', '2021-08-07 02:04:14.611353', NULL, '2021-08-07 02:04:14.611353', NULL, 0, NULL, NULL, NULL, '图片', '2', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('1b001e3f-3218-4ccb-a902-88647e796abc', 1, '', '2021-08-22 01:16:42.688840', NULL, '2021-08-22 01:16:42.000000', NULL, 0, NULL, NULL, NULL, '盗梦空间', 'dmkj', 1, 0, '4b725da9-ff66-412a-95bc-cf3fdf985fd5');
INSERT INTO `sys_dict_item` VALUES ('203a0d19-4d23-47e7-9fb9-2a8b58ff7604', 1, '', '2021-08-07 02:04:14.649841', NULL, '2021-08-07 02:04:14.649841', NULL, 0, NULL, NULL, NULL, '组图', '3', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('301b6540-d27b-453a-b5dd-c2621232e8c3', 1, '', '2021-08-07 02:04:14.712922', NULL, '2021-08-07 02:04:14.712922', NULL, 0, NULL, NULL, NULL, '音频', '5', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('326133c2-d233-43a6-b63a-0efb262c2679', 1, '启用或发布', '2021-08-07 02:01:12.708214', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.708214', NULL, 0, NULL, NULL, NULL, '启用', '1', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('37bc616d-ce97-44d0-813e-73d75f21adce', 1, '', '2021-08-07 02:01:12.970026', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.970026', NULL, 0, NULL, NULL, NULL, '回收站', '3', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('38cef812-a931-4781-9adf-a35e080265da', 1, '', '2021-08-07 02:04:14.296267', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.296267', NULL, 0, NULL, NULL, NULL, '组图', '3', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('40e60724-bb54-4de0-ad6d-11348a196b94', 1, '', '2021-08-07 02:03:05.253818', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.253818', NULL, 0, NULL, NULL, NULL, '女', '1', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('4aafdceb-db70-4daf-8c60-437af19d4d19', 1, '', '2021-08-07 02:01:57.900607', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:57.900607', NULL, 0, NULL, NULL, NULL, '未删除', '0', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('598171e3-f17d-4a97-a6f8-1c96a88adc42', 1, '', '2021-08-07 02:01:13.118536', NULL, '2021-08-07 02:01:13.118536', NULL, 0, NULL, NULL, NULL, '草稿', '2', 0, 0, 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('5d81178b-3281-4e29-b0e0-70d3f430ea50', 1, '', '2021-08-07 02:02:35.453249', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.453249', NULL, 0, NULL, NULL, NULL, '管理员', '1', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('5f5bd5ee-3e9f-4507-992b-de82453cf996', 1, '', '2021-08-07 02:01:12.828760', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.828760', NULL, 0, NULL, NULL, NULL, '草稿', '2', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('6eeab8b1-4776-4774-a625-8ed1e2be18bc', 1, '', '2021-08-07 02:04:14.137122', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.137122', NULL, 0, NULL, NULL, NULL, '链接', '1', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('7060ca10-3793-4d5c-8965-169ad3675558', 1, '', '2021-08-07 02:04:14.390838', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.390838', NULL, 0, NULL, NULL, NULL, '视频', '4', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('70fcac4e-6e37-4ca4-ba57-51aad73fea8d', 1, '', '2021-08-07 02:03:05.499454', NULL, '2021-08-07 02:03:05.499454', NULL, 0, NULL, NULL, NULL, '女', '1', 0, 0, '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('765cc924-a4c3-4373-a9b0-946904509278', 1, '禁用或未发布', '2021-08-07 02:01:13.069079', NULL, '2021-08-07 02:01:13.069079', NULL, 0, NULL, NULL, NULL, '禁用', '0', 0, 0, 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('76d819da-a4fa-4fd4-8e83-bd0bb5f7026a', 1, '', '2021-08-07 02:03:05.445580', NULL, '2021-08-07 02:03:05.445580', NULL, 0, NULL, NULL, NULL, '保密', '0', 0, 0, '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('83228b8a-4053-445e-b60a-7485c4f7ec00', 1, '启用或发布', '2021-08-07 02:01:13.100108', NULL, '2021-08-07 02:01:13.100108', NULL, 0, NULL, NULL, NULL, '启用', '1', 0, 0, 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('83809831-7ddb-4ade-aa19-176650fe8e93', 1, '', '2021-08-07 02:03:05.119061', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.119061', NULL, 0, NULL, NULL, NULL, '保密', '0', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('8b80ef5e-3785-4c73-bc1e-de7acc983430', 1, '', '2021-08-07 02:04:14.236696', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.236696', NULL, 0, NULL, NULL, NULL, '图片', '2', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('90d4a1e0-51a4-4f15-b65f-2ac2ef21014a', 1, '', '2021-08-07 02:04:13.956155', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:13.956155', NULL, 0, NULL, NULL, NULL, '文本', '0', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('9c79c318-e4a5-486e-b6b6-e86a469e85ad', 1, '', '2021-08-07 02:02:35.767081', NULL, '2021-08-07 02:02:35.767081', NULL, 0, NULL, NULL, NULL, '超级管理员', '2', 0, 0, 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('a2b2e744-fc81-4016-be0a-3e624aba73a6', 1, '', '2021-08-07 02:04:14.552966', NULL, '2021-08-07 02:04:14.552966', NULL, 0, NULL, NULL, NULL, '文本', '0', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('ae909cda-4a8b-4e2e-8c26-e8026be545b6', 1, '', '2021-08-07 02:01:13.151168', NULL, '2021-08-07 02:01:13.151168', NULL, 0, NULL, NULL, NULL, '回收站', '3', 0, 0, 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('b27d8851-c76e-4210-82f4-c21201ec5a8e', 0, '', '2021-08-22 01:16:42.389964', '62310947-7b54-45c8-a5da-19837f2541a4', '2021-08-22 01:16:42.389964', NULL, 0, NULL, NULL, NULL, '盗梦空间', 'dmkj', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('c7f903e7-30cb-4b8d-99d9-aaad020f42e6', 1, '', '2021-08-22 01:16:42.524031', '62310947-7b54-45c8-a5da-19837f2541a4', '2021-08-22 01:16:42.524031', NULL, 0, NULL, NULL, NULL, '列文虎克', 'lwhk', 0, 1, NULL);
INSERT INTO `sys_dict_item` VALUES ('cd874bba-de55-4522-b80b-f2aa26f1156c', 1, '', '2021-08-07 02:02:35.734147', NULL, '2021-08-07 02:02:35.734147', NULL, 0, NULL, NULL, NULL, '普通用户', '0', 0, 0, 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('d1a36917-175b-4a10-9d55-268a6d7ed987', 1, '', '2021-08-07 02:01:58.137991', NULL, '2021-08-07 02:01:58.137991', NULL, 0, NULL, NULL, NULL, '未删除', '0', 0, 0, '2d0cb100-4b1b-48ef-8b1c-57429bac5e8c');
INSERT INTO `sys_dict_item` VALUES ('d3e2e0cc-f1e2-4749-914c-f267db2c211d', 1, '', '2021-08-07 02:01:58.039578', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:58.039578', NULL, 0, NULL, NULL, NULL, '删除', '1', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('e76f51a8-954d-47ba-889c-a73f64bb6fd0', 1, '', '2021-08-07 02:04:14.593432', NULL, '2021-08-07 02:04:14.593432', NULL, 0, NULL, NULL, NULL, '链接', '1', 0, 0, '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('ee14147c-0535-4a4e-9a5c-5333dc353f3a', 1, '', '2021-08-07 02:03:05.348345', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.348345', NULL, 0, NULL, NULL, NULL, '男', '2', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('ee730406-f4ce-4a94-ab04-2a9cbc3cfdc5', 1, '禁用或未发布', '2021-08-07 02:01:12.583524', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.583524', NULL, 0, NULL, NULL, NULL, '禁用', '0', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('f7c9cb5b-1423-47fe-9734-5eb9dc163440', 1, '', '2021-08-21 14:57:30.700678', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-21 14:57:30.700678', NULL, 0, NULL, NULL, NULL, 'article', '0', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('fa1764d9-7a9b-4eaf-aca8-d95e7d409181', 1, '', '2021-08-07 02:02:35.605572', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.605572', NULL, 0, NULL, NULL, NULL, '超级管理员', '2', 0, 0, NULL);
INSERT INTO `sys_dict_item` VALUES ('fa32a75c-d095-4b64-9756-a60890f6f58d', 1, '', '2021-08-07 02:01:58.234676', NULL, '2021-08-07 02:01:58.234676', NULL, 0, NULL, NULL, NULL, '删除', '1', 0, 0, '2d0cb100-4b1b-48ef-8b1c-57429bac5e8c');
INSERT INTO `sys_dict_item` VALUES ('fef8bb62-7663-490c-beb9-8f0b59431063', 1, '', '2021-08-07 02:02:35.358522', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.358522', NULL, 0, NULL, NULL, NULL, '普通用户', '0', 0, 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;
