const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "pauloramos12",
  database: "crudgames",
});

app.use(express.json());
app.use(cors());

app.post("/saveWinner", (req, res) => {
  const { winner } = req.body;

  let mysql = "INSERT INTO winners (winner) VALUES (?)";
  db.query(mysql, [winner], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao salvar vencedor");
    } else {
      res.status(200).send("Vencedor salvo com sucesso!");
    }
  });
});

app.get("/winners", (req, res) => {
  const { limit = 5, offset = 0 } = req.query;

  let mysql = `SELECT * FROM winners LIMIT ${offset}, ${limit}`;

  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao buscar vencedores");
    } else {
      res.status(200).send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});