CREATE TABLE Bronze_Event_Data
(
    'Pri' varchar(10),
    'Version' INT,
    'ISOTimeStamp' TIMESTAMP,
    'Hostname' VARCHAR(255),
    'Application' VARCHAR(255),
    'PID'int,
    'MessageId' VARCHAR(255),
    'Keywords' VARCHAR(255), 
    'EventType' VARCHAR(255),
    'EventId' INT,
    'ProviderGuId' VARCHAR(255),
    'Version' INT,
    'Task' INT, 
    'OpCodeValue' INT,
    'RecordNumber' INT,
    'ThreadId' INT,
    'Channel' VARCHAR(255),
    'Domain' VARCHAR(255),
    'AccountName' VARCHAR(255),
    'UserId' VARCHAR(255),
    'AccountType' VARCHAR(255),
    'RuleId' VARCHAR(255),
    'RuleName' VARCHAR(255),
    'Origin' INT,
    'ApplicationPath' VARCHAR(255),
    'Direction' INT, 
    'Protocol' INT, 
    'LocalPorts' VARCHAR(255),
    'RemotePorts' VARCHAR(255),
    'Action' INT, 
    'Profiles' INT,
    'LocalAddresses' VARCHAR(255),
    'RemoteAddresses' VARCHAR(255),
    'Flags' INT,
    'Active' INT,
    'EdgeTraversal' INT,
    'LooseSourceMapped' INT,
    'SecurityOptions' INT,
    'ModifyingUser' VARCHAR(255),
    'ModifyingApplication' VARCHAR(255),
    'SchemaVersion' INT,
    'RuleStatus' INT,
    'LocalOnlyMapped' INT,
    'ErrorCode' INT,
    'EventReceivedTime' TIMESTAMP,
    'SourceModuleName' VARCHAR(255),
    'SourceModuleType' VARCHAR(255),
    'Message'  MEDIUMTEXT,
)



CREATE TABLE Alert
(
    'Alert_Id' INT AUTO_INCREMENT PRIMARY KEY,
    'Timestamp' TIMESTAMP,
    'Event_id' INT NOT NULL,
    'Status' ENUM('Investigated', 'Not_Investigated') NOT NULL,
    'Rule_Id' INT NOT NULL, 
    FOREIGN KEY (Event_Id) REFFERENCES Event_Data(Event_Id),
); 

CREATE TABLE Assigned_Alert
(
    'User_Name' VARCHAR(15) NOT NULL,
    'Alert_Id' INT NOT NULL,
    FOREIGN KEY (User_Name) REFFERENCES User(User_Name),
    FOREIGN KEY (Alert_Id) REFFERENCES Alert(Alert_Id),
); 

CREATE TABLE Employee
(
    'Employee_Id' VARCHAR(10) NOT NULL PRIMARY KEY,
    'First_Name' VARCHAR(20) NOT NULL,
    'Last_Name' VARCHAR(20) NOT NULL,
    'email' VARCHAR(80),
);

CREATE TABLE Event_Data
(
    'Event_Id' INT AUTO_INCREMENT Primary Key,
    'Timestamp' TIMESTAMP,
    'Source_Id' INT NOT NULL,
    'Rule_Id' TEXT NOT NULL,
    FOREIGN KEY (Source_Id) REFFERENCES Bronze_Event_Data(External_Id),
    FOREIGN KEY (Rule_Id) REFFERENCES Rules(Rule_Id), 
);

CREATE TABLE Incident_Report
(
    'Delivery_id' INT AUTO_INCREMENT PRIMARY KEY,
    'Type' VARCHAR(20) NOT NULL,
    'Status' ENUM('ongoing', 'closed') NOT NULL,
    'Source_Id' INT NOT NULL,
    'Rule_Id' TEXT,
    'User_Id' VARCHAR(15) NOT NULL,
    'Description' TEXT,
);

CREATE TABLE Role
(
    'Role_Id' VARCHAR(10) PRIMARY KEY,
    "Name" VARCHAR(20)
);

CREATE TABLE Role_Permission
(
    'Role_Permission_Id' VARCHAR(10) PRIMARY KEY,
    'Permission_Id' VARCHAR(10),
    FOREIGN KEY (Permission_Id) REFFERENCES Permission(Permission_Id),
);

CREATE TABLE Rules
(
    'Rule_Id' INT AUTO_INCREMENT PRIMARY KEY,
    'Rule_Name' VARCHAR(30),
    'Description' VARCHAR(255),
    'Conditions' TEXT,
)

CREATE TABLE Permission
(
    'Permission_Id' VARCHAR(10) PRIMARY KEY,
    'Name' VARCHAR(20),
);

CREATE TABLE User
(
    'User_Id' VARCHAR(15) Primary Key,
    'User_Name' VARCHAR(15),
    'Password' VARCHAR(255),
    'Role_Id' VARCHAR(15),
    FOREIGN KEY (Role_Id) REFFERENCES Role(Role_Id),
);

