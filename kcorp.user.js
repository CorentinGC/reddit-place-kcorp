// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    https://github.com/CorentinGC/reddit-place-kcorp
// @version      0.7
// @description  On va récuperer ce qui nous est dû de droit.
// @author       Adcoss95 & CorentinGC
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/icon.png
// ==/UserScript==

// credits to the osu! logo team for script base !
const DEBUG = false;

const UPDATE_URL = "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/kcorp.user.js";
const DISCORD_URL = "https://discord.gg/kameto";
const OVERLAY_URL = "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/overlay.png"

let opts = JSON.parse(localStorage.getItem("kc_opts")) || {
    OVERLAY_STATE:  true,
    OVERLAY_OPACITY:  1,
    ENABLE_AUTOREFRESH: true,
    AUTOREFRESH_DELAY: 5_000,
    ENABLE_IMGNOCACHE: true,
}
const saveOpts = () => localStorage.setItem("kc_opts", JSON.stringify(opts))
saveOpts();

let START_NOTIFIED = false;

const log = (msg) => DEBUG ? console.log("K-Corp Overlay - ", msg) : null
const open = (link, autoclose=false) => {
    let tab = window.open(link, "_blank")
    tab.focus()
    if(autoclose) setTimeout(() => tab.close(), 25)
}

(async function() {
    log("Loading KCorp module")
    if (window.top !== window.self) {
        const overlayURL = () => OVERLAY_URL+(opts.ENABLE_IMGNOCACHE ? "?t="+new Date().getTime() : "");
        log({opts});

        let timer;
        window.addEventListener("load", () => {
            log("Searching embed");
            let embed = document.getElementsByTagName("mona-lisa-embed");
            if ("undefined" === typeof embed || embed.length < 1) return;
            log("Found embed");

            log("Searching canvas");
            let canvas = embed[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas");
            if ("undefined" === typeof canvas || canvas.length < 1) return;
            log("Found canvas");

            log("Searching canvasContainer");
            let canvasContainer = canvas[0].shadowRoot.children[0].getElementsByTagName("canvas");
            if ("undefined" === typeof canvasContainer || canvasContainer.length < 1) return;
            log("Found canvasContainer");

            let overlay

            const showOverlay = () => {
                log("Reloading overlay")

                overlay = document.createElement("img");
                overlay.src = overlayURL();

                overlay.style.position = "absolute";
                overlay.style.left = 0;
                overlay.style.top = 0;
                overlay.style.imageRendering = "pixelated";
                overlay.style.width = "2000px";
                overlay.style.height = "2000px";
                overlay.style.opacity = + opts.OVERLAY_STATE;

                canvasContainer[0].parentNode.appendChild(overlay);

                clearInterval(timer);
                log("Overlay reloaded");
            }

            const showUi = () => {
                log("Loading UI");
                const defaultStyle = (element) => {
                    Object.assign(element.style, {
                        border: "1px solid rgba(0,0,0,0.3)",
                        backgroundColor: "white",
                        fontSize: "0.9em",
                        color: "black",
                        fontWeight: "bold"
                    });
                }
                const defaultBtn = (element) => {
                    Object.assign(element.style, {
                        borderRadius: "10px",
                        marginBottom: "10px",
                    });
                }
                const defaultSpan = (element) => {
                    Object.assign(element.style, {
                        display: "inline-block",
                        lineHeight: "34px",
                        borderRadius: "10px",
                        padding: "0 10px",
                    });
                }
                const defaultBlock = (element) => {
                    Object.assign(element.style, {
                        padding: "0 10px",
                        paddingTop: "5px",
                        marginBottom: "10px",
                        borderRadius: "10px",
                    });
                }

                // Overlay's UI
                const control = document.createElement("div");
                control.style.position = "fixed";
                control.style.left = "90px";
                control.style.top = "16px";
                control.style.maxWidth = "150px";
                control.id = "kcorp-controls";

                // Update Btn
                const updateBtn = document.createElement("button");
                updateBtn.innerHTML = "Mettre à jour le script";
                defaultStyle(updateBtn);
                defaultBtn(updateBtn);
                updateBtn.addEventListener("click", () => open(UPDATE_URL, true));

                // ToggleOverlay Btn
                const toggleOverlayBtnText = () => (opts.OVERLAY_STATE ? "Cacher" : "Afficher")+" l'overlay (F4)";
                const handleOverlayBtn = (btn) => {
                    opts.OVERLAY_STATE = !opts.OVERLAY_STATE;
                    saveOpts();
                    btn.innerHTML = toggleOverlayBtnText();
                    overlay.style.opacity = opts.OVERLAY_STATE ? parseInt(opts.OVERLAY_OPACITY) : 0;
                }

                const toggleOverlayBtn = document.createElement("button");
                toggleOverlayBtn.innerHTML = toggleOverlayBtnText();
                defaultStyle(toggleOverlayBtn);
                defaultBtn(toggleOverlayBtn);
                toggleOverlayBtn.addEventListener("click", () => handleOverlayBtn(toggleOverlayBtn));

                // ToggleOverlay Btn
                const refreshOverlayBtn = document.createElement("button");
                refreshOverlayBtn.innerHTML = "Rafraîchir l'overlay";
                defaultStyle(refreshOverlayBtn);
                defaultBtn(refreshOverlayBtn);
                refreshOverlayBtn.addEventListener("click", () => { overlay.src = overlayURL(); });

                // No cache Btn
                const toggleNocacheBtnText = () => (opts.ENABLE_IMGNOCACHE ? "Désactiver" : "Activer")+" le cache de l'overlay";
                const handleNocacheBtn = (btn) => {
                    opts.ENABLE_IMGNOCACHE = !opts.ENABLE_IMGNOCACHE;
                    saveOpts();
                    btn.innerHTML = toggleNocacheBtnText();
                    btn.classList.toggle("disable")
                }

                const toggleNocacheBtn = document.createElement("button");
                toggleNocacheBtn.innerHTML = toggleNocacheBtnText();
                defaultStyle(toggleNocacheBtn);
                defaultBtn(toggleNocacheBtn);
                toggleNocacheBtn.addEventListener("click", () => handleNocacheBtn(toggleNocacheBtn));
  
                // Autorefresh Btn
                const toggleAutoRefreshBtnText = () => (opts.ENABLE_AUTOREFRESH ? "Désactiver" : "Activer")+` l'auto-refresh de l'overlay (${opts.AUTOREFRESH_DELAY/1000}s)`;
                const handleAutoRefreshBtn = () => {
                    opts.ENABLE_AUTOREFRESH = !opts.ENABLE_AUTOREFRESH;
                    saveOpts();
                    toggleAutorefreshBtn.innerHTML = toggleAutoRefreshBtnText();
                    toggleAutorefreshBtn.classList.toggle("disable");
                }

                const toggleAutorefreshBtn = document.createElement("button");
                toggleAutorefreshBtn.innerHTML = toggleAutoRefreshBtnText();
                defaultStyle(toggleAutorefreshBtn);
                defaultBtn(toggleAutorefreshBtn);
                toggleAutorefreshBtn.addEventListener("click", () => handleAutoRefreshBtn(toggleAutorefreshBtn));

                // Opacity slider / @cchanche PR #27
                let timeout
                const handleSlider = (event) => {
                    if(!opts.OVERLAY_STATE) {
                        slider.value = opts.OVERLAY_OPACITY;
                        return
                    }
                    clearTimeout(timeout);
                    overlay.style.opacity = event.currentTarget.value;
                    opts.OVERLAY_OPACITY = event.currentTarget.value;

                    timeout = setTimeout(() => saveOpts(), 500)
                }

                const sliderBlock = document.createElement("div");
                defaultStyle(sliderBlock);
                defaultBlock(sliderBlock);

                const sliderText = document.createTextNode("Opacité du calque");
                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = 0;
                slider.max = 1;
                slider.step = 0.05;
                slider.value = opts.OVERLAY_OPACITY;
                slider.boder = "1px solid rgba(0,0,0,0.3)";
                sliderBlock.appendChild(sliderText)
                sliderBlock.appendChild(slider)

                slider.addEventListener("input", (event) => handleSlider(event));

                // Discord Btn
                const discordBtn = document.createElement("button");
                discordBtn.innerHTML = "Rejoindre le discord de Kamet0";
                defaultStyle(discordBtn);
                defaultBtn(discordBtn);
                discordBtn.addEventListener("click", () => open(DISCORD_URL));

                // Version
                const credits = document.createElement("div");
                credits.id = "kc-credits";

                const versionSpan = document.createElement("span");
                versionSpan.innerHTML = `KCorp's overlay v${GM_info.script.version} par la Team de L'Ombre`;
                versionSpan.style.position = "fixed";
                versionSpan.style.bottom = "10px";
                versionSpan.style.right = "10px";
                defaultStyle(versionSpan);
                defaultSpan(versionSpan);

                // Append elements
                control.appendChild(updateBtn);
                control.appendChild(toggleOverlayBtn);
                control.appendChild(refreshOverlayBtn);
                control.appendChild(toggleAutorefreshBtn);
                control.appendChild(toggleNocacheBtn);
                control.appendChild(sliderBlock);
                control.appendChild(discordBtn);

                embed[0].parentNode.appendChild(control);

                credits.appendChild(versionSpan);
                embed[0].parentNode.appendChild(credits);
                log("UI Loaded");

                document.addEventListener("keydown", (event) => {
                    if (event.key === "F4") return handleOverlayBtn();
                })
            }

            if(opts.ENABLE_AUTOREFRESH) {
                timer = setInterval(() => showOverlay(), opts.AUTOREFRESH_DELAY);
                showOverlay();
            } else showOverlay();
            showUi();
        }, false);
    }
    log("KCorp module loaded")
})();
