CREATE TABLE playerbadges (
    player_badge_id SERIAL PRIMARY KEY,
    date_awarded DATE NOT NULL,
    player_id INTEGER REFERENCES players(player_id),
    badge_id INTEGER REFERENCES badges(badge_id)
);
