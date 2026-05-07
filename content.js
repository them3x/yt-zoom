(function () {
  let scale = 1;
  let panX = 0, panY = 0;
  let ox = 50, oy = 50;
  let natLeft = 0, natTop = 0, natW = 0, natH = 0;
  const MIN = 1, MAX = 5, STEP = 0.15;
  const DRAG_THRESHOLD = 5;
  const MAP_W = 200;

  let dragActive = false, wasDragging = false;
  let startX, startY, lastX, lastY;
  let minimap = null;
  let rafId = null;

  function getVideo() {
    return document.querySelector("video.html5-main-video");
  }

  // --- Minimap ---
  function createMinimap() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position:fixed; bottom:70px; right:20px;
      width:${MAP_W}px; border-radius:8px; overflow:hidden;
      border:2px solid rgba(255,255,255,0.25);
      box-shadow:0 4px 16px rgba(0,0,0,0.6);
      display:none; z-index:99999; pointer-events:none;
      background:#000;
    `;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block; width:100%;';

    const rect = document.createElement('div');
    rect.style.cssText = `
      position:absolute; box-sizing:border-box;
      border:2px solid rgba(88,166,255,0.9);
      background:rgba(88,166,255,0.15);
      border-radius:2px;
    `;
    wrap.appendChild(canvas);
    wrap.appendChild(rect);
    document.body.appendChild(wrap);
    return { wrap, canvas, rect };
  }

  function updateMinimap() {
    if (!minimap) return;
    const { wrap, canvas, rect } = minimap;
    const video = getVideo();

    if (scale <= 1 || !video || !natW) {
      wrap.style.display = 'none';
      return;
    }

    const mapH = Math.round(MAP_W * natH / natW);
    if (canvas.width !== MAP_W || canvas.height !== mapH) {
      canvas.width  = MAP_W;
      canvas.height = mapH;
      wrap.style.height = mapH + 'px';
    }
    wrap.style.display = 'block';

    // Desenha o frame atual do vídeo (sem zoom)
    try {
      canvas.getContext('2d').drawImage(video, 0, 0, MAP_W, mapH);
    } catch(e) {}

    // Calcula a área visível no espaço local do vídeo
    // Com transform-origin (oxW, oyH) + translate(panX, panY) + scale(s):
    //   screen_x = natLeft + s*(lx - oxW) + panX + oxW
    // Invertendo para lx quando screen_x = natLeft e natLeft+natW:
    const oxW = ox / 100 * natW;
    const oyH = oy / 100 * natH;
    const visLeft = oxW - (oxW + panX) / scale;
    const visTop  = oyH - (oyH + panY) / scale;
    const visW    = natW / scale;
    const visH    = natH / scale;

    // Converte para coordenadas do minimap
    const rx = (visLeft / natW) * MAP_W;
    const ry = (visTop  / natH) * mapH;
    const rw = (visW    / natW) * MAP_W;
    const rh = (visH    / natH) * mapH;

    rect.style.left   = rx.toFixed(1) + 'px';
    rect.style.top    = ry.toFixed(1) + 'px';
    rect.style.width  = rw.toFixed(1) + 'px';
    rect.style.height = rh.toFixed(1) + 'px';
  }

  // Loop leve para atualizar o frame do minimap
  function startMapLoop() {
    if (rafId) return;
    function loop() {
      if (scale > 1) {
        updateMinimap();
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(loop);
  }

  // --- Transform ---
  function applyTransform(video, animate) {
    video.style.transition = animate ? "transform 0.08s ease-out" : "none";
    if (scale <= 1 && panX === 0 && panY === 0) {
      video.style.transform = "";
      video.style.transformOrigin = "";
      if (minimap) minimap.wrap.style.display = 'none';
    } else {
      video.style.transformOrigin = `${ox.toFixed(2)}% ${oy.toFixed(2)}%`;
      video.style.transform = `translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px) scale(${scale.toFixed(2)})`;
      startMapLoop();
    }
  }

  function isOver(r, e) {
    return r && e.clientX >= r.left && e.clientX <= r.right &&
               e.clientY >= r.top  && e.clientY <= r.bottom;
  }

  // --- Eventos ---
  document.addEventListener("wheel", function (e) {
    const video = getVideo();
    if (!video) return;
    const r = video.getBoundingClientRect();
    if (!isOver(r, e)) return;

    // capture:true + stopImmediatePropagation garante que o YouTube
    // nunca vê o evento (inclusive em tela cheia onde ele usa capture phase)
    e.preventDefault();
    e.stopImmediatePropagation();

    // Captura dimensões naturais quando não há zoom
    if (scale === 1) {
      natLeft = r.left; natTop = r.top;
      natW = r.width;   natH = r.height;
      if (!minimap) minimap = createMinimap();
    }

    ox = ((e.clientX - r.left) / r.width)  * 100;
    oy = ((e.clientY - r.top)  / r.height) * 100;

    scale = e.deltaY < 0 ? Math.min(scale + STEP, MAX) : Math.max(scale - STEP, MIN);
    if (scale <= 1) { scale = 1; panX = 0; panY = 0; }

    applyTransform(video, true);
  }, { passive: false, capture: true });

  document.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    const video = getVideo();
    if (!isOver(video && video.getBoundingClientRect(), e)) return;
    dragActive = false; wasDragging = false;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
  });

  document.addEventListener("mousemove", function (e) {
    if (lastX === undefined || scale <= 1) return;
    if (!dragActive && Math.hypot(e.clientX - startX, e.clientY - startY) > DRAG_THRESHOLD)
      dragActive = true;
    if (dragActive) {
      panX += e.clientX - lastX;
      panY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const v = getVideo();
      if (v) applyTransform(v, false);
    }
  });

  document.addEventListener("mouseup", function (e) {
    if (e.button !== 0) return;
    wasDragging = dragActive;
    dragActive = false; lastX = undefined;
  });

  document.addEventListener("click", function (e) {
    if (wasDragging) { e.stopPropagation(); e.preventDefault(); wasDragging = false; }
  }, true);

  document.addEventListener("dblclick", function (e) {
    const video = getVideo();
    if (!isOver(video && video.getBoundingClientRect(), e)) return;
    scale = 1; panX = 0; panY = 0;
    applyTransform(video, true);
  });
})();
