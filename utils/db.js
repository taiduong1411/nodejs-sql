
// Connect to MySQL
const utilsDB = (db) => ({
    // CRUD functions

    // Create a user
    createUser: async (email, name, password) => {
        return new Promise(function (resolve, reject) {

            const createUserQuery = 'INSERT INTO users (email, name, password) VALUES (?, ?, ?)';
            const values = [email, name, password];

            db.query(createUserQuery, values, (error, results) => {
                if (error) throw error;
                else {
                    console.log(`User created with ID: ${results.insertId}`);
                    resolve(results[0]);
                }
            });
        })
    },

    // Create a user
    getUser: (email, password, res) => {

        return new Promise(function (resolve, reject) {
            const getUserQuery = 'SELECT * FROM wpr2023.users WHERE email = ? AND password = ?';
            const values = [email, password];

            db.query(getUserQuery, values, (error, results) => {
                if (error) throw error;
                else {
                    resolve(results[0]);
                }
            });
        })

    },

    // List all emails of a user
    listSenderEmails: async (userId) => {
        const listEmailsQuery = 'SELECT * FROM emails WHERE sender_id = ?';
        const values = [userId];

        db.query(listEmailsQuery, values, (error, results) => {
            if (error) throw error;
            else {
                console.log(`Emails for Sender with ID ${userId}:`);
                console.log(results);
            }
        });
    },
    // List all emails of a user
    listReceiverEmails: async (userId) => {
        const listEmailsQuery = 'SELECT * FROM emails WHERE receiver_id = ?';
        const values = [userId];

        db.query(listEmailsQuery, values, (error, results) => {
            if (error) throw error;
            else {
                console.log(`Emails for Sender with ID ${userId}:`);
                console.log(results);
            }
        });
    },

    // Send an email
    sendEmail: async (senderId, receiverId, subject, content) => {
        const sendEmailQuery = 'INSERT INTO emails (sender_id, receiver_id, subject, content) VALUES (?, ?, ?, ?)';
        const values = [senderId, receiverId, subject, content];

        db.query(sendEmailQuery, values, (error, results) => {
            if (error) throw error;
            else {
                console.log(`Email sent with ID: ${results.insertId}`);
            }
        });
    },

    // Delete an email
    deleteEmail: async (emailId) => {
        const deleteEmailQuery = 'DELETE FROM emails WHERE id = ?';
        const values = [emailId];

        db.query(deleteEmailQuery, values, (error) => {
            if (error) throw error;
            else {
                console.log(`Email with ID ${emailId} deleted`);
            }
        });
    }
    ,
    // Get emails of a user
    getDetailEmail: async (emailId) => {
        const getEmailsQuery = 'SELECT * FROM emails WHERE id = ?';
        const values = [emailId];

        db.query(getEmailsQuery, values, (error, results) => {
            if (error) throw error;
            else {
                console.log(`Emails for user with ID ${emailId}:`);
                return results;
            }
        });
    }


});


exports.utilsDB = utilsDB
