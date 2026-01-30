let count = 0;
const countDisplay = document.getElementById("count");
const incrementBtn = document.getElementById("increase");
const decrementBtn = document.getElementById("decrease");

incrementBtn.addEventListener("click", () => {
    count++;
    countDisplay.textContent = count;
});

decrementBtn.addEventListener("click", () => {
    count--;
    countDisplay.textContent = count;
});