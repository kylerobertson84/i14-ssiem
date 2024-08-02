
CREATE DATABASE IF NOT EXISTS siem_db;

USE siem_db;

CREATE TABLE IF NOT EXISTS Bronze_Event_Data(
    id INT AUTO_INCREMENT PRIMARY KEY,
    EventTime VARCHAR(255) NOT NULL,
    Hostname VARCHAR(255) NOT NULL,
    Keywords VARCHAR(255) NOT NULL,
    EventType VARCHAR(255) NOT NULL, 
    SeverityValue INT NOT NULL, 
    Severity VARCHAR(255) NOT NULL, 
    EventID INT NOT NULL, 
    SourceName VARCHAR(255) NOT NULL, 
    ProviderGuid VARCHAR(255) NOT NULL, 
    Version_ INT NOT NULL, 
    Task INT NOT NULL,
    OpcodeValue INT NOT NULL,
    RecordNumber INT NOT NULL,
    ProcessID INT NOT NULL,
    ThreadID INT NOT NULL,
    Channel VARCHAR(255) NOT NULL,
    Domain VARCHAR(255) NOT NULL,
    AccountName VARCHAR(255) NOT NULL,
    UserID VARCHAR(255) NOT NULL,
    AccountType VARCHAR(255) NOT NULL,
    Message_ VARCHAR(255) NOT NULL,
    Opcode VARCHAR(255) NOT NULL,
    EventReceivedTime VARCHAR(255) NOT NULL,
    SourceModuleName VARCHAR(255) NOT NULL,
    SourceModuleType VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Employee
(
    Employee_Id VARCHAR(10) NOT NULL PRIMARY KEY,
    First_Name VARCHAR(20) NOT NULL,
    Last_Name VARCHAR(20) NOT NULL,
    email VARCHAR(80)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Role
(
    Role_Id VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Rules
(
    Rule_Id INT AUTO_INCREMENT PRIMARY KEY,
    Rule_Name VARCHAR(30),
    Description VARCHAR(255),
    Conditions TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Event_Data
(
    Event_Id INT AUTO_INCREMENT PRIMARY KEY,
    Time_stamp TIMESTAMP,
    Source_Id INT NOT NULL,
    Rule_Id INT NOT NULL,
    FOREIGN KEY (Source_Id) REFERENCES Bronze_Event_Data(id),
    FOREIGN KEY (Rule_Id) REFERENCES Rules(Rule_Id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Alert
(
    Alert_Id INT AUTO_INCREMENT PRIMARY KEY,
    Time_stamp TIMESTAMP,
    Event_id INT NOT NULL,
    _Status ENUM('Investigated', 'Not_Investigated') NOT NULL,
    Rule_Id INT NOT NULL, 
    FOREIGN KEY (Event_Id) REFERENCES Event_Data(Event_Id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS User
(
    User_Id VARCHAR(15) Primary Key,
    User_Name VARCHAR(15),
    _password VARCHAR(255),
    Role_Id VARCHAR(10),
    FOREIGN KEY (Role_Id) REFERENCES Role(Role_Id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Assigned_Alert
(
    User_Id VARCHAR(15) NOT NULL,
    Alert_Id INT NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES User(User_Id),
    FOREIGN KEY (Alert_Id) REFERENCES Alert(Alert_Id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Incident_Report
(
    Delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,
    Status ENUM('ongoing', 'closed') NOT NULL,
    Source_Id INT NOT NULL,
    Rule_Id TEXT,
    User_Id VARCHAR(15) NOT NULL,
    _description TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Permission
(
    Permission_Id VARCHAR(10) PRIMARY KEY,
    _Name VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Role_Permission
(
    Role_Permission_Id VARCHAR(10) PRIMARY KEY,
    Permission_Id VARCHAR(10),
    FOREIGN KEY (Permission_Id) REFERENCES Permission(Permission_Id)
) ENGINE=InnoDB;



