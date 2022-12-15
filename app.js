const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const DbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: DbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// ALL Players API

app.get("/players/", async (request, response) => {
  const getRequest = `
SELECT * FROM cricket_team ORDER BY player_id;`;
  const teamPlayers = await db.all(getRequest);
  response.send(teamPlayers);
});

// POST players API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postRequest = `
INSERT INTO 
cricket_team ( player_name,jersey_number,role )
VALUES
      (
        '${playerName}',
         ${jerseyNumber},
        '${role}'
      );`;
  const dbResponse = await db.run(postRequest);

  response.send("Player Added to Team");
});

// GET player API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const singlePlayerRequest = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const dbResponse = await db.get(singlePlayerRequest);
  response.send(dbResponse);
});

// PUT players API

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putRequest = `UPDATE cricket_team SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
     WHERE
      player_id = ${playerId};`;
  const dbResponse = await db.run(putRequest);
  response.send("Player Details Updated");
});

// DELETE player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteRequest = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  const dbResponse = await db.run(deleteRequest);
  response.send("Player Removed");
});

module.exports = express;
