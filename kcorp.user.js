// ==UserScript==
// @name         Reddit Place - Armée de Kameto
// @namespace    https://github.com/CorentinGC/reddit-place-kcorp
// @version      0.12
// @description  On va récuperer ce qui nous est dû de droit.
// @author       Adcoss95 & CorentinGC
// @match        https://hot-potato.reddit.com/embed*
// @match        https://new.reddit.com/r/place/*
// @match        https://www.reddit.com/r/place/*
// @icon         https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/icon.jpg
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/kcorp.user.js
// @updateURL    https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/kcorp.user.js
// @supportURL   https://github.com/CorentinGC/reddit-place-kcorp/issues

// ==/UserScript==

// credits to the osu! logo team for script base !
const DEBUG = false;

const UPDATE_URL = GM_info.script.updateURL;
const DISCORD_URL = "https://discord.gg/kameto";
const OVERLAY_URL = "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/overlay.png";
const VERSION_URL = "https://raw.githubusercontent.com/CorentinGC/reddit-place-kcorp/main/version.json";
const REDDIT_URL = "https://new.reddit.com/r/place/";

const allowedLangs = ['fr', 'en'];
const defaultOpts = {
    OVERLAY_STATE:  true,
    OVERLAY_OPACITY:  1,
    ENABLE_AUTOREFRESH: false,
    AUTOREFRESH_DELAY: 5000,
    ENABLE_IMGNOCACHE: true,
    VERSION: GM_info.script.version,
    LANG: allowedLangs[0]
};
let opts = JSON.parse(localStorage.getItem("kc_opts")) || defaultOpts;

const saveOpts = () => localStorage.setItem("kc_opts", JSON.stringify(opts));
const refreshOpts = () => {
    if(GM_info.script.version !== opts.VERSION){
        opts = {
            ...defaultOpts,
            ...opts,
            VERSION: GM_info.script.version
        };
        for(let opt in opts){
            if(!defaultOpts[opt]) delete opts[opt];
        }
    }
    saveOpts();
}

const LANGS = {
    fr: {
        update_available: "Mise à jour disponible v{{0}} > v{{1}} ! Cliquez ici pour l'installer",
        update_reload: "La page va se recharger dans 5secondes, ou vous pouvez le faire manuellement.",
        show: "Afficher",
        hide: "Cacher",
        enable: "Activer",
        disable: "Désactiver",
        btn_update_script: "Mettre à jour le script",
        btn_toggle_overlay: "{{0}} l'overlay",
        btn_refresh_overlay: "Rafraîchir l'overlay",
        btn_autorefresh_overlay: "{{0}} l'auto-refresh de l'overlay ({{1}}s)",
        btn_toggle_cache: "{{0}} le cache de l'overlay",
        overlay_opacity: "Opacité de l'overlay",
        join_discord: "Rejoindre le discord de Kamet0",
        by_shadow_team: "KCorp's overlay v{{0}} par la Team de L'Ombre"
    },
    en: {
        update_available: "`Update available v{{0}} > v{{1}} ! Click here to install`",
        update_reload: "Page will reload after 5seconds, but you can do it manually.",
        show: "Show",
        hide: "Hide",
        enable: "Enable",
        disable: "Disable",
        btn_update_script: "Update script",
        btn_toggle_overlay : "{{0}} overlay",
        btn_refresh_overlay: "Refresh overlay",
        btn_autorefresh_overlay: "{{0}} overlay's auto-refresh ({{1}}s)",
        btn_toggle_cache: "{{0}} overlay's cache",
        overlay_opacity: "Overlay's opacity",
        join_discord: "Join Kamet0's discord !",
        by_shadow_team: "KCorp's overlay v{{0}} by la Shadow's Team"
    },
};
const f = (key, ...vars) => {
    let string = LANGS[opts.LANG][key];
    if(vars && vars.length > 0) vars.map((e,i) => {string = string ? string.replace("{{"+i+"}}", vars[i]) : key});
    return string;
}

if(window.top !== window.self) refreshOpts();

const log = (msg) => DEBUG ? console.log("K-Corp Overlay - ", msg) : null
const open = (link, autoclose=false) => {
    let tab = window.open(link, "_blank");
    tab.focus();
    if(autoclose) setTimeout(() => tab.close(), 25);
}

const versionState = (a,b) => {
    let x = a.split(".").map(e=> parseInt(e));
    let y = b.split(".").map(e=> parseInt(e));
    let z = "";

    for(let i=0;i<x.length;i++) {
        if(x[i] === y[i]) z+="e";
        else {
            if(x[i] > y[i]) z+="m";
            else z+="l";
        }
    }
    if (!z.match(/[l|m]/g)) return 0;
    else if (z.split("e").join("")[0] == "m") return 1;
    return -1;
}
const checkVersion = () => {
    setInterval(async () => {
        try {
            const response = await fetch(VERSION_URL);
            if (!response.ok) return console.warn("Couldn't get version.json");
            const {version} = await response.json();

            const needUpdate = versionState(version, GM_info.script.version) === 1;
            if(needUpdate) showUpdate(version);
        } catch (err) {
            console.warn("Couldn't get orders:", err);
        }
    }, 15000)

}
const showUpdate = (version) => {
    if(document.getElementById("kcorp-update")) return;

    const update = document.createElement("div");
    update.style.position = "fixed";
    update.style.background = "white";
    update.style.right = "10px";
    update.style.padding = "0 10px";
    update.style.textAlign = "center";
    update.style.color = "red";
    update.style.top = "65px";
    update.style.zIndex = 1000;
    update.style.height = "40px";
    update.style.lineHeight = "40px";
    update.style.border = "1px solid rgba(0,0,0,0.3)";
    update.style.borderRadius = "10px";
    update.style.fontSize = "1.3em";
    update.style.cursor = "pointer";
    update.id = "kcorp-update";

    let message = document.createTextNode(f("update_available", GM_info.script.version, version));
    update.appendChild(message);
    document.body.appendChild(update);
    update.addEventListener("click", () => {
        window.top.location = UPDATE_URL;
        message.textContent = f("update_reload");
        setTimeout(() => location.reload(), 5000);
    });
}

(async function() {
    log("Loading KCorp module");

    if (window.top !== window.self) {
        const overlayURL = () => OVERLAY_URL+(opts.ENABLE_IMGNOCACHE ? "?t="+new Date().getTime() : "");
        log({opts});

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

            let overlay, timer;
            const updateOverlaySrc = () => {
                overlay.src = overlayURL();
            }
            const overlayAutoRefresh = () => {
                timer = setInterval(() => {
                    log("Autorefresh done");
                    updateOverlaySrc();
                }, opts.AUTOREFRESH_DELAY);
            }
            const showOverlay = () => {
                log("Reloading overlay");

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
                updateBtn.innerHTML = f("btn_update_script");
                defaultStyle(updateBtn);
                defaultBtn(updateBtn);
                updateBtn.addEventListener("click", () => {window.top.location = UPDATE_URL});

                // ToggleOverlay Btn
                const toggleOverlayBtnText = () => f("btn_toggle_overlay", opts.OVERLAY_STATE ? f("hide") : f("show"));
                const handleOverlayBtn = () => {
                    opts.OVERLAY_STATE = !opts.OVERLAY_STATE;
                    saveOpts();
                    toggleOverlayBtn.innerHTML = toggleOverlayBtnText();
                    overlay.style.opacity = opts.OVERLAY_STATE ? opts.OVERLAY_OPACITY : 0;
                }

                const toggleOverlayBtn = document.createElement("button");
                toggleOverlayBtn.innerHTML = toggleOverlayBtnText();
                defaultStyle(toggleOverlayBtn);
                defaultBtn(toggleOverlayBtn);
                toggleOverlayBtn.addEventListener("click", handleOverlayBtn);

                // Refresh Overlay Btn
                const refreshOverlayBtn = document.createElement("button");
                refreshOverlayBtn.innerHTML = f("btn_refresh_overlay");
                defaultStyle(refreshOverlayBtn);
                defaultBtn(refreshOverlayBtn);
                refreshOverlayBtn.addEventListener("click", () => { overlay.src = overlayURL(); });

                // Autorefresh Btn
                const toggleAutoRefreshBtnText = () => f("btn_autorefresh_overlay", opts.ENABLE_AUTOREFRESH ? f("disable") : f("enable"), opts.AUTOREFRESH_DELAY/1000);

                const handleAutoRefreshBtn = () => {
                    opts.ENABLE_AUTOREFRESH = !opts.ENABLE_AUTOREFRESH;
                    saveOpts();
                    toggleAutorefreshBtn.innerHTML = toggleAutoRefreshBtnText();

                    if(opts.ENABLE_AUTOREFRESH) {
                        overlayAutoRefresh();
                        handleNocacheBtn(toggleNocacheBtn, true);
                        return;
                    }
                    clearInterval(timer);
                }

                // No cache Btn
                const toggleNocacheBtnText = () => f("btn_toggle_cache", opts.ENABLE_IMGNOCACHE ? f("disable") : f("enable"));
                const handleNocacheBtn = (btn, state=false) => {
                    opts.ENABLE_IMGNOCACHE = state ? state : !opts.ENABLE_IMGNOCACHE;
                    saveOpts();
                    btn.innerHTML = toggleNocacheBtnText();
                    btn.classList.toggle("disable");
                }

                const toggleNocacheBtn = document.createElement("button");
                toggleNocacheBtn.innerHTML = toggleNocacheBtnText();
                defaultStyle(toggleNocacheBtn);
                defaultBtn(toggleNocacheBtn);
                toggleNocacheBtn.addEventListener("click", () => handleNocacheBtn(toggleNocacheBtn));

                const toggleAutorefreshBtn = document.createElement("button");
                toggleAutorefreshBtn.innerHTML = toggleAutoRefreshBtnText();
                defaultStyle(toggleAutorefreshBtn);
                defaultBtn(toggleAutorefreshBtn);
                toggleAutorefreshBtn.addEventListener("click", () => handleAutoRefreshBtn(toggleAutorefreshBtn));

                // Opacity slider / @cchanche PR #27
                const handleSlider = (event) => {
                    if(!opts.OVERLAY_STATE) {
                        slider.value = opts.OVERLAY_OPACITY;
                        return;
                    }
                    overlay.style.opacity = event.currentTarget.value;
                    opts.OVERLAY_OPACITY = event.currentTarget.value;
                    saveOpts();
                }

                const sliderBlock = document.createElement("div");
                defaultStyle(sliderBlock);
                defaultBlock(sliderBlock);

                const sliderText = document.createTextNode(f("overlay_opacity"));
                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = 0;
                slider.max = 1;
                slider.step = 0.05;
                slider.value = opts.OVERLAY_OPACITY;
                slider.boder = "1px solid rgba(0,0,0,0.3)";
                sliderBlock.appendChild(sliderText);
                sliderBlock.appendChild(slider);

                slider.addEventListener("input", (event) => handleSlider(event));

                // Discord Btn
                const discordBtn = document.createElement("button");
                discordBtn.innerHTML = f("join_discord");
                defaultStyle(discordBtn);
                defaultBtn(discordBtn);
                discordBtn.addEventListener("click", () => open(DISCORD_URL));

                const langDiv = document.createElement("div");
                defaultBlock(langDiv);
                for(let lang of allowedLangs){
                    const langSpan = document.createElement("span");
                    langSpan.innerHTML = lang
                    langSpan.style.cursor = "pointer";
                    langSpan.style.padding = "10px";
                    langSpan.style.margin = "0 5px";
                    langSpan.style.border = "1px solid rgba(0,0,0,0.3)";
                    langSpan.style.borderRadius = "5px";
                    langSpan.style.background = "white";
                    langSpan.style.color = "black";
                    langSpan.style.textTransform = "uppercase";
                    langSpan.id = lang
                    if(opts.LANG === lang) {
                        langSpan.style.backgroundColor = "#c3c3c3";
                        langSpan.style.cursor = "not-allowed";
                    }

                    langDiv.appendChild(langSpan);

                    langSpan.addEventListener("click", (event) => {
                        if(opts.LANG === event.target.id) return;
                        opts.LANG = event.target.id;
                        saveOpts();
                        window.location.href = REDDIT_URL;
                    })
                }
                // Version
                const credits = document.createElement("div");
                credits.id = "kc-credits";

                const versionSpan = document.createElement("span");
                versionSpan.innerHTML = f("by_shadow_team", GM_info.script.version);
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
                control.appendChild(langDiv);

                embed[0].parentNode.appendChild(control);

                credits.appendChild(versionSpan);
                embed[0].parentNode.appendChild(credits);
                log("UI Loaded");
            }

            if(opts.ENABLE_AUTOREFRESH) overlayAutoRefresh();
            showOverlay();
            showUi();
        }, false);
    } else checkVersion()
    log("KCorp module loaded");
})();



