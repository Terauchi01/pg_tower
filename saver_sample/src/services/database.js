import net from 'net';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pgtower',
});

export const connect = () => {
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL DB!");
  });
};

