(function () {
  const minimapCheckbox = document.getElementById("minimap-toggle");
  const zoomCheckbox = document.getElementById("zoom-toggle");

  browser.storage.local
    .get({ minimapEnabled: true, zoomDisabled: false })
    .then((result) => {
      minimapCheckbox.checked = result.minimapEnabled;
      zoomCheckbox.checked = result.zoomDisabled;
    });

  minimapCheckbox.addEventListener("change", () => {
    browser.storage.local.set({ minimapEnabled: minimapCheckbox.checked });
  });

  zoomCheckbox.addEventListener("change", () => {
    browser.storage.local.set({ zoomDisabled: zoomCheckbox.checked });
  });
})();
