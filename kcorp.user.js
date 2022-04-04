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
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = overlayURL();
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            document.addEventListener("keydown", function(event) {
                if(event.key == "F4"){
                    if (i.style.display === "none") {
                        i.style.display = "block";
                        i.src = overlayURL();
                    } else {
                        i.style.display = "none";
                    }
                }
            });
            return i;
        })())
 
    }, false);
 
}