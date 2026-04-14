-- ============================================================
--  Funkidz Animation — Seed Data v2 (PostgreSQL, UUID PKs)
-- ============================================================

-- SERVICES
INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'Animation Anniversaire Classique', 'Une animation festive complète pour l anniversaire de votre enfant. Au programme : jeux collectifs, musique, activités créatives et distribution de cadeaux. L animateur prend en charge un groupe de jusqu à 15 enfants et crée une ambiance inoubliable.', 180.0, 120, 'Anniversaire', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('23b8c1e9-3924-46de-beb1-3b9046685257', 'Animation Anniversaire Premium', 'Notre formule premium pour un anniversaire hors du commun. Inclut une mascotte surprise, des jeux scéniques, un atelier maquillage, une chasse au trésor personnalisée et un spectacle de magie. Idéal pour les grands groupes jusqu à 25 enfants.', 320.0, 180, 'Anniversaire', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', 'Spectacle de Magie', 'Un spectacle de magie interactif et participatif adapté aux enfants de 4 à 12 ans. Tours de magie époustouflants, numéros de close-up et participation des enfants sur scène.', 220.0, 60, 'Spectacle', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('972a8469-1641-4f82-8b9d-2434e465e150', 'Atelier Créatif', 'Un atelier ludique et éducatif où les enfants créent leur propre oeuvre : peinture sur tissu, sculpture en argile, création de bijoux ou fabrication de slime. Matériel fourni, encadrement pédagogique inclus.', 150.0, 90, 'Atelier', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('17fc695a-07a0-4a6e-8822-e8f36c031199', 'Animation Sportive et Jeux', 'Une animation dynamique axée sur le sport et les jeux en plein air ou en salle. Olympiades, relais, parcours d obstacles, quiz sportifs et tournois.', 160.0, 120, 'Sport', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('9a1de644-815e-46d1-bb8f-aa1837f8a88b', 'Escape Game Enfants', 'Un escape game immersif conçu spécialement pour les enfants de 6 à 14 ans. Enigmes, codes secrets et défis en équipe. Scénarios : Le trésor du pirate, La forêt enchantée, Mission espace.', 250.0, 90, 'Jeu', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'Karaoké et Danse', 'Une animation musicale festive avec karaoké, blind test musical, concours de danse et chorégraphies collectives. Adapté de 6 à 15 ans.', 200.0, 120, 'Musique', TRUE, NOW(), NOW());

INSERT INTO services (id, title, description, base_price, duration_minutes, category, is_active, created_at, updated_at) VALUES
('6b65a6a4-8b81-48f6-b38a-088ca65ed389', 'Animation Contes et Théâtre', 'Une expérience artistique unique où les enfants deviennent les héros d une histoire interactive. L animateur-comédien invite les enfants à jouer des rôles, improviser et créer ensemble.', 170.0, 90, 'Artistique', TRUE, NOW(), NOW());

-- OPTIONS
INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('47378190-96da-4dac-b2ff-5d2a386ecbe0', 'Mascotte surprise', 'Visite d une mascotte costumée (lapin, ours, super-héros) pendant 30 min. Photos avec les enfants incluses.', 50.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('c241330b-01a9-471f-9e8a-774bcf36d58b', 'Gateau anniversaire', 'Gateau personnalisé livré sur place : prénom de l enfant, thème au choix (licorne, dinosaure, super-héros, princesse). 12 parts.', 45.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('6c307511-b2b9-437a-a8df-6ec4ce4a2bbd', 'Photobooth', 'Coin photobooth avec accessoires et impression instantanée des photos pour chaque enfant.', 60.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('371ecd7b-27cd-4130-8722-9389571aa876', 'Sono et Lumières', 'Équipement son professionnel (enceinte 400W) + jeux de lumières LED et stroboscope.', 40.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('1a2a73ed-562b-4f79-8374-59eef50bea63', 'Décoration thématique', 'Décoration complète : ballons, banderoles, nappes. Thèmes : Jungle, Espace, Princesse, Ninja.', 55.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('5be6128e-18c2-4797-a142-ea7d17be3111', 'Chasse au trésor scénarisée', 'Scénario personnalisé avec le prénom de l enfant, carte au trésor, énigmes adaptées à l âge.', 35.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('43b7a3a6-9a8d-4a03-980d-7b71d8f56413', 'Atelier maquillage', 'Maquillage artistique réalisé par l animateur. Produits certifiés hypoallergéniques.', 30.0, 'FIXED', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('759cde66-bacf-43d0-8b1f-9163ce9ff57f', 'Sachet cadeau invités', 'Sachet surprise pour chaque invité : bonbons, petits jouets, stickers, crayon personnalisé.', 5.0, 'PER_CHILD', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('ec1b8ca1-f91e-4d4c-9ff4-9b7889463e85', 'Candy bar', 'Table de confiseries décorée : bocaux de bonbons, guimauves, sucettes, chocolats.', 8.0, 'PER_CHILD', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('4b0dbb41-8d52-48f1-942c-3fe860e7a113', 'Kit créatif individuel', 'Kit complet pour chaque enfant : peintures, pinceaux, tablier, support à personnaliser.', 6.0, 'PER_CHILD', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('e2acf72f-9e57-4f7a-a0ee-89aed453dd32', 'Médaille et diplôme', 'Médaille gravée + diplôme personnalisé pour chaque participant.', 3.5, 'PER_CHILD', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('3139d32c-93cd-49bf-9c94-1cf0dc98d2c1', 'Chapeau de fête', 'Chapeau de fête personnalisé avec le prénom de chaque enfant.', 2.0, 'PER_CHILD', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('a9488d99-0bbb-4599-91ce-5dd2b45ed1f0', 'Heure supplémentaire animateur', 'Extension de la durée de l animation d une heure supplémentaire.', 60.0, 'PER_HOUR', TRUE);

INSERT INTO options (id, name, description, price, pricing_type, is_active) VALUES
('fc377a4c-4a15-444d-85e7-ce8a3a578a8e', 'Deuxième animateur', 'Ajout d un deuxième animateur pour les grands groupes ou pour une animation plus interactive.', 55.0, 'PER_HOUR', TRUE);

-- SERVICE_OPTIONS
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '47378190-96da-4dac-b2ff-5d2a386ecbe0');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '5be6128e-18c2-4797-a142-ea7d17be3111');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '43b7a3a6-9a8d-4a03-980d-7b71d8f56413');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'ec1b8ca1-f91e-4d4c-9ff4-9b7889463e85');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('bdd640fb-0667-4ad1-9c80-317fa3b1799d', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', 'ec1b8ca1-f91e-4d4c-9ff4-9b7889463e85');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('23b8c1e9-3924-46de-beb1-3b9046685257', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('bd9c66b3-ad3c-4d6d-9a3d-1fa7bc8960a9', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', '4b0dbb41-8d52-48f1-942c-3fe860e7a113');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('972a8469-1641-4f82-8b9d-2434e465e150', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', 'ec1b8ca1-f91e-4d4c-9ff4-9b7889463e85');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('17fc695a-07a0-4a6e-8822-e8f36c031199', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('9a1de644-815e-46d1-bb8f-aa1837f8a88b', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', '371ecd7b-27cd-4130-8722-9389571aa876');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'ec1b8ca1-f91e-4d4c-9ff4-9b7889463e85');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('b74d0fb1-32e7-4629-8fad-c1a606cb0fb3', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', 'c241330b-01a9-471f-9e8a-774bcf36d58b');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', '6c307511-b2b9-437a-a8df-6ec4ce4a2bbd');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', '1a2a73ed-562b-4f79-8374-59eef50bea63');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', '43b7a3a6-9a8d-4a03-980d-7b71d8f56413');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', '759cde66-bacf-43d0-8b1f-9163ce9ff57f');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', 'e2acf72f-9e57-4f7a-a0ee-89aed453dd32');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', '3139d32c-93cd-49bf-9c94-1cf0dc98d2c1');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', 'a9488d99-0bbb-4599-91ce-5dd2b45ed1f0');
INSERT INTO service_options (service_id, option_id) VALUES ('6b65a6a4-8b81-48f6-b38a-088ca65ed389', 'fc377a4c-4a15-444d-85e7-ce8a3a578a8e');
