// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  On va récuperer ce qui nous est dû de droit.
// @author       Adcoss95
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://styles.redditmedia.com/t5_4eiiz1/styles/communityIcon_ojy24r8j90o81.jpg
// @grant        none
// @downloadURL  https://gist.githubusercontent.com/CorentinGC/900a7b7c55b608a77bdfc8cb3a26a88a/raw/kameto.user.js?v=0.3
// @updateURL    https://gist.githubusercontent.com/CorentinGC/900a7b7c55b608a77bdfc8cb3a26a88a/raw/kameto.user.js?v=0.3
// ==/UserScript==
const IMG_URL = 'https://github.com/CorentinGC/reddit-place-kcorp/raw/main/overlay.png?v=1.03'
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = IMG_URL;
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
        })())
 
    }, false);
 
}