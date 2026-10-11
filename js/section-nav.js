// Marks the header and menu links for the section currently under the top
// bar with aria-current.
(function () {
  "use strict";

  if (!("IntersectionObserver" in window)) return;

  var links = Array.prototype.slice.call(document.querySelectorAll("a[data-section]"));
  var ids = ["top", "about", "partners", "contact"];
  var visible = {};

  function atBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  }

  // The last section is too short to reach the band under the bar, so the
  // page bottom counts as being in it.
  function update() {
    var current = atBottom()
      ? ids[ids.length - 1]
      : ids.filter(function (id) { return id !== "top" && visible[id]; })[0] || "top";
    links.forEach(function (a) {
      if (a.dataset.section === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    update();
  }, { rootMargin: "-70px 0px -60% 0px" });
  window.addEventListener("scroll", update, { passive: true });

  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el && id !== "top") observer.observe(el);
  });
  update();
})();
