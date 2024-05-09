import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    params.viewName = "Dashboard";
    super(params);
  }

  async onMounted() {
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
