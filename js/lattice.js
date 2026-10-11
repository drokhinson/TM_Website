// Hero background: a hexagonal lattice with a node on each ring, drifting
// slowly sideways. It only animates while the hero is on screen, and draws a
// single still frame under reduced motion.
(function () {
  "use strict";

  var canvas = document.getElementById("lattice");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var ROOT = document.documentElement;
  var SIZE = 38;
  var H = SIZE * Math.sqrt(3) / 2;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var colour = "";
  var running = false;
  var raf = 0;

  function readColour() {
    colour = getComputedStyle(ROOT).getPropertyValue("--lattice").trim();
  }

  function hex(cx, cy) {
    ctx.beginPath();
    for (var i = 0; i <= 6; i++) {
      var a = Math.PI / 3 * i;
      ctx.lineTo(cx + SIZE / 2 * Math.cos(a), cy + SIZE / 2 * Math.sin(a));
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + SIZE / 2, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(t) {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;
    ctx.lineWidth = 1;

    var step = SIZE * 3;
    var drift = (t / 90) % step;
    for (var y = -H; y < rect.height + H; y += H * 2) {
      for (var x = -step + drift; x < rect.width + step; x += step) {
        hex(x, y);
        hex(x + SIZE * 1.5, y + H);
      }
    }
  }

  function frame(t) {
    draw(t);
    raf = running ? requestAnimationFrame(frame) : 0;
  }

  function setRunning(on) {
    running = on && !reduce.matches;
    if (running && !raf) raf = requestAnimationFrame(frame);
    if (!running) draw(performance.now());
  }

  readColour();
  document.addEventListener("bc:theme", function () {
    // The theme's tokens apply on the next style pass.
    requestAnimationFrame(function () { readColour(); if (!running) draw(performance.now()); });
  });
  window.addEventListener("resize", function () { if (!running) draw(performance.now()); });
  reduce.addEventListener("change", function () { setRunning(true); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      setRunning(entries[0].isIntersecting && !document.hidden);
    }).observe(canvas);
    document.addEventListener("visibilitychange", function () {
      var r = canvas.getBoundingClientRect();
      setRunning(!document.hidden && r.bottom > 0 && r.top < window.innerHeight);
    });
  } else {
    setRunning(true);
  }
})();
