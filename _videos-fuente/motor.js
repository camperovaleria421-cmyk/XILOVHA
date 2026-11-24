const logo = new Image();
logo.onload = () => {
  const o = document.getElementById("o");
  try {
    const q = new URLSearchParams(location.search), v = VID[q.get("v")], fps = 15, ts = q.get("t");
    const L = ts ? ts.split(",").map(Number) : Array.from({ length: Math.ceil(v.dur * fps) }, (_, i) => i / fps);
    const out = L.map(t => {
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = "#cfd8e0"; g.fillRect(0, 0, W, H);
      v.f(t);
      return cv.toDataURL("image/jpeg", 0.92).slice(23);
    });
    o.textContent = "\n" + out.join("\n") + "\n";
  } catch (e) { o.textContent = "ERROR_JS " + e.stack; }
};
logo.src = LOGO;
