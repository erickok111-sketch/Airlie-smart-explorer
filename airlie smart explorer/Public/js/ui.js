export function initCategoryBar(onChange) {
  const bar = document.getElementById("categoryBar");
  const selected = new Set([...bar.querySelectorAll("button[data-cat]")].map(b => b.dataset.cat));

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    const cat = btn.dataset.cat;

    btn.classList.toggle("active");
    if (selected.has(cat)) selected.delete(cat); else selected.add(cat);

    onChange(new Set(selected));
  });

  return selected;
}

export function initBestTodayToggle(onChange) {
  const el = document.getElementById("bestTodayToggle");
  el.addEventListener("change", () => onChange(el.checked));
  return el.checked;
}
