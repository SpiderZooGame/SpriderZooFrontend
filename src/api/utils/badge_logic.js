const pool = require("../../../database-connection");
const badgeQueries = require("../queries/badgeQueries");
const scoreQueries = require("../queries/scoreQueries");


const rewardCellarBadge = (player_id) => {
    const badge_id = 1;
    const date = new Date();

    return new Promise((resolve, reject) => {
        pool.query(badgeQueries.hasBadge, [player_id, badge_id], (hasBadgeError, hasBadgeResult) => {
            if (hasBadgeError) {
                reject(hasBadgeError);
            } else {
                // check if player already has the badge
                if (!hasBadgeResult.rows[0].has_badge) {
                    pool.query(badgeQueries.getBadge, [badge_id], (getBadgeError, getBadgeResult) => {
                        if (getBadgeError) {
                            reject(getBadgeError);
                        } else {
                            pool.query(badgeQueries.addPlayerBadge, [date.toLocaleDateString(), player_id, badge_id], (addPlayerBadgeError, _) => {
                                if (addPlayerBadgeError) {
                                    reject(addPlayerBadgeError);
                                } else {
                                    resolve(getBadgeResult.rows);
                                }
                            });
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        });
    });
}

const rewardWolfBadge = (player_id) => {
    const badge_id = 2;
    const date = new Date(player_id);

    return new Promise((resolve, reject) => {
        pool.query(badgeQueries.hasBadge, [player_id, 2], (hasBadgeError, hasBadgeResult) => {
            if (hasBadgeError) {
                reject(hasBadgeError);
            } else {
                if (!hasBadgeResult.rows[0].has_badge) {
                    pool.query(scoreQueries.getPlayerScores, [player_id], (getPlayerScoresError, getPlayerScoresResult) => {
                        if (getPlayerScoresError) {
                            reject(getPlayerScoresError);
                        } else {
                            if (getPlayerScoresResult.rowCount >= 5) {
                                pool.query(badgeQueries.getBadge, [badge_id], (getBadgeError, getBadgeResult) => {
                                    if (getBadgeError) {
                                        reject(getBadgeError);
                                    } else {
                                        pool.query(badgeQueries.addPlayerBadge, [date.toLocaleDateString(), player_id, badge_id], (addPlayerBadgeError, _) => {
                                            if (addPlayerBadgeError) {
                                                reject(addPlayerBadgeError);
                                            } else {
                                                resolve(getBadgeResult.rows);
                                            }
                                        });
                                    }
                                });
                            } else {
                                resolve([]);
                            }
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        });
    });
}

const rewardBlackWidowBadge = (player_id) => {
    const badge_id = 3;
    const streak = 5;
    const date = new Date();

    return new Promise((resolve, reject) => {
        pool.query(badgeQueries.hasBadge, [player_id, badge_id], (hasBadgeError, hasBadgeResult) => {
            if (hasBadgeError) {
                reject(hasBadgeError);
            } else {
                if (!hasBadgeResult.rows[0].has_badge) {
                    pool.query(scoreQueries.hasPlayedConsecutiveDays, [player_id, streak], (streakError, streakResult) => {
                        if (streakError) {
                            resolve(streakError)
                        } else {
                            if (streakResult.rows[0].has_consecutive_scores) {
                                pool.query(badgeQueries.getBadge, [badge_id], (getBadgeError, getBadgeResult) => {
                                    if (getBadgeError) {
                                        reject(getBadgeError);
                                    } else {
                                        pool.query(badgeQueries.addPlayerBadge, [date.toLocaleDateString(), player_id, badge_id], (addPlayerBadgeError, _) => {
                                            if (addPlayerBadgeError) {
                                                reject(addPlayerBadgeError);
                                            } else {
                                                console.log(streakResult.rows[0].has_consecutive_scores);
                                                resolve(getBadgeResult.rows);
                                            }
                                        });
                                    }
                                });
                            } else {
                                resolve([]);
                            }
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        });
    });
}

const rewardBrownRecluseBadge = (player_id) => {
    const badge_id = 4;
    const streak = 15;
    const date = new Date();

    return new Promise((resolve, reject) => {
        pool.query(badgeQueries.hasBadge, [player_id, badge_id], (hasBadgeError, hasBadgeResult) => {
            if (hasBadgeError) {
                reject(hasBadgeError);
            } else {
                if (!hasBadgeResult.rows[0].has_badge) {
                    pool.query(scoreQueries.hasPlayedConsecutiveDays, [player_id, streak], (streakError, streakResult) => {
                        if (streakError) {
                            resolve(streakError)
                        } else {
                            if (streakResult.rows[0].has_consecutive_scores) {
                                pool.query(badgeQueries.getBadge, [badge_id], (getBadgeError, getBadgeResult) => {
                                    if (getBadgeError) {
                                        reject(getBadgeError);
                                    } else {
                                        pool.query(badgeQueries.addPlayerBadge, [date.toLocaleDateString(), player_id, badge_id], (addPlayerBadgeError, _) => {
                                            if (addPlayerBadgeError) {
                                                reject(addPlayerBadgeError);
                                            } else {
                                                resolve(getBadgeResult.rows);
                                            }
                                        });
                                    }
                                });
                            } else {
                                resolve([]);
                            }
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        });
    });
}

module.exports = {
    rewardCellarBadge,
    rewardWolfBadge,
    rewardBlackWidowBadge,
    rewardBrownRecluseBadge,
}
