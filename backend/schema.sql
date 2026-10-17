-- Question 3: Student Timetable & Goals (resource: timetable, table: timetable)
CREATE TABLE IF NOT EXISTS timetable (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code VARCHAR(20)  NOT NULL,
  course_name VARCHAR(150),
  lecturer    VARCHAR(100),
  day_of_week VARCHAR(10),
  start_time  VARCHAR(5),
  end_time    VARCHAR(5),
  venue       VARCHAR(80),
  goal        TEXT,
  goal_status VARCHAR(20) NOT NULL DEFAULT 'Not Started',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO timetable (course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal, goal_status) VALUES
('CSC2101', 'Data Structures and Algorithms', 'Dr. Banda',   'Monday',    '08:00', '10:00', 'Lecture Hall 1', 'Score at least 75% in the mid-semester test', 'In Progress'),
('CSC2103', 'Database Systems',               'Mr. Phiri',   'Monday',    '10:30', '12:30', 'Computer Lab 2', 'Finish the CRUD app assignment before the deadline', 'In Progress'),
('CSC2105', 'Web Development',                'Ms. Mwansa',  'Tuesday',   '09:00', '11:00', 'Computer Lab 1', 'Build and deploy a portfolio website', 'Not Started'),
('MAT2102', 'Discrete Mathematics',           'Dr. Zulu',    'Tuesday',   '13:00', '15:00', 'Lecture Hall 3', 'Complete all tutorial sheets weekly', 'In Progress'),
('CSC2107', 'Operating Systems',              'Mr. Tembo',   'Wednesday', '08:00', '10:00', 'Lecture Hall 2', 'Understand process scheduling and memory management', 'Not Started'),
('CSC2109', 'Computer Networks',              'Dr. Mumba',   'Wednesday', '11:00', '13:00', 'Network Lab',    'Configure a small LAN in the practical session', 'Achieved'),
('COM2101', 'Communication Skills',           'Ms. Chanda',  'Thursday',  '09:00', '11:00', 'Lecture Hall 4', 'Deliver a 10 minute presentation confidently', 'Achieved'),
('CSC2111', 'Software Engineering',           'Dr. Lungu',   'Thursday',  '14:00', '16:00', 'Lecture Hall 1', 'Submit the group project SRS document', 'In Progress'),
('STA2101', 'Probability and Statistics',     'Mr. Mulenga', 'Friday',    '08:00', '10:00', 'Lecture Hall 5', 'Improve quiz scores to above 70%', 'Not Started'),
('CSC2113', 'Object-Oriented Programming',    'Ms. Sakala',  'Friday',    '10:30', '12:30', 'Computer Lab 3', 'Complete the Java mini project', 'In Progress');
