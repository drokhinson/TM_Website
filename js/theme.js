// Light/dark toggle. With nothing stored the page follows the OS; a click
// pins the opposite of whatever is showing and stores it under "bc.theme".
(function () {
  "use strict";

  var ROOT = document.documentElement;
  var KEY = "bc.theme";
  var META_COLORS = { light: "#F5F7FA", dark: "#111821" };
  var btn = document.getElementById("theme-toggle");
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    var set = ROOT.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return mq.matches ? "dark" : "light";
  }

  function sync() {
    var mode = current();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_COLORS[mode]);
    if (btn) btn.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
    document.dispatchEvent(new CustomEvent("bc:theme", { detail: mode }));
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      ROOT.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      sync();
    });
  }
  mq.addEventListener("change", sync);
  sync();
})();
