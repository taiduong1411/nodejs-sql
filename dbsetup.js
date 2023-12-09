const mysql = require('mysql2');
const utilsDB = require('./utils/db')
// Connect MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'wpr',
    password: 'fit2023',
    database: 'wpr2023'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Create tables
    const createTablesQuery = [`
    CREATE TABLE IF NOT EXISTS wpr2023.users (
      id INT PRIMARY KEY auto_increment,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );`,
        `CREATE TABLE IF NOT EXISTS wpr2023.emails (
      id INT PRIMARY KEY auto_increment,
      sender_id INT,
      receiver_id INT,
      subject VARCHAR(255),
      content TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );`
    ];
    [...createTablesQuery].forEach((value, index) => {
        db.query(value, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Data inserted successfully');
            }
        });
    })

    const useDB = utilsDB.utilsDB(db)


    // Example usage
    useDB.createUser('a@a.com', 'User A', '123123');
    useDB.createUser('b@b.com', 'User B', '456456');
    useDB.createUser('c@c.com', 'User C', '789789');

    useDB.sendEmail(1, 2, 'Hello', 'Message from User A to User B');
    useDB.sendEmail(1, 2, 'Hello B', 'Message from User A to User B');
    useDB.sendEmail(1, 2, 'Hello B 2', 'Message from User A to User B');
    useDB.sendEmail(2, 1, 'Re: Hello', 'Reply from User B to User A');
    useDB.sendEmail(3, 1, 'Query', 'Message from User C to User A');
    useDB.sendEmail(3, 1, 'Hello A', 'Message from User C to User A');
    useDB.sendEmail(2, 1, 'Hello A', 'Message from User B to User A');
    useDB.sendEmail(2, 1, 'Hello A 2', 'Message from User B to User A');


    useDB.listSenderEmails(1);
    useDB.deleteEmail(2);
    useDB.getDetailEmail(3);
});

// CRUD functions

