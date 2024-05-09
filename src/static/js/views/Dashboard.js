import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    params.viewName = "Dashboard";
    super(params);
  }

  async onMounted() {
    this.populateLeaderboard();
    this.populateBadges();
  }

  async populateBadges() {
    const badges = document.querySelector("#badge-list");
    const spinner = document.getElementById("badge-spinner");
    try {
      const response = await fetch("/api/v1/playerbadges");
      if (!response.ok) {
        throw new Error("Failed to fetch badges data");
      }
      const data = await response.json();
      if (data.length === 0) {
        let p = document.createElement("p");
        p.innerText =
          "Ohhh no! You don't have any badges yet! Perhaps you should play the game to earn some!";
        badges.appendChild(p);
      }
      spinner.classList.add("none");

      data.map((element) => {
        let img = document.createElement("img");
        img.classList.add("badge-item");
        img.src = element.badge_url;
        img.alt = element.badge_name;
        badges.appendChild(img);
      });
    } catch (error) {
      console.error("Error fetching badges data:", error);
    }
  }

  async populateLeaderboard() {
    const leaderboard = document.querySelector("#leaderboard-list");
    const spinner = document.getElementById("leaderboard-spinner");

    try {
      const response = await fetch("/api/v1/scores/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      if (!leaderboard) {
        return;
      }

      spinner.classList.add("none");

      data.forEach((element) => {
        let li = document.createElement("li");
        li.innerText = element.username;

        let small = document.createElement("small");
        small.innerText = element.high_score;

        li.appendChild(small);
        leaderboard.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  }
}
