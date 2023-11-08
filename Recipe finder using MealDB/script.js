const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

const searchCtrl = document.querySelector(".search-control");

const img = document.querySelector(".rotate-img");

let rtdeg = 0;

setInterval(() => {
  rtdeg += 1;
  img.style.transform = `rotate(${rtdeg}deg)`;
}, 80);

const heroImage = document.querySelector(".rotate-container");
const mealSearch = document.querySelector(".meal-search");

searchBtn.addEventListener("click", function () {
  heroImage.classList.add("hide-hero");

  mealSearch.style.display = "none";

  document
    .getElementById("search-input")
    .addEventListener("input", function () {
      if (this.value === "") {
        // Show the hero image and quotes
        heroImage.classList.remove("hide-hero");
        mealSearch.style.display = "block";
      }
    });
});

searchCtrl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search-btn").click();
    getMealList();
  }
});

// event listeners

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

const typingText = document.getElementById("typing-text");
const originalText = typingText.textContent;
const textLength = originalText.length;
let textIndex = 0;
let isTyping = true;

function typeText() {
  if (isTyping) {
    typingText.textContent = originalText.slice(0, textIndex + 1);
    textIndex++;
  } else {
    typingText.textContent = originalText.slice(0, textIndex);
    textIndex--;
  }

  if (textIndex === textLength) {
    isTyping = false;
  } else if (textIndex === 0) {
    isTyping = true;
  }

  const typingSpeed = isTyping ? 90 : 90;
  setTimeout(typeText, typingSpeed);
}

typeText();

// get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
