import Express from "express";
import db3 from "sqlite3";

const app = new Express();

// Create the database connection
// and create the database if it doesn't exist
const db_conn = new db3.Database("Studenti.db");

// Create the table if it doesn't exist
db_conn.run(
  "CREATE TABLE IF NOT EXISTS studenti (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, birthdate TEXT, matricola INTEGER UNIQUE, email TEXT UNIQUE, className TEXT)");

// Close the database connection
db_conn.close();

// Enable JSON body parsing
app.use(Express.json());

// Enable URL encoded body parsing
app.use(Express.urlencoded({ extended: true }));

// Enable requests from all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Manage post request to insert a new student
app.post("/insert", (req, res) => {
    const { name, surname, birthdate, matricola, email, className } = req.body;
    const db_conn = new db3.Database("Studenti.db");
    db_conn.run(
        "INSERT INTO studenti (name, surname, birthdate, matricola, email, className) VALUES (?, ?, ?, ?, ?, ?)",
        [name, surname, birthdate, matricola, email, className],
        (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send("Student inserted");
        }
        }
    );
    db_conn.close();
    });


    // Manage get request to get all students
    app.get("/all", (req, res) => {
        const db_conn = new db3.Database("Studenti.db");
        db_conn.all("SELECT * FROM studenti", (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(rows);
        }
        });
        db_conn.close();
    });

    // Manage get request to get a student by matricola
    app.get("/student/:matricola", (req, res) => {
        const db_conn = new db3.Database("Studenti.db");
        db_conn.get(
        "SELECT * FROM studenti WHERE matricola = ?",
        [req.params.matricola],
        (err, row) => {
            if (err) {
            res.status(500).send(err.message);
            } else {
            res.status(200).send(row);
            }
        }
        );
        db_conn.close();
    });

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });

