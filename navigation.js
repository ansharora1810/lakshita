/** @ts-ignore */
const confetti = window.confetti;
// Preload the error sound so it plays instantly when needed
const wrongSound = new Audio("assets/incorrect-selection.mp3")
const correctSound1 = new Audio("assets/correct-selection-1.mp3")
const correctSound2 = new Audio("assets/correct-selection-2.mp3")
correctSound2.volume = 0.2
const suspenceSound = new Audio("assets/suspence.mp3")
suspenceSound.loop = true  // Repeat indefinitely until paused
const loveSound = new Audio("assets/love.mp3")
loveSound.loop = true  // Loop the happy music on the final page
let initialSuspenseMusicPlayed = false

/**
 * Gets the current page number from a page element
 * @param {Element} page - The page element
 * @returns {number} - The page number as an integer
 */
const getCurrentPageNumber = (page) => {
  const allClasses = page.classList;
  const pageClass = Array.from(allClasses).find(
    (className) => className.substring(0, 4) === "page",
  )
  const pageNumber = pageClass.split("-")[1];
  return parseInt(pageNumber)
}

/**
 *
 * @param {Element} page
 * @returns {Element | null}
 */
const getNextPage = (page) => {
  const nextPageNumber = getCurrentPageNumber(page) + 1
  const nextPageClass = "page-" + nextPageNumber.toString();
  return document.querySelector('.' + nextPageClass)
};

// Plays the suspense sound (only if it hasn't started yet)
const playSuspenseSound = () => {
  if (suspenceSound.paused) {
    suspenceSound.play()
  }
}

const changePage = () => {
  if (!activePage) return; // Type guard for the callback
  const nextPage = getNextPage(activePage);
  activePage.classList.remove("active");
  activePage.classList.add("visited");
  nextPage.classList.remove("hidden");
  nextPage.classList.add("active");
  activePage = nextPage

  // If we reached the last page (page-5), switch to happy music
  if (nextPage.classList.contains("page-5")) {
    suspenceSound.pause()
    loveSound.play()
  }

  correctButton = getCorrectButtonAndAddEventListener()
  incorrectButtons = getIncorrectButtonsAndAddEventListener()
}

/**
 * @returns {Element}
 */
const getCorrectButtonAndAddEventListener = () => {
  const button = activePage.querySelector(".correct-button")
  button.addEventListener("click", async () => {
    console.log("Yayyy")
    // Pause suspense sound
    suspenceSound.pause()

    // Play sound
    correctSound1.currentTime = 0
    correctSound1.play()

    // Play sound
    correctSound2.currentTime = 0
    correctSound2.play()

    // Trigger confetti
    confetti({
      particleCount: 300,
      spread: 1000,
      origin: { y: 0.6 }
    })

    // Sleep 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Change page
    changePage()

    // Play suspense sound
    suspenceSound.play()
  })
  // button.addEventListener("click", () => {
  //   suspenceSound.pause()
  // })
  return button
}

/**
 * Flashes the valentine-card red 2 times to indicate an error
 */
const flashRed = () => {
  const flashCount = 2
  let currentFlash = 0
  const flashDuration = 200 // milliseconds per flash
  const cardElement = /** @type {HTMLElement} */ (activePage)

  const performFlash = () => {
    if (currentFlash < flashCount * 2) {
      // Alternate between red and white
      if (currentFlash % 2 === 0) {
        cardElement.style.backgroundColor = "red"
      } else {
        cardElement.style.backgroundColor = "white"
      }
      currentFlash++
      setTimeout(performFlash, flashDuration)
    } else {
      // Ensure it ends on white
      cardElement.style.backgroundColor = "white"
    }
  }

  performFlash()
}

/**
 * @returns {Element[]}
 */
const getIncorrectButtonsAndAddEventListener = () => {
  const buttons = Array.from(activePage.querySelectorAll(".button-wrapper:not(.correct-button)"))

  buttons.forEach(button => {
    button.addEventListener("click", flashRed)
    button.addEventListener("click", () => {
      // Play the error sound
      wrongSound.currentTime = 0
      wrongSound.play()
    })
  })

  return buttons
}

let activePage = document.querySelector(".active");
let correctButton = getCorrectButtonAndAddEventListener()
let incorrectButtons = getIncorrectButtonsAndAddEventListener()
document.addEventListener("click", () => {
  if (!initialSuspenseMusicPlayed) {
    playSuspenseSound()
    initialSuspenseMusicPlayed = true
  }
})
