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

 Date: 09/09/2021 10:23:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_permission`;
CREATE TABLE `sys_user_permission`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `permissionId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_1e938b9c442d384f6732cb7471d`(`userId`) USING BTREE,
  INDEX `FK_17a452a284a706bf6c531a6a68c`(`permissionId`) USING BTREE,
  CONSTRAINT `FK_17a452a284a706bf6c531a6a68c` FOREIGN KEY (`permissionId`) REFERENCES `sys_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_1e938b9c442d384f6732cb7471d` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_permission
-- ----------------------------
INSERT INTO `sys_user_permission` VALUES ('1719b47c-de8c-45b3-b03c-482d827f02ae', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '4d4a312c-7046-4872-9efb-18af351296d5');
INSERT INTO `sys_user_permission` VALUES ('1c38f04d-a7d4-4d28-82b4-75292a13adeb', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '3dfaeace-3a67-4106-b2d2-a33f630c8ca1');
INSERT INTO `sys_user_permission` VALUES ('1d222473-0d8e-4aba-bc63-5f4c523af7e3', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '9a287221-8da7-455f-a6fe-89ef4969cd48');
INSERT INTO `sys_user_permission` VALUES ('1f769f40-6b67-48c2-abdf-962da99c69f3', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_user_permission` VALUES ('31902a39-04d6-4bab-b161-5c81befdc9d8', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '7925d314-0758-4ff0-9096-409cbab1966a');
INSERT INTO `sys_user_permission` VALUES ('354e9cdf-6d28-4fd7-98dd-a6831bbc1710', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'baf3a0ba-3fcd-44a6-8bb3-0c00a18dd082');
INSERT INTO `sys_user_permission` VALUES ('51d8e62f-c071-4798-abb0-7b6eda0efded', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '7d6a6b43-fd8f-4cc4-8265-0c7519189a36');
INSERT INTO `sys_user_permission` VALUES ('54559bc5-ee83-496c-a138-36f741af20ae', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '676cec2a-d9ff-4961-9213-499369b1c902');
INSERT INTO `sys_user_permission` VALUES ('6b118e6e-cdfe-4c3e-a24c-adfa6f1bd3d5', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '633440f8-488f-4788-967c-1990c1091973');
INSERT INTO `sys_user_permission` VALUES ('7e132408-d66c-4082-8cb0-1880b72ef4b8', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '98af51d3-573b-4b3b-822e-df44ba01be91');
INSERT INTO `sys_user_permission` VALUES ('990925c4-c352-4a93-a7eb-c83bf2ddb646', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '19ea905e-99f5-425a-83ec-a7b08a3edfca');
INSERT INTO `sys_user_permission` VALUES ('9c143107-02b0-4f6e-ad10-821b205da415', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_user_permission` VALUES ('ab50167a-3a71-4d2a-a7ba-35c552aca0b5', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '866c1f11-4203-4475-951f-84a55b60c6b9');
INSERT INTO `sys_user_permission` VALUES ('bef2850f-5c85-4fbd-8c85-08b67a5a82ce', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'b4225a25-e636-4ada-b781-d7213cef053e');
INSERT INTO `sys_user_permission` VALUES ('c4f15cc8-2ad8-473e-a837-2b8144afccd7', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '10417cf5-f095-4abd-a9f0-5e8e8bcafb3c');
INSERT INTO `sys_user_permission` VALUES ('d8043897-d279-4152-95f4-5b91eb5af810', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '94c243a8-3cad-4382-bbb0-a0958f462e06');
INSERT INTO `sys_user_permission` VALUES ('df0f2aad-a525-48fc-a7d1-1548bf05c76c', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '636423f6-0657-412a-951a-80caa3930f21');
INSERT INTO `sys_user_permission` VALUES ('e1aab600-4be4-4d8e-924d-ff6ec2a405cf', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'a27048fe-6403-4234-97a9-545fc67b9d81');
INSERT INTO `sys_user_permission` VALUES ('e9322043-552d-4159-972f-4f12d7668ac8', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'f7a3c83a-d4b6-4776-9c99-ca6ccc005004');
INSERT INTO `sys_user_permission` VALUES ('ebb667d4-d772-4772-a8d2-d5a71aebff4f', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_user_permission` VALUES ('f51eca85-156f-4d07-a61a-fe6144b16987', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', 'f777da84-c818-4f58-ae72-41a2a43fc500');
INSERT INTO `sys_user_permission` VALUES ('f5b346da-05fd-4251-a09c-9cc57991e230', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '736b3334-8d0a-4c17-bd85-daa429a19a37');
INSERT INTO `sys_user_permission` VALUES ('f73ec1f4-2d96-46ec-aecd-4f91195ffb8a', '0511f0a5-3ff8-4284-9851-4bfd9c0d5b16', '67f7c348-8bdb-486e-8585-e579e90b43c3');

SET FOREIGN_KEY_CHECKS = 1;
