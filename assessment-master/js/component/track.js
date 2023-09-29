// track.js
/*
Author: Manav Shah
Description: Logic related to running and displaying the race
Date: 09/28/2023
*/

characters = window.characters;
var characterPositions = []; // Array to store character positions

component.track = function () {
  component.apply(this, arguments);
};
assessment.extend(component.track, component);

function populateData(apiData) {
  // Iterate through the API data and push the data into characterPositions array
  apiData.forEach((item, index) => {
    // Push the object into the characterPositions array
    characterPositions[index] = item.count;
  });
}

// Get a reference to the race track container element
const raceTrack = document.querySelector(".race-track");
const background = document.querySelector(".bullet-bill");

// Select all the lane elements within the race track
const lanes = raceTrack.querySelectorAll(".lane");

// Define the fixed width and height for character images
const imageWidth = "80px"; // Adjust to your desired width
var imageHeight = "80px"; // Adjust to your desired height

// Define the total race track height in pixels
var raceTrackHeightInPixels = raceTrack.offsetHeight;
raceTrackHeightInPixels -= parseInt(imageHeight) + 20;

// Iterate through characters and lanes and create character images
characters.forEach((characterData, index) => {
  // Create an image element for the character
  const characterImage = document.createElement("img");
  characterImage.src = characterData.imagePath;
  characterImage.classList.add("character-image");
  characterImage.style.width = imageWidth;
  characterImage.style.height = imageHeight;

  // Append the character image to the corresponding lane
  lanes[index].appendChild(characterImage);
});

// Function to start the race animation
function startRace() {
  imageHeight = "80px";
  console.log(characterPositions);
  console.log(raceTrackHeightInPixels);
  raceTrackHeightInPixels = raceTrack.offsetHeight;
  raceTrackHeightInPixels -= parseInt(imageHeight) + 20;
  const zScoreThreshold = 2; // Adjust Z score threshold here
  const outliers = detectOutliersZScore(characterPositions, zScoreThreshold);
  var maxCharacterPosition = Math.max(...characterPositions);
  var extra = maxCharacterPosition;
  var outliersBulletBill = [];

  while (outliers.includes(maxCharacterPosition)) {
    outliersBulletBill.push(maxCharacterPosition);
    maxCharacterPosition = Math.max(
      ...characterPositions.filter((value) => value !== extra)
    );
    extra = maxCharacterPosition;
  }
  const textElement = document.createElement("div");
  // Calculate the position for each character
  lanes.forEach((lane, index) => {
    const characterImage = lane.querySelector("img");

    if (characterImage) {
      const position = characterPositions[index] / maxCharacterPosition;
      const vert = raceTrackHeightInPixels * position;

      // Check if the character is an outlier
      if (outliers.includes(characterPositions[index])) {
        // Create a new Image for Bullet Bill
        const bulletBill = document.createElement("img");
        bulletBill.src = "characters/bulletBill.png";
        bulletBill.style.width = imageWidth;
        bulletBill.style.height = imageHeight;

        background.appendChild(bulletBill);

        // Append the Bullet Bill image to the raceTrack
        raceTrack.appendChild(bulletBill);

        // Calculate Bullet Bill's position outside the left of the raceTrack
        const raceTrackLeft = raceTrack.getBoundingClientRect().left;
        console.log(raceTrackLeft);
        const raceTrackWidth = raceTrack.offsetWidth;
        const bulletBillLeft = (99 / 100) * raceTrackWidth;

        bulletBill.style.position = "absolute";
        bulletBill.style.right = `${bulletBillLeft}px`;
        bulletBill.style.bottom = `${0}px`;
        bulletBill.style.transition = "transform 5s";
        bulletBill.style.transform = `translateY(-${raceTrackHeightInPixels}px)`;

        bulletBill.addEventListener("transitionend", function () {
          
          textElement.textContent = "Outliers:" + +outliers.join(", ");
          textElement.className = "outliers-text";

          const bulletBillRect = bulletBill.getBoundingClientRect();
          textElement.style.position = "absolute";
          textElement.style.left = `${bulletBillRect.left}px`;
          textElement.style.top = `${(bulletBillRect.top * 40) / 100}px`;
          textElement.style.padding = "10px";
          textElement.style.border = "2px solid #ff9900";
          textElement.style.backgroundColor = "white";

          

          bulletBill.removeEventListener("transitionend", arguments.callee);
        });

        characterImage.style.transition = "transform 12s";
        characterImage.style.transform = `translateY(-${vert}px)`;
      } else {
        // Handle non-outliers
        characterImage.style.transition = "transform 12s";
        characterImage.style.transform = `translateY(-${vert}px)`;
      }
    }
  });
  background.appendChild(textElement);
}

//Find outliers
function detectOutliersZScore(data, threshold) {
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const variance =
    data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    data.length;
  const stdDev = Math.sqrt(variance);

  const zScores = data.map((value) => Math.abs((value - mean) / stdDev));

  const outliers = [];
  for (let i = 0; i < data.length; i++) {
    if (zScores[i] > threshold) {
      outliers.push(data[i]);
    }
  }

  return outliers;
}

// Call the API and populate the results table
assessment.fda_api(
  "https://api.fda.gov/drug/label.json?search=indications_and_usage:headache&count=openfda.route.exact&api_key=y6ar0SviE1KN5TtgOEkr3kLbADgBgnoCl2fenZbF",
  function (data) {
    populateData(data);
  },
  function (error) {
    console.error("API request failed:", error);
  }
);
