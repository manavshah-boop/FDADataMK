// table.js
/*
Author: Manav Shah
Description: Logic related to displaying and building the table page
Date: 09/23/2023
*/

characters = window.characters;
console.log(characters);

component.table = function () {
  component.apply(this, arguments);
};
assessment.extend(component.table, component);

/// Function to populate the results table with API data
function populateResultsTable(apiData) {
  const resultsTable = document.querySelector(".results-table table");
  const tableBody = document.createElement("tbody");

  // Check if the API data is an array
  if (!Array.isArray(apiData)) {
    console.error("API response is not in the expected format.");
    return;
  }
  // Create a header row
  const headerRow = document.createElement("tr");

  // Create header cells for each column
  const placeHeader = document.createElement("th");
  placeHeader.textContent = "Place";
  headerRow.appendChild(placeHeader);

  const playerHeader = document.createElement("th");
  playerHeader.textContent = "Player";
  headerRow.appendChild(playerHeader);

  const termHeader = document.createElement("th");
  termHeader.textContent = "Term";
  headerRow.appendChild(termHeader);

  const countHeader = document.createElement("th");
  countHeader.textContent = "Count";
  headerRow.appendChild(countHeader);

  // Append the header row to the table
  resultsTable.appendChild(headerRow);
  // Create table rows for each data item
  apiData.forEach((item, index) => {
    // Create a row for each data item
    const row = document.createElement("tr");

    // Create and append cells for finishing position, character image, term, and count
    if (index == 0) {
      //For 1st place use gif
      const positionCell = document.createElement("td");
      const positionGif = document.createElement("img");
      positionGif.src = "characters/1st.gif";
      positionGif.alt = "Winner";
      positionGif.style.width = "30%"; // Set the width to 100% of its container
      positionGif.style.height = "30%"; // Set the height to 100% of its container
      positionCell.appendChild(positionGif);
      row.appendChild(positionCell);
    } else {
      // Label the leaderboard places
      const positionCell = document.createElement("td");
      positionCell.textContent = index + 1; // Finishing position from 1 to 15
      positionCell.style.fontFamily = "'MarioKartFont', sans-serif";
      positionCell.style.fontSize = "1.5em";
      row.appendChild(positionCell);
    }

    const characterCell = document.createElement("td");
    const characterImage = document.createElement("img");
    characterImage.src = characters[index].imagePath; // Use the character's image path
    characterImage.alt = characters[index].name; // Use the character's name or identifier
    characterImage.classList.add("character-image");
    characterCell.appendChild(characterImage);
    row.appendChild(characterCell);

    const termCell = document.createElement("td");
    termCell.textContent = item.term; // Assign term to termcell
    termCell.style.fontSize = "1.5em";
    row.appendChild(termCell);

    const countCell = document.createElement("td");
    countCell.textContent = item.count;
    countCell.style.fontSize = "1.5em";
    row.appendChild(countCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  resultsTable.appendChild(tableBody);
}

// Call the API and populate the results table
assessment.fda_api(
  "https://api.fda.gov/drug/label.json?search=indications_and_usage:headache&count=openfda.route.exact&api_key=y6ar0SviE1KN5TtgOEkr3kLbADgBgnoCl2fenZbF",
  function (data) {
    populateResultsTable(data);
  },
  function (error) {
    console.error("API request failed:", error);
  }
);
