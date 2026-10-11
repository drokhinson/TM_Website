// Phone menu: a bottom sheet in a <dialog>. It locks page scroll while open,
// closes on Escape, backdrop tap, the close button or picking a link, and
// returns focus to the Menu button without scrolling.
(function () {
  "use strict";

  var sheet = document.getElementById("menu");
  var openBtn = document.getElementById("menu-open");
  var closeBtn = document.getElementById("menu-close");
  if (!sheet || !openBtn || typeof sheet.showModal !== "function") return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var closing = false;

  function open() {
    if (sheet.open) return;
    document.body.classList.add("is-locked");
    sheet.showModal();
  }

  function finish(then) {
    sheet.classList.remove("is-closing");
    closing = false;
    sheet.close();
    document.body.classList.remove("is-locked");
    openBtn.focus({ preventScroll: true });
    if (then) then();
  }

  function close(then) {
    if (!sheet.open || closing) return;
    if (reduce.matches) { finish(then); return; }
    closing = true;
    sheet.classList.add("is-closing");
    var panel = sheet.querySelector(".sheet-panel");
    var done = false;
    function end() { if (!done) { done = true; finish(then); } }
    panel.addEventListener("animationend", end, { once: true });
    setTimeout(end, 300);
  }

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", function () { close(); });

  sheet.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  // A click on the dialog itself (not the panel) is a backdrop tap.
  sheet.addEventListener("click", function (e) { if (e.target === sheet) close(); });

  // Close first so the page is unlocked, then follow the link.
  sheet.querySelectorAll(".sheet-links a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("href").slice(1);
      close(function () {
        var target = document.getElementById(id);
        if (target) target.scrollIntoView({ block: "start" });
        history.replaceState(null, "", "#" + id);
      });
    });
  });

  // Above the phone tier the header shows the links, so an open sheet has no reason to stay.
  window.matchMedia("(min-width: 820px)").addEventListener("change", function (mq) {
    if (mq.matches && sheet.open) finish();
  });
})();
