// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    http://tampermonkey.net/
// @version      0.4
// @updateURL    https://github.com/CorentinGC/reddit-place-kcorp/raw/main/kcorp.user.js
// @downloadURL  https://github.com/CorentinGC/reddit-place-kcorp/raw/main/kcorp.user.js
// @description  On va récuperer ce qui nous est du de droit.
// @author       Adcoss95
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://styles.redditmedia.com/t5_4eiiz1/styles/communityIcon_ojy24r8j90o81.jpg
// @grant        none
// ==/UserScript==

/**
 * @param {HTMLImageElement} img
 */
function applyImgStyles(img) {
  img.style.position = "absolute"
  img.style.left = "0"
  img.style.top = "0"
  img.style.imageRendering = "pixelated"
  img.style.width = "2000px"
  img.style.height = "2000px"
}

/**
 * @returns {HTMLImageElement}
 */
function createOverlay() {
  // Create img node.
  const img = document.createElement("img")

  img.src = "https://github.com/CorentinGC/reddit-place-kcorp/raw/main/overlay.png"
  applyImgStyles(img)

  return img
}

/**
 * @returns {HTMLImageElement}
 */
function appendImg() {
  const canvas = document
    .getElementsByTagName("mona-lisa-embed")[0]
    .shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot
    .children[0]

  const overlay = createOverlay()
  canvas.appendChild(overlay)

  return overlay
}

function onLoad() {
  const overlay = appendImg()

  document.addEventListener("keydown", function (event) {
    if (event.key == "F4") {
      if (overlay.style.display === "none") {
        overlay.style.display = "block"
      } else {
        overlay.style.display = "none"
      }
    }
  })
}

function main() {
  if (window.top === window.self) return

  window.addEventListener("load", onLoad)
}

main()
