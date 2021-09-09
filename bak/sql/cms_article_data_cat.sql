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

 Date: 09/09/2021 10:21:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cms_article_data_cat
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_data_cat`;
CREATE TABLE `cms_article_data_cat`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `articleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `catId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_0443eef44f7502a44610725b751`(`articleId`) USING BTREE,
  INDEX `FK_47ff4ec17cce44dfe7b56d4ac07`(`catId`) USING BTREE,
  CONSTRAINT `FK_0443eef44f7502a44610725b751` FOREIGN KEY (`articleId`) REFERENCES `cms_article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_47ff4ec17cce44dfe7b56d4ac07` FOREIGN KEY (`catId`) REFERENCES `cms_article_cat` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cms_article_data_cat
-- ----------------------------
INSERT INTO `cms_article_data_cat` VALUES ('217b9d3b-535e-4544-a32a-bd327a7334ff', '0a4e9f0b-9599-446b-a956-00bea0d19d0f', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('22198e93-9804-42b3-9ccf-3b7a95d49038', 'bdf078c5-bb0f-42b3-8317-1a06792fa1ee', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('24a451e8-9c06-4902-a899-5c796f3d2c02', '16eda59a-2953-453b-aac0-0bba030d57c6', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('440a705a-b4c8-4901-a289-765ffd3cfbd0', 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', '1527bffa-33e5-43a4-a51e-8c6cf77a7afc');
INSERT INTO `cms_article_data_cat` VALUES ('48e2347a-0b4a-47b0-81cf-29601615f97f', '0bc92a85-5f18-41df-9c2c-7c8fdfff3a62', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('6fea4807-ea19-4801-a9e2-4c898db63810', 'c9516241-7bc2-4b1b-a444-7419021903b6', 'b4311311-b633-4c93-b348-1ad3673e47f3');
INSERT INTO `cms_article_data_cat` VALUES ('9bc0145c-9332-4cbe-a1e6-7e285780ca6e', '357bc0ac-b8aa-4f62-960e-83ba07e5e45a', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('a06f1640-aff8-4c12-8ba6-84695ec28015', '90caa2d6-2194-49be-8108-01860297fcaa', '1527bffa-33e5-43a4-a51e-8c6cf77a7afc');
INSERT INTO `cms_article_data_cat` VALUES ('a29245f1-f792-466f-b67d-7750bf4d59bf', '67bf1bb4-7281-48b0-835c-7e727991f5de', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('b95b6c27-7ba2-4a97-9949-7fd7bd188b1f', '021f83c3-968d-4d45-8ab7-bc7104a71a75', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('d3d2232f-ba38-46de-b12a-878816b2fb60', '90caa2d6-2194-49be-8108-01860297fcaa', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('f11533a7-3986-4820-b84a-da513c988b76', '7483bae5-ce55-48fe-afc6-d14a13a20ad1', '8624221c-f185-47b7-b426-4dee8e6d9502');

SET FOREIGN_KEY_CHECKS = 1;
