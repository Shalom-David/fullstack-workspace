
DROP DATABASE IF EXISTS `task 3`;

CREATE DATABASE IF NOT EXISTS `task 3`;

USE `task 3`;

CREATE TABLE IF NOT EXISTS `dev_teams` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL
);
INSERT INTO `dev_teams` (name) value('UI Team');
INSERT INTO `dev_teams` (name) value('Mobile Team');
INSERT INTO `dev_teams` (name) value('React Team');

CREATE TABLE IF NOT EXISTS `meetings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `team_id` INT NOT NULL,
    FOREIGN KEY (`team_id`)
        REFERENCES `dev_teams` (`id`)
        ON UPDATE NO ACTION ON DELETE CASCADE,
    `start_time` TIMESTAMP NOT NULL UNIQUE,
    `end_time` TIMESTAMP NOT NULL UNIQUE,
    `description` VARCHAR(255),
    `room` VARCHAR(50)
);
INSERT INTO `meetings` (team_id, start_time, end_time, description, room) values('3', '2022-12-11 09:00:00', '2022-12-11 11:00:00', 'upgrading to nextJS ', 'blue room');
INSERT INTO `meetings` (team_id, start_time, end_time, description, room) values('2', '2022-12-11 08:00:00', '2022-12-11 10:00:00', 'mobile optimization', 'green room');
INSERT INTO `meetings` (team_id, start_time, end_time, description, room) values('1', '2022-12-11 11:00:00', '2022-12-11 14:00:00', 'discussing UI bugs and feature updates', 'red room');


