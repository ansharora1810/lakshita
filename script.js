const noButton = document.querySelector(".no-button")
const DANGER_DISTANCE = 50
const FIRST_PAGE_IMAGE_CHANGE_MOVES = 100

// Track the button's offset from its original position
let offsetX = 0
let offsetY = 0
let moves = 0
let imageChanged = false

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX
    const mouseY = event.clientY

    const noButtonRect = noButton.getBoundingClientRect()
    const noButtonCenterX = noButtonRect.left + noButtonRect.width / 2
    const noButtonCenterY = noButtonRect.top + noButtonRect.height / 2

    const xDifference = noButtonCenterX - mouseX
    const yDifference = noButtonCenterY - mouseY
    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference)

    if (distance < DANGER_DISTANCE) {
        moves += 1
        if(!imageChanged && moves > FIRST_PAGE_IMAGE_CHANGE_MOVES) {
            const image = document.querySelector(".first-page-image")
            image.src = "assets/knife.gif"
            image.style.maxHeight = "100%"
            imageChanged = true
        }

        offsetX += xDifference * 0.5
        offsetY += yDifference * 0.5

        // Get parent boundaries
        const parent = noButton.parentElement
        const parentRect = parent.getBoundingClientRect()

        // Calculate max allowed offset from center
        const maxOffsetX = (parentRect.width - noButtonRect.width) / 2
        const maxOffsetY = (parentRect.height - noButtonRect.height) / 2

        // Bounce back if hitting edge
        if (offsetX > maxOffsetX) {
            offsetX = maxOffsetX - (offsetX - maxOffsetX)  // bounce back
        } else if (offsetX < -maxOffsetX) {
            offsetX = -maxOffsetX - (offsetX + maxOffsetX)  // bounce back
        }

        if (offsetY > maxOffsetY) {
            offsetY = maxOffsetY - (offsetY - maxOffsetY)  // bounce back
        } else if (offsetY < -maxOffsetY) {
            offsetY = -maxOffsetY - (offsetY + maxOffsetY)  // bounce back
        }

        // Apply the offset (combine centering + movement in one transform)
        noButton.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`

        console.log("ahhhhhhhh")
    }
})
