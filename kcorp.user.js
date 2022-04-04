// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On va récuperer ce qui nous est du de droit.
// @author       Adcoss95
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://styles.redditmedia.com/t5_4eiiz1/styles/communityIcon_ojy24r8j90o81.jpg
// @grant        none
// ==/UserScript==

function overlayURL() {

    //Cache busted URL
    return "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/overlay.png?time=" + (new Date().getTime());
}

if (window.top !== window.self) {

    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild((function() {

            const overlay= document.createElement("img");
            overlay.src = overlayURL();
            overlay.style = "display: block; position: absolute; left: 0; top: 0; image-rendering: pixelated; width: 2000px; height: 2000px;";

            window.addEventListener("keydown", function (event) {
            
                // Hide the image with the F4 key
                if (event.key == "F4") {

                    // Toggle overlay
                    var display = (overlay.style.display == "none" ? "block" : "none");

                    overlay.style.display = display;

                    //Reload overlay
                    if (display == "block") {
                        overlay.src = overlayURL()
                    }
                }
            });

            return overlay;
        })())
 
    }, false);
}