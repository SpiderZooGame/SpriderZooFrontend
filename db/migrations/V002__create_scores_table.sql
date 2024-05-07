CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    score INTEGER NOT NULL,
    score_date DATE NOT NULL,
    player_id INTEGER REFERENCES players(player_id)
);
