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

 Date: 09/09/2021 10:23:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `roleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  `permissionId` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_12e7dc0ca4c0c09f11d50a3a499`(`roleId`) USING BTREE,
  INDEX `FK_b357d42a45f488a0270d3f928b2`(`permissionId`) USING BTREE,
  CONSTRAINT `FK_12e7dc0ca4c0c09f11d50a3a499` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b357d42a45f488a0270d3f928b2` FOREIGN KEY (`permissionId`) REFERENCES `sys_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES ('091b95e9-3771-4a88-8e49-70c50e5eedc5', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '67f7c348-8bdb-486e-8585-e579e90b43c3');
INSERT INTO `sys_role_permission` VALUES ('096bffc8-ef29-4162-a82a-9902797c61ca', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '63343802-c2a5-4cdf-a0ee-0a620c5c5926');
INSERT INTO `sys_role_permission` VALUES ('142a23b8-2e71-4398-be86-17dd7721a37b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a52040ca-ded7-4ca3-b94c-b492871d25fb');
INSERT INTO `sys_role_permission` VALUES ('1a43d2d7-ab42-4cf2-a627-44464b96947f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '862d3a38-afac-4f7d-ab26-07ab7a258feb');
INSERT INTO `sys_role_permission` VALUES ('1b0a1bf6-ff00-4d05-84f9-21831d9a66a2', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4379e01f-ccd0-4f11-b410-bb2636b767cc');
INSERT INTO `sys_role_permission` VALUES ('1b79682e-121e-41be-9428-f0d8c27db197', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '547eba13-1039-4cc6-9719-6fb79d304a4c');
INSERT INTO `sys_role_permission` VALUES ('1c380ce7-c0bb-4eea-bf5b-158c909880a4', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'b4225a25-e636-4ada-b781-d7213cef053e');
INSERT INTO `sys_role_permission` VALUES ('1c4e2dc4-5dd3-4103-bcdd-aef815726ff5', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f25c0cb5-8c15-4569-8c24-32a60c3c07a0');
INSERT INTO `sys_role_permission` VALUES ('1ce3f5ab-8991-4501-9f71-f0ddb8e80931', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f777da84-c818-4f58-ae72-41a2a43fc500');
INSERT INTO `sys_role_permission` VALUES ('1ea77233-2045-4d47-95cf-e381dbeea97e', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '67f7c348-8bdb-486e-8585-e579e90b43c3');
INSERT INTO `sys_role_permission` VALUES ('218add49-51e8-4200-a5bd-376606aa6d79', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c9b7eb18-db9d-4935-846e-32c93407905a');
INSERT INTO `sys_role_permission` VALUES ('24a2ba3e-3512-4f9a-9cbd-9ba02eb1bc83', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_role_permission` VALUES ('25b37b48-dd61-4e4a-aa13-45d15f662edf', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2b552e47-8a30-4ecc-a183-797e85db8ef5');
INSERT INTO `sys_role_permission` VALUES ('2645e8a8-b925-4cc4-b931-abfb910964cf', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4225a25-e636-4ada-b781-d7213cef053e');
INSERT INTO `sys_role_permission` VALUES ('2a1358df-9e9d-4f1e-819d-bf1ca29d039a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10dd853b-9272-4cd6-93bc-4a03bab7a18f');
INSERT INTO `sys_role_permission` VALUES ('2b427a78-9283-4fbc-8036-fb89eb2d3005', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '636423f6-0657-412a-951a-80caa3930f21');
INSERT INTO `sys_role_permission` VALUES ('2d154e9a-9f29-4f8c-9e74-e0af7fa9c52d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '5d40f3ed-67f4-4147-9da6-3637a52324e1');
INSERT INTO `sys_role_permission` VALUES ('2e0c766a-6097-4cd9-b13f-a957697a060a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c8a27d18-898a-46c7-9be1-666344cccc51');
INSERT INTO `sys_role_permission` VALUES ('30620833-2f79-4451-b402-629810c0f49a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6a5aee9a-2739-429f-83db-ebd2ec656205');
INSERT INTO `sys_role_permission` VALUES ('308b2b91-5d7d-40ac-8526-b1023cbed2d4', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '636423f6-0657-412a-951a-80caa3930f21');
INSERT INTO `sys_role_permission` VALUES ('3105bdc4-9f48-49fd-aa51-b0474fc73801', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'f7a3c83a-d4b6-4776-9c99-ca6ccc005004');
INSERT INTO `sys_role_permission` VALUES ('3989e12d-d5a2-4d1b-ac21-6b479da5a23a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a3c5c8ec-69ca-4c0f-b6a0-27d11f81775b');
INSERT INTO `sys_role_permission` VALUES ('3a240dfc-3d1d-4a88-83d7-ce9ef0cb8ae0', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_role_permission` VALUES ('3a81ebf2-0d91-4f30-a902-c1d241b56075', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'f777da84-c818-4f58-ae72-41a2a43fc500');
INSERT INTO `sys_role_permission` VALUES ('3b9e0a6b-f4fe-4ae3-bcc0-c65faf37f2fe', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '31292492-7a02-446c-b509-6ad4884beb0');
INSERT INTO `sys_role_permission` VALUES ('41b935ca-5f95-453c-8e8d-8b0ea6f59a14', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f7a3c83a-d4b6-4776-9c99-ca6ccc005004');
INSERT INTO `sys_role_permission` VALUES ('4d8321d2-54fc-4a6b-a87b-e29264243033', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'baf3a0ba-3fcd-44a6-8bb3-0c00a18dd082');
INSERT INTO `sys_role_permission` VALUES ('507af871-b50d-47f5-80fe-0dc4c681744c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4365dca5-ba7b-4233-92d7-f31fdb01aaa8');
INSERT INTO `sys_role_permission` VALUES ('543d2f01-6f15-401f-a55e-0bb14458ab6e', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '633440f8-488f-4788-967c-1990c1091973');
INSERT INTO `sys_role_permission` VALUES ('572ef84a-072f-496a-b55e-0aad8146a7ed', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '676cec2a-d9ff-4961-9213-499369b1c902');
INSERT INTO `sys_role_permission` VALUES ('582de2d6-24ff-4797-bf04-42f4e39ab4ec', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb');
INSERT INTO `sys_role_permission` VALUES ('59eff7eb-4d13-45bb-8977-1e419a32c968', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10dd853b-9272-4cd6-93bc-4a03bab7a18f');
INSERT INTO `sys_role_permission` VALUES ('601ab156-c314-4c66-af87-c5e326ecb3c6', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '484a14c2-82f9-4818-afd9-959ddccc5a96');
INSERT INTO `sys_role_permission` VALUES ('61a66dea-32c8-4435-9d34-49e36de47d86', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a27048fe-6403-4234-97a9-545fc67b9d81');
INSERT INTO `sys_role_permission` VALUES ('62a69797-114c-4c15-bbe3-a696af5c517e', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5');
INSERT INTO `sys_role_permission` VALUES ('695042ce-7dc5-4bb0-9615-6cb525f6d3ce', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ef2db655-1acb-4aed-bbe6-0c12020d0562');
INSERT INTO `sys_role_permission` VALUES ('6cfec3e7-12c3-4d85-b1e4-92924ee04869', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7');
INSERT INTO `sys_role_permission` VALUES ('6deb50de-0442-44b1-a4d3-978651a5b05c', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '19ea905e-99f5-425a-83ec-a7b08a3edfca');
INSERT INTO `sys_role_permission` VALUES ('6f9091f4-9423-4608-82db-94d833a0960d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7');
INSERT INTO `sys_role_permission` VALUES ('735ac6d6-b0bd-43b1-a867-933aa817d014', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', 'a27048fe-6403-4234-97a9-545fc67b9d81');
INSERT INTO `sys_role_permission` VALUES ('74502ec0-4efa-40f2-a2a8-5511277a927b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2b552e47-8a30-4ecc-a183-797e85db8ef5');
INSERT INTO `sys_role_permission` VALUES ('750c8781-56d9-4b70-bd6e-207ee0194c4c', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '10417cf5-f095-4abd-a9f0-5e8e8bcafb3c');
INSERT INTO `sys_role_permission` VALUES ('753b14aa-af20-4063-88c0-34fe5b0192af', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f8a16ae2-78ea-4be6-85d7-2c02b76ea9ab');
INSERT INTO `sys_role_permission` VALUES ('768eb7af-eb83-40c4-9611-2ae6437e8c1f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_role_permission` VALUES ('794430b1-17c0-4ab1-a4c6-300351bb4631', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_role_permission` VALUES ('7c7f0484-6912-4f93-85e4-126334d8d515', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '887460aa-df2c-47e3-bb13-116aec0fcd25');
INSERT INTO `sys_role_permission` VALUES ('86040e1f-7a23-498a-991e-cea416932682', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_role_permission` VALUES ('86a081ee-fb7d-4397-925c-b26e9fed6914', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '66a7e4f0-46ad-4642-b348-0c85ee5860af');
INSERT INTO `sys_role_permission` VALUES ('8993920f-b565-4b4e-bd59-6dc9cf69c20c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_role_permission` VALUES ('8d2028c0-1f22-4b14-ad08-4ec741903314', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2531bbd4-f502-4818-af8c-d545e225547d');
INSERT INTO `sys_role_permission` VALUES ('8e4dc413-1902-4818-abac-070c64bf1e3b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '250b7a06-2dbb-4c76-b483-1bd3542f1b99');
INSERT INTO `sys_role_permission` VALUES ('954454a0-af62-4520-8e7f-e4aebaa1496a', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '7d6a6b43-fd8f-4cc4-8265-0c7519189a36');
INSERT INTO `sys_role_permission` VALUES ('970cd538-4c0d-4b68-8ad6-d988345a5df8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10417cf5-f095-4abd-a9f0-5e8e8bcafb3c');
INSERT INTO `sys_role_permission` VALUES ('9e532802-5b07-4aee-bd04-6e869766c561', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '8d8814dc-e3ce-426c-8188-67c2dba77f72');
INSERT INTO `sys_role_permission` VALUES ('9fee3c01-f2f9-4dea-a675-9059aab26b2c', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '98af51d3-573b-4b3b-822e-df44ba01be91');
INSERT INTO `sys_role_permission` VALUES ('a2671000-cf40-48d8-bc30-38f74ecc58bb', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ef2db655-1acb-4aed-bbe6-0c12020d0562');
INSERT INTO `sys_role_permission` VALUES ('a41afe50-8125-4515-b7da-7802c97be95d', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '866c1f11-4203-4475-951f-84a55b60c6b9');
INSERT INTO `sys_role_permission` VALUES ('a9191104-02a1-46dd-9d3a-030f22a2d473', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c9b7eb18-db9d-4935-846e-32c93407905a');
INSERT INTO `sys_role_permission` VALUES ('ad0e6f15-6f2b-4cb5-aa7b-3d6469af2a6d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_role_permission` VALUES ('b2ec8def-6c4b-4f72-83f9-5ef7ef5bb80e', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '7925d314-0758-4ff0-9096-409cbab1966a');
INSERT INTO `sys_role_permission` VALUES ('b95c704e-920e-4fc5-bfb1-b8e7695248d6', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '98af51d3-573b-4b3b-822e-df44ba01be91');
INSERT INTO `sys_role_permission` VALUES ('bc46757a-6a15-488f-a134-123c6a49585c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_role_permission` VALUES ('bc635f9f-f8e9-4d3f-9eb8-b72d3de995ea', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '676cec2a-d9ff-4961-9213-499369b1c902');
INSERT INTO `sys_role_permission` VALUES ('bf94ea61-0757-4670-a613-c78d8c439a67', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4d4a312c-7046-4872-9efb-18af351296d5');
INSERT INTO `sys_role_permission` VALUES ('c48f0448-89da-4a47-9773-6cb124b2c60d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10ba71b0-69ba-402c-b19b-6d2ec4c8018a');
INSERT INTO `sys_role_permission` VALUES ('c8f63da6-5d5d-40af-84ca-f12fe0257149', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb');
INSERT INTO `sys_role_permission` VALUES ('ca26307d-7748-4c40-9b94-b75f70849895', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b2f8ef54-dc2a-47fe-8e88-fa025866bcfe');
INSERT INTO `sys_role_permission` VALUES ('cce08084-2581-4f5f-9b92-e8ce51b314c8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '969dcc20-b24f-4fd4-be01-141e294bd14e');
INSERT INTO `sys_role_permission` VALUES ('d34270a7-4480-43d9-903a-873f407d79f1', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '843528e7-3a86-4b12-b433-f93bcccbc7e7');
INSERT INTO `sys_role_permission` VALUES ('d4cbc5f9-778e-4fd2-a6fa-d24d57d1d897', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a52040ca-ded7-4ca3-b94c-b492871d25fb');
INSERT INTO `sys_role_permission` VALUES ('d92761db-12aa-4649-afe4-eb123fe5758a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b9b8e480-1a2b-409b-918a-c5969e65d900');
INSERT INTO `sys_role_permission` VALUES ('d9c75171-153b-447f-a3ef-825e00a558a8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a0526cc2-26b4-4588-b822-e48643a58583');
INSERT INTO `sys_role_permission` VALUES ('dc61677e-03b1-4a09-ba88-79d188262984', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '06953b13-d8d0-493e-a630-792ddcacfef5');
INSERT INTO `sys_role_permission` VALUES ('de8153bc-cf3a-4dd3-a5ac-96c6ac27dc29', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '06953b13-d8d0-493e-a630-792ddcacfef5');
INSERT INTO `sys_role_permission` VALUES ('e542f4bd-8ce6-48d8-84d4-f8180a45c834', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '306e4a38-9e71-4e77-b66d-4aab6a0d94e5');
INSERT INTO `sys_role_permission` VALUES ('e566ada5-4d8c-429b-921e-8d0b1a0ecaa1', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'd6cdc6a9-f040-4dfa-9d68-2e0c15eafcd9');
INSERT INTO `sys_role_permission` VALUES ('eb954fdf-4f9d-4a20-acc1-5ae30f52fa81', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f25c0cb5-8c15-4569-8c24-32a60c3c07a0');
INSERT INTO `sys_role_permission` VALUES ('ecfcc8e7-90ab-40ba-accb-08d500b5e03f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'e7c705cb-c734-4160-b5bd-b15bf022dbe6');
INSERT INTO `sys_role_permission` VALUES ('ed43b14f-46b5-4fde-b10b-d49b99b8345c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb');
INSERT INTO `sys_role_permission` VALUES ('edcd868e-df8d-404c-a331-b0ee1635acc7', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c', '4d4a312c-7046-4872-9efb-18af351296d5');
INSERT INTO `sys_role_permission` VALUES ('edd80665-8866-4f5e-95d5-461581bbbc8a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5');
INSERT INTO `sys_role_permission` VALUES ('f7feda3e-3c99-4dfb-867b-95c519fcdd53', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_role_permission` VALUES ('fff137b6-1bb7-41d6-8fbc-87461ec182a0', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb');

SET FOREIGN_KEY_CHECKS = 1;
