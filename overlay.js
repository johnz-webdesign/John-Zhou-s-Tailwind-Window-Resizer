/*
 * John Zhou's Tailwind Window Resizer
 * Copyright © 2025 John Zhou
 *
 * This software is licensed under the MIT License.
 * See the LICENSE file for details.
 */

(() => {
  let id = "screen-size-overlay";
  if (document.getElementById(id)) return;

  let el = document.createElement("div");
  el.id = id;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "10px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "5px 10px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    zIndex: "9999",
    borderRadius: "5px",
  });
  document.body.appendChild(el);

  function updateSize() {
    el.textContent = `${window.innerWidth} × ${window.innerHeight}`;
  }

  window.addEventListener("resize", updateSize);
  updateSize();
})();
