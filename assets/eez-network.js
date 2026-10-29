/* assets/eez-network.js — the site-wide network switch (testnet | mainnet).
 *
 * Needs assets/network-config.js first, which picks window.EEZ_NET and
 * window.EEZ_NETWORK. This file:
 *   - adds the switch: on a walkthrough, at the start of the header's right-hand
 *     group (next to #stepLabel); elsewhere, into a [data-net-switch] placeholder;
 *   - shows the devnet warning while mainnet is picked: on a walkthrough, as a band
 *     under the stage header; elsewhere, in a [data-net-banner] placeholder;
 *   - fills [data-net-href] (a config path, plus an optional data-net-suffix),
 *     [data-net-text] (a config path) and [data-net-show="testnet|mainnet"].
 * Picking a network reloads the page with ?net=<name>, keeping the rest of the URL,
 * so links carry the choice and every page renders from one value.
 */
(function(){
  var nets = window.EEZ_NETWORKS, net = window.EEZ_NET, cfg = window.EEZ_NETWORK;
  if (!nets || !cfg) return;

  function get(path){ return path.split(".").reduce(function(o, k){ return o && o[k]; }, cfg) || ""; }

  var css = [
    ".eez-net{display:inline-flex;align-items:center;gap:2px;border:1px solid #2a2a2a;border-radius:100px;padding:3px;background:#0f0f0f;flex:none}",
    ".eez-net button{font-family:var(--mono,'Geist Mono',ui-monospace,Menlo,monospace);font-size:13px;letter-spacing:.04em;color:#9aa3b3;background:transparent;border:0;border-radius:100px;padding:7px 14px;cursor:pointer;white-space:nowrap;min-height:32px}",
    ".eez-net button[aria-pressed='true']{background:var(--eez-grad,linear-gradient(90deg,#3BE57E,#7c83ff));color:#06140c;font-weight:500;cursor:default}",
    ".eez-net button:hover:not([aria-pressed='true']){color:#fff}",
    ".eez-net button:focus-visible{outline:2px solid var(--eez-green,#3BE57E);outline-offset:2px}",
    ".eez-net-warn{display:flex;gap:12px;align-items:flex-start;background:#1d160a;border:1px solid #5c4314;border-radius:10px;padding:12px 16px;color:#ecdcb8;font-family:var(--sans,'Geist',system-ui,sans-serif);font-size:15px;line-height:1.5;text-align:left}",
    ".eez-net-warn b{color:#f2b84b;font-weight:600}",
    ".eez-net-warn svg{flex:none;margin-top:2px}",
    /* Cards (walkthroughs). The header switch is larger, the intro slide opens with a
       network box, and a band under the header names the network on every step. */
    ".eez-net.big{padding:4px}",
    ".eez-net.big button{font-size:15px;padding:9px 18px;min-height:38px}",
    ".eez-net-card{display:flex;align-items:center;gap:16px;border-radius:12px;padding:11px 16px;margin:0 0 18px;max-width:1380px;font-family:var(--sans,'Geist',system-ui,sans-serif);text-align:left}",
    ".eez-net-card.main{background:#24190a;border:2px solid #9a6d1d;color:#f1e2c0}",
    ".eez-net-card.test{background:rgba(59,229,126,.07);border:2px solid #2c6b3c;color:#cfeedd}",
    ".eez-net-card .t{font-size:18px;font-weight:600;line-height:1.45;color:#fff;margin-right:6px}",
    ".eez-net-card.main .t{color:#f7c35c}",
    ".eez-net-card .m{font-size:17px;line-height:1.45}",
    ".eez-net-card svg{flex:none}",
    /* On the 1920x1080 stage the band sits in the gap between the 96px header and the 140px content top. */
    ".eez-net-band{position:absolute;left:48px;right:48px;top:100px;z-index:31;display:flex;align-items:center;gap:14px;border-radius:9px;padding:5px 14px;font-family:var(--sans,'Geist',system-ui,sans-serif);font-size:16px;line-height:1.5}",
    ".eez-net-band .k{font-family:var(--mono,'Geist Mono',ui-monospace,Menlo,monospace);font-size:13px;letter-spacing:.12em;font-weight:600;border-radius:100px;padding:2px 10px;white-space:nowrap;flex:none}",
    ".eez-net-band.main{background:#2a1d08;border:1px solid #9a6d1d;color:#f1e2c0}",
    ".eez-net-band.main .k{background:#f2b84b;color:#1d1405}",
    ".eez-net-band.test{background:rgba(59,229,126,.06);border:1px solid #24563a;color:#b9e8c9}",
    ".eez-net-band.test .k{background:#3BE57E;color:#06140c}",
    /* While the intro slide shows its network box, the band would repeat it. */
    "#stage.eez-net-has-card:has(#intro:not([hidden])) .eez-net-band{display:none}",
    "@media (max-width:1120px){.eez-net-band{position:static !important;margin:12px 16px 0;padding:10px 14px;align-items:flex-start;flex-wrap:wrap}.eez-net-card{flex-wrap:wrap;padding:14px 16px}.eez-net-card .t{font-size:16px}.eez-net-card .m{font-size:15px}}"
  ].join("\n");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var ICON = '<svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 1.5 17 16H1z" fill="none" stroke="#f2b84b" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 7v4" stroke="#f2b84b" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="13.2" r=".95" fill="#f2b84b"/></svg>';
  var WARNING = "<b>Devnet on Ethereum mainnet.</b> We may reset or change it without notice. Please start with small amounts.";
  var BIG_ICON = ICON.replace('width="16" height="16"', 'width="24" height="24"');
  var TEST_ICON = '<svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11" fill="none" stroke="#3BE57E" stroke-width="1.6"/><path d="M8 13.4l3.3 3.2L18 9.8" fill="none" stroke="#3BE57E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CARD = {
    testnet: { t: "You're on EEZ-X Testnet.", m: "Every live step uses free test funds from a faucet. Mainnet is a devnet on Ethereum mainnet that spends real ETH; use the switch at the top only when you're ready." },
    mainnet: { t: "You're on RollupX, a devnet on Ethereum mainnet.", m: "We may reset or change it without notice, and every live step spends real ETH. Please start with small amounts." }
  };
  var BAND = {
    testnet: { k: "TESTNET", m: "EEZ-X Testnet on Gnosis Chiado. Live steps use free test funds." },
    mainnet: { k: "MAINNET · DEVNET", m: "It may be reset without notice. Please start with small amounts." }
  };

  function go(name){
    if (name === net) return;
    try { localStorage.setItem("eez-network", name); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set("net", name);
    location.assign(url.toString());
  }

  function makeSwitch(big){
    var group = document.createElement("div");
    group.className = "eez-net" + (big ? " big" : "");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Network for every card");
    ["testnet", "mainnet"].forEach(function(name){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = nets[name].label;
      b.title = name === "testnet" ? "EEZ-X Testnet on Gnosis Chiado: free test funds"
                                   : "RollupX on Ethereum mainnet: a devnet that spends real ETH";
      b.setAttribute("data-net", name);
      b.setAttribute("aria-pressed", String(name === net));
      b.addEventListener("click", function(){ go(name); });
      group.appendChild(b);
    });
    return group;
  }

  function makeWarning(extraClass){
    var w = document.createElement("div");
    w.className = "eez-net-warn" + (extraClass ? " " + extraClass : "");
    w.setAttribute("role", "note");
    w.innerHTML = ICON + "<span>" + WARNING + "</span>";
    return w;
  }

  // The 1920x1080 stage has no room to grow. If the intro no longer fits between the
  // band (bottom 136) and the stage foot (1075), drop the box's second sentence, then
  // the box itself; the band under the header still names the network and the risk.
  function fitCard(stage, inner, card){
    if (!card.parentNode || window.matchMedia("(max-width:1120px)").matches) return;
    function fits(){
      var s = stage.getBoundingClientRect(), b = inner.getBoundingClientRect();
      if (!s.width || !b.height) return true;
      var k = s.width / 1920;
      return (b.top - s.top) / k >= 137 && (b.bottom - s.top) / k <= 1075;
    }
    if (fits()) return;
    var m = card.querySelector(".m");
    if (m) m.remove();
    if (!fits()) { card.remove(); stage.classList.remove("eez-net-has-card"); }
  }

  function mount(){
    var stage = document.getElementById("stage");
    var label = document.getElementById("stepLabel");
    if (stage && label && label.parentElement) {
      label.parentElement.insertBefore(makeSwitch(true), label.parentElement.firstChild);
      var tone = net === "mainnet" ? "main" : "test";
      // Band under the header, on every step.
      var band = document.createElement("div");
      band.className = "eez-net-band " + tone;
      band.setAttribute("role", "note");
      var k = document.createElement("span"); k.className = "k"; k.textContent = BAND[net].k;
      var m = document.createElement("span"); m.textContent = BAND[net].m;
      band.appendChild(k); band.appendChild(m);
      if (stage.firstElementChild) stage.firstElementChild.insertAdjacentElement("afterend", band);
      // Network box at the top of the intro slide.
      var inner = document.querySelector("#intro .intro-inner");
      if (inner) {
        var card = document.createElement("div");
        card.className = "eez-net-card " + tone;
        card.setAttribute("role", "note");
        card.innerHTML = (net === "mainnet" ? BIG_ICON : TEST_ICON) + "<span><span class=\"t\"></span><span class=\"m\"></span></span>";
        card.querySelector(".t").textContent = CARD[net].t;
        card.querySelector(".m").textContent = CARD[net].m;
        inner.insertBefore(card, inner.firstChild);
        stage.classList.add("eez-net-has-card");
        fitCard(stage, inner, card);
        window.addEventListener("load", function(){ fitCard(stage, inner, card); });
      }
    }
    document.querySelectorAll("[data-net-switch]").forEach(function(slot){ slot.appendChild(makeSwitch()); });
    if (net === "mainnet") {
      document.querySelectorAll("[data-net-banner]").forEach(function(slot){ slot.appendChild(makeWarning()); });
    }

    document.querySelectorAll("[data-net-href]").forEach(function(a){
      var v = get(a.getAttribute("data-net-href"));
      if (v) a.href = v + (a.getAttribute("data-net-suffix") || "");
    });
    document.querySelectorAll("[data-net-text]").forEach(function(el){
      var v = get(el.getAttribute("data-net-text"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-net-show]").forEach(function(el){
      el.hidden = el.getAttribute("data-net-show") !== net;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
