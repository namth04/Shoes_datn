create database datn_shoes;
use datn_shoes;

CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(300) NOT NULL,
  `orders` int DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO `category` VALUES (1,'2021-08-22 13:48:57.568000',NULL,'Giày Nam',0,'giay-nam',1),
(2,'2021-08-22 13:49:02.889000',NULL,'Giày Nữ',0,'giay-nu',1),
(3,'2021-08-22 13:49:06.955000',NULL,'Giày Trẻ em',0,'giay-tre-em',1);
CREATE TABLE `brand` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_rdxh7tq2xs66r485cc8dkxt77` (`name`)
);
INSERT INTO `brand` VALUES (1,'2021-08-22 13:49:38.447000',NULL,NULL,'VANZ',1,'/media/static/6f1de8cc-84cd-4da8-9e73-1b27bbf0058d.jpg'),
(2,'2021-08-22 13:49:47.368000',NULL,NULL,'CONVERSE',1,'/media/static/988dd7b0-5e8b-4707-a910-b9877970c071.png'),
(3,'2021-08-22 13:49:56.351000',NULL,NULL,'ADIDAS',1,'/media/static/282930fb-ef57-407e-89b7-2cfdb5cf43a0.jpg'),
(4,'2021-08-22 13:50:05.440000',NULL,NULL,'NIKE',1,'/media/static/b915dbe3-1aaa-4d3f-b14f-f716a3bad457.png');
CREATE TABLE `material` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_material` (`name`)
);
INSERT INTO `material` (`created_at`, `description`, `modified_at`, `name`, `status`) 
VALUES
('2024-10-10 12:00:00', 'Breathable, lightweight fabric', '2024-10-10 12:00:00', 'Flyknit', 1),
('2024-10-10 12:05:00', 'Soft, responsive cushioning material', '2024-10-10 12:05:00', 'Boost', 1),
('2024-10-10 12:10:00', 'Durable rubber for traction', '2024-10-10 12:10:00', 'Continental Rubber', 1),
('2024-10-10 12:15:00', 'Flexible, lightweight foam', '2024-10-10 12:15:00', 'Phylon', 1),
('2024-10-10 12:20:00', 'Synthetic material for support', '2024-10-10 12:20:00', 'Primeknit', 1);
CREATE TABLE `sole` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_sole_name` (`name`)
);
INSERT INTO `sole` (`created_at`, `description`, `modified_at`, `name`, `status`) VALUES
(NOW(), 'Sole material for shoes', NOW(), 'Rubber', 1),
(NOW(), 'Sole material for shoes', NOW(), 'Leather', 1),
(NOW(), 'Sole material for shoes', NOW(), 'PVC', 1);


CREATE TABLE `product_size` (
  `product_id` varchar(255) NOT NULL,
  `size` int NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`product_id`,`size`)
);
INSERT INTO `product_size` (`product_id`, `size`, `quantity`) 
VALUES
('FJWheJ015', 36, 50),
('FJWheJ015', 37, 45),
('FJWheJ014', 38, 40),
('FJWheJ014', 39, 35),
('FJWheJ013', 40, 30),
('FJWheJ013', 41, 25),
('FJWheJ012', 42, 20),
('FJWheJ012', 36, 55),  
('FJWheJ011', 37, 60),
('FJWheJ010', 38, 50),
('FJWheJ009', 39, 45),
('FJWheJ008', 40, 40),
('FJWheJ007', 41, 35),
('FJWheJ006', 42, 30),
('FJWheJ005', 36, 65);
CREATE TABLE `product_color`(
  `product_id` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`product_id`,`color`)
);
INSERT INTO `product_color` (`product_id`, `color`, `quantity`)
VALUES
('FJWheJ015', 'Trắng', 100),
('FJWheJ015', 'Đen', 80),
('FJWheJ014', 'Xanh', 90),
('FJWheJ014', 'Đỏ', 70),
('FJWheJ013', 'Vàng', 60),
('FJWheJ013', 'Cam', 50),
('FJWheJ012', 'Tím', 40),
('FJWheJ012', 'Hồng', 30), 
('FJWheJ011', 'Nâu', 20),
('FJWheJ010', 'Xám', 15),
('FJWheJ009', 'Lam', 10),
('FJWheJ008', 'Bạc', 25),
('FJWheJ007', 'Vàng nhạt', 35),
('FJWheJ006', 'Mận', 5),
('FJWheJ005', 'Trắng', 50);
CREATE TABLE `product` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `image_feedback` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(300) NOT NULL,
  `price` bigint DEFAULT NULL,
  `sale_price` bigint DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` int DEFAULT NULL,
  `total_sold` bigint DEFAULT NULL,
  `product_view` int DEFAULT NULL,
  `brand_id` bigint DEFAULT NULL,
  `sole_id` bigint DEFAULT NULL,
  `material_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs6cydsualtsrprvlf2bb3lcam` (`brand_id`),
  KEY `FKsole` (`sole_id`),
  KEY `FKmaterial` (`material_id`),
  CONSTRAINT `FKs6cydsualtsrprvlf2bb3lcam` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `FKsole` FOREIGN KEY (`sole_id`) REFERENCES `sole` (`id`),
  CONSTRAINT `FKmaterial` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`)
);
INSERT INTO `product` 
(`id`, `created_at`, `description`, `image_feedback`, `images`, `modified_at`, `name`, `price`, `sale_price`, `slug`, `status`, `total_sold`, `product_view`, `brand_id`, `sole_id`, `material_id`) 
VALUES
('FJWheJ001', NOW(), '<p><strong>Nike Air Max 97</strong></p><p>Thiết kế độc đáo với lớp đệm khí đặc trưng, mang đến sự êm ái cho từng bước đi.</p><br><p>Chất liệu cao cấp, mang lại sự bền bỉ và thoáng mát.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Nike Air Max 97', 2000000, 1800000, 'nike-air-max-97', 1, 500, 1000, 1, 1, 1),
('FJWheJ002', NOW(), '<p><strong>Nike Air Force 1</strong></p><p>Mẫu giày huyền thoại với phong cách đơn giản, cổ điển, phù hợp cho mọi hoạt động hàng ngày.</p><br><p>Chất liệu da mềm mại cùng đế cao su giúp tăng độ bám trên mọi bề mặt.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Nike Air Force 1', 2200000, 2000000, 'nike-air-force-1', 1, 700, 1200, 1, 1, 1),
('FJWheJ003', NOW(), '<p><strong>Nike Air Zoom Pegasus 38</strong></p><p>Mẫu giày chạy bộ tuyệt vời với công nghệ đệm Zoom Air, giúp tăng tốc độ và độ phản hồi.</p><br><p>Độ bền cao, phù hợp cho cả đường chạy dài và ngắn.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Nike Air Zoom Pegasus 38', 2800000, 2600000, 'nike-air-zoom-pegasus-38', 1, 300, 900, 1, 1, 1),
('FJWheJ004', NOW(), '<p><strong>Adidas Ultraboost 21</strong></p><p>Mẫu giày chạy bộ nổi tiếng với đế Boost giúp mang lại sự thoải mái và độ phản hồi cao.</p><br><p>Thiết kế thời trang, phù hợp cho cả chạy bộ và đi dạo.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Adidas Ultraboost 21', 2500000, 2300000, 'adidas-ultraboost-21', 1, 600, 1100, 2, 2, 2),
('FJWheJ005', NOW(), '<p><strong>Adidas NMD R1</strong></p><p>Phong cách hiện đại, thiết kế nhẹ và êm ái, phù hợp cho mọi hoạt động.</p><br><p>Công nghệ đế Boost mang lại cảm giác thoải mái suốt cả ngày.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Adidas NMD R1', 2400000, 2200000, 'adidas-nmd-r1', 1, 400, 800, 2, 2, 2),
('FJWheJ006', NOW(), '<p><strong>Converse Chuck Taylor All Star</strong></p><p>Mẫu giày cổ điển, luôn được yêu thích bởi thiết kế đơn giản và dễ kết hợp trang phục.</p><br><p>Chất liệu canvas thoáng mát, dễ dàng vệ sinh.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Converse Chuck Taylor All Star', 1200000, 1000000, 'converse-chuck-taylor-all-star', 1, 800, 1500, 3, 3, 3),
('FJWheJ007', NOW(), '<p><strong>Converse One Star</strong></p><p>Thiết kế năng động và cá tính, phù hợp với giới trẻ.</p><br><p>Chất liệu bền bỉ, mang lại cảm giác thoải mái khi mang.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Converse One Star', 1300000, 1100000, 'converse-one-star', 1, 600, 1200, 3, 3, 3),
('FJWheJ008', NOW(), '<p><strong>Vans Old Skool</strong></p><p>Phong cách skate cổ điển với đường viền da và lớp đệm êm ái.</p><br><p>Phù hợp cho cả nam và nữ, dễ dàng kết hợp với nhiều trang phục.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Vans Old Skool', 1500000, 1300000, 'vans-old-skool', 1, 900, 1600, 4, 3, 4),
('FJWheJ009', NOW(), '<p><strong>Vans Authentic</strong></p><p>Mẫu giày đơn giản, dễ mang, phù hợp với mọi phong cách.</p><br><p>Chất liệu vải bền và thoáng khí.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Vans Authentic', 1400000, 1200000, 'vans-authentic', 1, 750, 1400, 4, 2, 4),
('FJWheJ010', NOW(), '<p><strong>Nike Blazer Mid 77</strong></p><p>Thiết kế cổ điển với phong cách retro, phù hợp cho mọi dịp.</p><br><p>Chất liệu da bền bỉ và thoải mái khi mang.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Nike Blazer Mid 77', 2100000, 1900000, 'nike-blazer-mid-77', 1, 300, 1100, 1, 1, 1),
('FJWheJ011', NOW(), '<p><strong>Adidas Superstar</strong></p><p>Mẫu giày cổ điển với thiết kế đặc trưng và đế cao su.</p><br><p>Phù hợp cho nhiều dịp khác nhau.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Adidas Superstar', 2000000, 1800000, 'adidas-superstar', 1, 500, 1200, 2, 2, 2),
('FJWheJ012', NOW(), '<p><strong>Nike React Infinity Run</strong></p><p>Mẫu giày chạy bộ êm ái với công nghệ đệm React.</p><br><p>Thiết kế thời trang và hiện đại, phù hợp với người chạy.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Nike React Infinity Run', 2600000, 2400000, 'nike-react-infinity-run', 1, 200, 900, 1, 1, 1),
('FJWheJ013', NOW(), '<p><strong>Adidas Yeezy Boost 350</strong></p><p>Mẫu giày cao cấp với thiết kế độc đáo và chất liệu cao cấp.</p><br><p>Phù hợp cho những ai yêu thích phong cách thời trang.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Adidas Yeezy Boost 350', 4500000, 4300000, 'adidas-yeezy-boost-350', 1, 150, 600, 2, 2, 2),
('FJWheJ014', NOW(), '<p><strong>Converse Jack Purcell</strong></p><p>Mẫu giày với phong cách năng động và trẻ trung.</p><br><p>Chất liệu cao cấp, dễ dàng phối hợp với nhiều trang phục.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Converse Jack Purcell', 1350000, 1150000, 'converse-jack-purcell', 1, 500, 1300, 3, 3, 3),
('FJWheJ015', NOW(), '<p><strong>Vans Sk8-Hi</strong></p><p>Mẫu giày cổ cao, phong cách skate, tạo sự nổi bật cho người mang.</p><br><p>Chất liệu bền và kiểu dáng thể thao.</p>', NULL, '["/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg", "/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg"]', NOW(), 'Vans Sk8-Hi', 1600000, 1400000, 'vans-sk8-hi', 1, 700, 1500, 4, 3, 4);
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `roles` json NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;
INSERT INTO `users` VALUES (1,'Kiều Mai Hà NỘi',Null,'2024-08-22 13:43:08.676000','admin@gmail.com','admin',NULL,'$2a$12$6vOrz9fOe1OFg5/9jzP8KeJEAIS4zjZe5RyuuPe6.pprqua3J/AUu','0974492604','[\"ADMIN\", \"USER\"]',1),
(2,'Vĩnh Hưng Hoàng Mai Hà Nội',NULL,'2024-08-22 13:44:11.392000','user@gmail.com','user',NULL,'$2a$12$4d0o3IvSxvJ1VhIisqfMt.2GsBAhQsxjqeFI8T7CC749qJ.F4Ynae','0385036533','[\"USER\"]',1);


CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `modified_at` datetime(6) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `slug` varchar(600) NOT NULL,
  `status` int DEFAULT '0',
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(300) NOT NULL,
  `created_by` bigint DEFAULT NULL,
  `modified_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3b6cq7u0x3fdxeh4sq95mia29` (`created_by`),
  KEY `FKl2q2idcap1gt3qhh87ebirpnc` (`modified_by`),
  CONSTRAINT `FK3b6cq7u0x3fdxeh4sq95mia29` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKl2q2idcap1gt3qhh87ebirpnc` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`)
);
INSERT INTO `post` VALUES (1,'<p>&nbsp;</p>','2024-08-22 13:58:02.150000','<p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Chào các bạn. Mình là Tú admin Tu Shoes và hôm nay mình sẽ giải thích cho các bạn hiểu ntn là rep 1:1 và những vấn đề liên quan đến các chất lượng giày hiện nay. Cá nhân mình đã làm trong ngành này cũng 2 năm rồi và cũng hơn chục lần đi tham quan rất nhiều xưởng sản xuất và cũng đã trải nghiệm quá nhiều hàng real và rep 1:1 lẫn rất nhiều chất lượng khác rồi nên hôm nay mình sẽ giải thích rõ ràng nhất về chất lượng rep 1:1 cho các bạn hiểu.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\">&nbsp;</p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>Thứ 1: Rep 1:1 là gì ?&nbsp;</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Rep 1:1 là từ viết tắt của Replica 1:1 ám chỉ hàng fake được sản xuất cao cấp nhất, chất lượng tốt nhất và giống với real nhất. Nó có thể giống đến&nbsp;<strong>98%-99%</strong>&nbsp;hay có những bạn đánh giá nếu real được 10 điểm thì rep 1:1 sẽ được 9 điểm - 9,5 điểm.&nbsp;</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Về&nbsp;<strong>so sánh Rep 1:1 với Real</strong>&nbsp;thì khi mà các bạn không cầm trên tay 2 mẫu thì cực kì rất khó để so sánh hay nhận biết được nó là hàng rep 1:1 hay real. Phải những bạn chuyên gia kiểu cầm lên check thì mới biết được. Còn nếu bạn đi rep 1:1 ngoài đường thì không ai nói bạn đang đi 1 đôi giày fake cả. Kể cả những người tìm hiểu về giày và tiếp xúc thường xuyên như mình đây cảm giác nhìn nhìn 1 đôi rep 1:1 trên chân cũng khó có thể biết được đó là rep 1:1 hay real [ Mình nhắc lại là đã 2 năm và ngày nào mình cũng tìm hiểu về giày và tiếp xúc với giày ]</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Tùy vào mẫu thì các chất lượng rep 1:1 sẽ khác với chính hãng 1 số vấn đề sau [ form dáng , chi tiết tem, màu sắc ] Và lưu ý là các điểm khác này là rất nhỏ, hầu như nguyên liệu làm 1 chiếc giày rep 1:1 với real là giống nhau. Về màu sắc thì khác nhau rất ít chỉ có đậm hơn 1 chút hoặc nhạt hơn 1 chút rất khó để kiểm tra nếu bạn không có 2 đôi rep 1:1 và real để so sánh.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Chính vì rep 1:1 rất khó check với real nên có rất&nbsp;<strong>nhiều cửa hàng mang tiếng bán giày chính hãng</strong>&nbsp;nhưng thực chất là đang bán rep 1:1 với giá giày real. Cụ thể các bạn tìm kiếm trên google từ khóa như những cửa hàng bán giày chính hãng lừa đảo sẽ ra 1 danh sách rất nhiều luôn nhé.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Bên cạnh đó cũng có&nbsp;<strong>rất nhiều cửa hàng bán hàng kém chất lượng</strong>&nbsp;như những chất lượng fake 1, super fake tự nhận mình đang bán hàng rep 1:1 vì họ muốn lừa những khách hàng của họ là tôi là cửa hàng bán rep 1:1 rẻ nhất nhưng thực chất những thứ bạn nhận được chỉ là chất lượng kém. Về chất lượng kém chỉ cần mình nhìn lướt qua là có thể biết được chứ không phải giống với những sản phẩm rep 1:1 cao cấp rất khó để nhận biết đến nỗi có thể trộn rep 1:1 với real để bán.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Vậy với những đặc điểm như vậy. Rep 1:1 so sánh với real sẽ đạt được 98% thì&nbsp;<strong>mức giá&nbsp;</strong>bán rep 1:1 sẽ rơi vào 1/2 cho đến 1/3 so với giá real. Vì chất liệu và độ tỉ mỉ rep 1:1 mang lại sẽ không hề có mức giá quá thấp. Và đặc điểm là rep 1:1 chỉ sản xuất những đôi giày giống real. Có nghĩa là khi real có phiên bản nào thì rep 1:1 sẽ mua sản phẩm đấy về và sản xuất phối màu và chất liệu chât lượng tương tự. Xưởng rep 1:1 sẽ không tự ý sản xuất ra những đôi giày mà không có hàng chính hãng để so sánh.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>Thứ 2: Những ai sẽ lựa chọn rep 1:1 ?</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Mình có tham khảo khá nhiều khách hàng lựa chọn rep 1:1 thành viên Tu Shoes thì mình nhận được rất nhiều những ý kiến về khách hàng tìm đến cửa hàng mình đa số về tiết kiệm chi phí cũng như là họ không thể tìm thấy những đôi giày real đó bán ở Việt Nam.&nbsp;</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Ví dụ như những đôi giày&nbsp;<strong>Yeezy&nbsp;</strong>được sản xuất số lượng hạn chế [&nbsp;<strong>limited</strong>&nbsp;] khó có thể mua được ở Việt Nam cũng như là % cao mua được giày rep 1:1 với giá 8-15tr là rất cao nên họ quyết định chọn đến rep 1:1 real boost với giá bằng 1/3 với ~3tr . Hay những dòng&nbsp;<strong>Vans vault&nbsp;</strong>cứ được&nbsp;<strong>Restock&nbsp;</strong>[ Làm lại ] bán chính hãng ở Việt Nam thì không thể mua được nên khách hàng sẽ lựa chọn rep 1:1 với giá = 1/3 khoảng ~800k - 900k. Vì Vans Vault cực kì khó mua và có mức giá từ 2tr4-3tr5 tùy phiên bản nên những cửa hàng mang rep 1:1 bán giá real sẽ rơi vào giá hơn 1tr để lừa khách hàng thì các bạn nên cẩn thận và check kĩ cũng như là nên tránh những cửa hàng đã từng bị phốt.&nbsp;</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Tiếp đến khi mình quyết định chỉ mang&nbsp;<strong>chất lượng tốt nhất</strong>&nbsp;đến với khách hàng cũng là lúc nhiều cửa hàng bán hàng Super fake cũ cũng như bán hàng fake 1 cũ với mức giá 300k - 1tr / 1 sản phẩm cũng đã nói đó là hàng rep 1:1 dẫn đến việc có quá nhiều người loạn về hàng hóa không biết và hiểu rõ rep 1:1 là gì? Các bạn có thể để ý đến cách đây 2 năm mình đưa rep 1:1 lên và kể từ lúc đó rep 1:1 thành trào lưu của tất cả mọi người :\"&gt;.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>Thực tế bán hàng chuẩn rep 1:1 ở Việt Nam</strong>&nbsp;theo mình được biết còn chưa có đến 5 cửa hàng. Vì đơn giản người Việt Nam chỉ thích những hàng rẻ và không quan tâm về chất lượng. Chỉ để ý 2 mẫu giống nhau nhưng không biết thực chất là 2 sản phẩm chất lượng khác nhau và khách hàng sẽ lựa chọn rẻ hơn. Và thực tế thì cửa hàng mình đã bị rất nhiều cửa hàng khác ăn trộm ảnh, chỉnh sửa ảnh và xóa toàn bộ logo của Tu Shoes trên hình ảnh và chèn vào đó là icon.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>Kết Luận:</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Trên đây thì mình không có khuyên bạn phải sử dụng hàng này hay hàng kia. Tùy vào mục đích sử dụng của các bạn thì các bạn sẽ chọn những sản phẩm phù hợp. Các bạn là khách hàng và các bạn xứng đáng nhận được những gì tốt nhất cho sự lựa chọn của các bạn. Mình chỉ nhắc các bạn là chất lượng đi kèm với giá cả và đừng để người khác lừa bạn vì họ là những người không đủ để các bạn tin tưởng gửi gắm.&nbsp;</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Chân thành cảm ơn các bạn đã xem bài viết đánh giá của mình. Có góp ý gì hay hỏi đáp gì các bạn cứ cmt bên dưới mình sẽ trả lời cho các bạn bằng tất cả khả năng kinh nghiệm của mình. Đừng quên mình cũng nhận check giày giúp các bạn nha. &lt;3</span></p>',NULL,'2021-08-22 13:58:02.150000','giay-rep-1-1-la-gi-co-nen-chon-giay-rep-1-1-giay-replica-va-replica-1-1-va-lua-ao-ban-giay-replica',1,'/media/static/4c48ecde-7f9d-43ff-8e4a-33775902dbd9.jpg','Giày Rep 1:1 là gì? Có nên chọn giày rep 1:1? Giày replica và replica 1:1 và lừa đảo bán giày replica ?',1,NULL),(2,'<p>&nbsp;</p>','2021-08-22 13:59:40.506000','<p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"font-size: 18px;\"><u><strong><span style=\"color: rgb(0, 0, 0);\">Vì Sao Giày Chuẩn Rep 1:1 Tu Shoes Lại Rẻ Nhất ?</span></strong></u></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>1. Nhập hàng trực tiếp từ nhà máy.</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Toàn bộ sản phẩm Tu Shoes đều được nhập trực tiếp từ nhà máy. Không thông qua trung gian cũng như là kiểm tra về chất lượng sản phẩm nghiêm ngặt qua nhiều bước nên Tu Shoes luôn cam kết mang đến chất lượng tốt nhất với giá tốt nhất.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>2. Đúng Giá Đúng Chất Lượng [ Nói Không Với Lừa Đảo, Bán Hàng Rác , Trộn Hàng Hoặc Đôn Hàng ]</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Mọi người hay so sánh đặt câu hỏi là vì sao cửa hàng này đắt hơn cửa hàng khác 200k, 300k hay thậm chí là 500k ? Đơn giản vì&nbsp;<strong>chất lượng hoàn toàn khác nhau</strong>&nbsp;. Tu Shoes đã làm việc trong ngành giày hơn 3 năm và hiểu rõ điều này. Nếu cửa hàng khác bán chất lượng tương tự mà giá rẻ hơn rất nhiều vậy tại sao Tu Shoes không sang bên cửa hàng đó nhập hết hàng bên đó về và bán giá cao để kiếm lời ? Chỉ đơn giản là&nbsp;<strong>chất lượng hoàn toàn khác nhau cho nên giá tiền cũng hoàn toàn khác nhau&nbsp;</strong>và những cửa hàng bán hàng rẻ tiền quảng cáo chất lượng Rep 1:1 chuẩn là đang&nbsp;<strong>lừa đảo khách hàng.</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\">&nbsp;</p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>Ví Dụ:&nbsp;</strong>Khách hàng đặt 1 sản phẩm A của Tu Shoes thì shop sẽ mất thời gian khoảng 7-10 ngày để sản phẩm đó có thể vận chuyển từ&nbsp;<b>Nhà Máy&nbsp;</b>về đến shop để giao hàng hóa hay sản phẩm chất lượng cho bạn khách hàng.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Nếu những cửa hàng khác&nbsp;cũng bán hàng rep 1:1 chất lượng tốt mà giá rẻ tại sao bên shop không qua đó lấy hàng chất lượng tốt giá rẻ như quảng cáo để trả hàng cho khách, không phải bắt khách đợi 7-10 ngày nữa&nbsp;?&nbsp;<strong>Chỉ đơn giản là những cửa hàng đó đang lừa đảo khách hàng và hàng hóa đó không đủ tiêu chuẩn Rep 1:1 như đã quảng cáo để mang đến cho khách hàng những chất lượng tốt nhất.</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong><u>Vì thế đúng giá rẻ nhất và đúng chất lượng tốt nhất chỉ có tại Tu Shoes</u></strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\">&nbsp;</p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\"><strong>3. Cửa hàng Uy Tín.</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">&nbsp;Với 1 cửa hàng uy tín thì thực hiện đầy đủ cam kết với khách hàng từ bảo hành hàng hóa, đổi trả hàng hóa cũng như việc nâng cao chất lượng phục vụ là điều quan trọng nhất.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Với TuShoes bạn có thể:</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">&nbsp;-&nbsp;<b>Đổi Hoặc Trả</b>&nbsp;sản phẩm trong 7 ngày [ Với giày chưa sử dụng không kể lí do&nbsp;]</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Bạn sẽ có 7 ngày để kiểm tra chất lượng sản phẩm, bạn có thể mang giày đi mọi cửa hàng khác để có thể so sánh về chất lượng, so sánh về giá và nếu bạn thấy bên cửa hàng Tu Shoes sai về cam kết chất lượng tốt nhất giá tốt nhất thì bạn cứ mang trả lại cho Tu Shoes.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">-&nbsp;<strong>Bảo hành 1 đổi 1 t</strong>rong 3 tháng với lỗi từ nhà sản xuất</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Với bất kì lỗi nào từ nhà máy như chất lượng không đảm bảo dẫn đến việc bung keo thì bên mình hỗ trợ nhận lại giày và đổi cho khách hàng sản phẩm mới.</span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">-&nbsp;<strong>Hỗ trợ bảo hành và sửa chữa miễn phí</strong></span></p><p style=\"margin-bottom: 10px; color: rgb(125, 125, 125); font-family: &quot;Roboto Condensed&quot;, sans-serif; font-size: 16px;\"><span style=\"color: rgb(0, 0, 0);\">Với những sản phẩm sau 3 tháng mà gặp lỗi từ giày thì bên shop vẫn sẽ nhận về và hỗ trợ sửa lại giày miễn phí cho khách hàng.</span></p>',NULL,'2021-08-22 13:59:40.506000','giay-rep-1-1-chuan-gia-re-nhat-tu-shoes',1,'/media/static/23846b4d-4790-4b04-b3ab-9b4e05f58ad8.jpg','Giày Rep 1:1 Chuẩn Giá Rẻ Nhất - Tu Shoes',1,NULL);


CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs1slvnkuemjsq2kj4h3vhx7i1` (`post_id`),
  KEY `FKm1rmnfcvq5mk26li4lit88pc5` (`product_id`),
  KEY `FKqm52p1v3o13hy268he0wcngr5` (`user_id`),
  CONSTRAINT `FKm1rmnfcvq5mk26li4lit88pc5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKqm52p1v3o13hy268he0wcngr5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKs1slvnkuemjsq2kj4h3vhx7i1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ;
CREATE TABLE `images` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_4mgw71qgyeud96uf8kgiu9fsw` (`link`),
  KEY `FKp1m9f9rm7xy8nk7a820dvh6c4` (`created_by`),
  CONSTRAINT `FKp1m9f9rm7xy8nk7a820dvh6c4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ;
INSERT INTO `images` VALUES ('0b4785c8-4aef-45fe-95a2-519b5ae63281','2021-08-22 13:54:59.371000','/media/static/0b4785c8-4aef-45fe-95a2-519b5ae63281.jpg','file',2352,'jpg',1),('1196c3f5-55fd-4ca3-8a9a-f815e59068c7','2021-08-22 13:56:04.033000','/media/static/1196c3f5-55fd-4ca3-8a9a-f815e59068c7.jpg','file',1664,'jpg',1),
('1da9ec1b-dce8-4cf5-a2db-569e8a35c895','2021-08-22 13:55:55.661000','/media/static/1da9ec1b-dce8-4cf5-a2db-569e8a35c895.jpg','file',3050,'jpg',1),('23846b4d-4790-4b04-b3ab-9b4e05f58ad8','2021-08-22 13:59:35.146000','/media/static/23846b4d-4790-4b04-b3ab-9b4e05f58ad8.jpg','file',523580,'jpg',1),
('282930fb-ef57-407e-89b7-2cfdb5cf43a0','2021-08-22 13:49:34.935000','/media/static/282930fb-ef57-407e-89b7-2cfdb5cf43a0.jpg','file',37903,'jpg',1),('3192cffa-d1af-4b88-aa96-fb4654d2db2c','2021-08-22 13:51:19.755000','/media/static/3192cffa-d1af-4b88-aa96-fb4654d2db2c.jpg','file',1784,'jpg',1),
('3bfe4266-cb35-4997-9cd1-b616a646f06d','2021-08-22 13:53:50.844000','/media/static/3bfe4266-cb35-4997-9cd1-b616a646f06d.jpg','file',2564,'jpg',1),('4c48ecde-7f9d-43ff-8e4a-33775902dbd9','2021-08-22 13:57:32.889000','/media/static/4c48ecde-7f9d-43ff-8e4a-33775902dbd9.jpg','file',278809,'jpg',1),
('5666f43f-1b9d-4dfd-aaf0-d61e83d04929','2021-08-22 13:56:01.626000','/media/static/5666f43f-1b9d-4dfd-aaf0-d61e83d04929.jpg','file',3274,'jpg',1),('5d72dcda-30cf-4931-b7ab-5157fb04fb09','2021-08-22 13:53:48.030000','/media/static/5d72dcda-30cf-4931-b7ab-5157fb04fb09.jpg','file',2570,'jpg',1),
('6f1de8cc-84cd-4da8-9e73-1b27bbf0058d','2021-08-22 13:49:26.663000','/media/static/6f1de8cc-84cd-4da8-9e73-1b27bbf0058d.jpg','file',40297,'jpg',1),
('88c9783f-3bb0-4206-83a9-361f65d72fd1','2021-08-22 13:52:34.938000','/media/static/88c9783f-3bb0-4206-83a9-361f65d72fd1.jpg','file',1872,'jpg',1),
('8b28fb59-6135-4edd-a9e9-62f2f489f041','2021-08-22 13:55:06.200000','/media/static/8b28fb59-6135-4edd-a9e9-62f2f489f041.jpg','file',1290,'jpg',1),('8dfa42c1-fdb4-4f4e-a53a-d45d62dbc936','2021-08-22 13:53:44.995000','/media/static/8dfa42c1-fdb4-4f4e-a53a-d45d62dbc936.jpg','file',2478,'jpg',1),
('95024d25-0d4a-422c-b07e-e7cf12548279','2021-08-22 13:51:25.374000','/media/static/95024d25-0d4a-422c-b07e-e7cf12548279.jpg','file',2044,'jpg',1),
('963f9593-a6d2-4a5d-ae07-87b7b9feab45','2021-08-22 13:55:59.070000','/media/static/963f9593-a6d2-4a5d-ae07-87b7b9feab45.jpg','file',3340,'jpg',1),('988dd7b0-5e8b-4707-a910-b9877970c071','2021-08-22 13:49:29.829000','/media/static/988dd7b0-5e8b-4707-a910-b9877970c071.png','file',87469,'png',1),
('a1617322-8bc9-49d4-a6f7-b79c0fe4d30f','2021-08-22 13:52:41.328000','/media/static/a1617322-8bc9-49d4-a6f7-b79c0fe4d30f.jpg','file',1914,'jpg',1),
('b5075993-78c4-4470-aa5e-99a0ba229162','2021-08-22 13:55:03.356000','/media/static/b5075993-78c4-4470-aa5e-99a0ba229162.jpg','file',2214,'jpg',1),('b915dbe3-1aaa-4d3f-b14f-f716a3bad457','2021-08-22 13:49:32.293000','/media/static/b915dbe3-1aaa-4d3f-b14f-f716a3bad457.png','file',3690,'png',1),
('bedc7a79-05b9-40ac-ba26-ba312c5da2dd','2021-08-22 13:51:22.766000','/media/static/bedc7a79-05b9-40ac-ba26-ba312c5da2dd.jpg','file',1614,'jpg',1),
('f31cfad6-07c9-48fc-a1ca-cfbba534e01b','2021-08-22 13:54:54.752000','/media/static/f31cfad6-07c9-48fc-a1ca-cfbba534e01b.jpg','file',2532,'jpg',1),('fd7ea8d3-a15b-4320-a0c4-227902fd700c','2021-08-22 13:52:38.364000','/media/static/fd7ea8d3-a15b-4320-a0c4-227902fd700c.jpg','file',2138,'jpg',1);




CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  `promotion` json DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `receiver_address` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `buyer` bigint DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `modified_by` bigint DEFAULT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKljvc97l19m7cnlopv8535hijx` (`buyer`),
  KEY `FKtjwuphstqm46uffgc7l1r27a9` (`created_by`),
  KEY `FKe0abpy849bl2ynw3468ksavvl` (`modified_by`),
  KEY `FK787ibr3guwp6xobrpbofnv7le` (`product_id`),
  CONSTRAINT `FK787ibr3guwp6xobrpbofnv7le` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKe0abpy849bl2ynw3468ksavvl` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKljvc97l19m7cnlopv8535hijx` FOREIGN KEY (`buyer`) REFERENCES `users` (`id`),
  CONSTRAINT `FKtjwuphstqm46uffgc7l1r27a9` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ;



CREATE TABLE `product_category` (
  `product_id` varchar(255) NOT NULL,
  `category_id` bigint NOT NULL,
  KEY `FKkud35ls1d40wpjb5htpp14q4e` (`category_id`),
  KEY `FK2k3smhbruedlcrvu6clued06x` (`product_id`),
  CONSTRAINT `FK2k3smhbruedlcrvu6clued06x` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKkud35ls1d40wpjb5htpp14q4e` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
);
INSERT INTO `product_category` (`product_id`, `category_id`) VALUES
('FJWheJ001', 1), -- Nike Air Max 97
('FJWheJ001', 2), -- Nike Air Max 97 appears again in category 2
('FJWheJ002', 1), -- Nike Air Force 1
('FJWheJ003', 2), -- Nike Air Zoom Pegasus 38
('FJWheJ004', 1), -- Adidas Ultraboost 21
('FJWheJ005', 3), -- Adidas NMD R1
('FJWheJ006', 2), -- Converse Chuck Taylor All Star
('FJWheJ007', 3), -- Converse One Star
('FJWheJ008', 1), -- Vans Old Skool
('FJWheJ009', 2), -- Vans Authentic
('FJWheJ010', 3), -- Nike Blazer Mid 77
('FJWheJ011', 1), -- Adidas Superstar
('FJWheJ012', 2), -- Nike React Infinity Run
('FJWheJ013', 3), -- Adidas Yeezy Boost 350
('FJWheJ014', 1), -- Converse Jack Purcell
('FJWheJ015', 2); -- Vans Sk8-Hi
CREATE TABLE `promotion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `coupon_code` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_type` int DEFAULT NULL,
  `discount_value` bigint DEFAULT NULL,
  `expired_at` datetime(6) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT NULL,
  `maximum_discount_value` bigint DEFAULT NULL,
  `name` varchar(300) NOT NULL,
  `quantity` int not null,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_acld676f1gyc04nofpb7t2ecn` (`coupon_code`)
) ;
INSERT INTO `promotion` 
(`coupon_code`, `created_at`, `discount_type`, `discount_value`, `expired_at`, `is_active`, `is_public`, `maximum_discount_value`, `name`, `quantity`) 
VALUES
('SUMMER2024', '2024-06-01 00:00:00', 1, 50000, '2024-12-31 23:59:59', 1, 1, 200000, 'Summer Sale 2024', 10),
('VIPONLY', '2024-06-15 00:00:00', 2, 20, '2024-11-30 23:59:59', 1, 0, 100000, 'VIP Exclusive Discount', 10);


CREATE TABLE `statistic` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `profit` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `sales` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKok7jp7mh6y9tghumc2do51ieq` (`order_id`),
  CONSTRAINT `FKok7jp7mh6y9tghumc2do51ieq` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
);

