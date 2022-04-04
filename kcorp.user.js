// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  On va récuperer ce qui nous est du de droit.
// @author       Adcoss95
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://styles.redditmedia.com/t5_4eiiz1/styles/communityIcon_ojy24r8j90o81.jpg
// @grant        none
// ==/UserScript==
if (window.top !== window.self) {
    const overlayURL = () => {
        return "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/overlay.png?time=" + (new Date().getTime());
    };

    window.addEventListener('load', () => {
        const t = setInterval(() => {
            let e = document.getElementsByTagName("mona-lisa-embed");
            if ("undefined" === typeof e || e.length < 1) {
                return;
            }

            let c = e[0].shadowRoot.children[0].getElementsByTagName('mona-lisa-canvas');
            if ("undefined" === typeof c || c.length < 1) {
                return;
            }

            let cc = c[0].shadowRoot.children[0].getElementsByTagName('canvas');
            if ("undefined" === typeof cc || cc.length < 1) {
                return;
            }

            const i = document.createElement("img");
            i.src = overlayURL();
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";

            cc[0].parentNode.appendChild(i);
            clearInterval(t);

            document.addEventListener("keydown", (event) => {
                if (event.key === "F4") {
                    if (i.style.display === "none") {
                        i.src = overlayURL();
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
            });
        }, 3000);
    }, false);
}