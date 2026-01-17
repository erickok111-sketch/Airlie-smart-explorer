export function setupCategoryBar({ categories, onToggle }) {
  const bar = document.getElementById("categoryBar");
  const selected = new Set(categories);

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;

    const cat = btn.dataset.cat;

    if (selected.has(cat)) {
      selected.delete(cat);
      btn.classList.remove("active");
    } else {
      selected.add(cat);
      btn.classList.add("active");
    }

    onToggle(new Set(selected));
  });

  return selected;
}

export function setupBestTodayToggle({ onChange }) {
  const el = document.getElementById("bestTodayToggle");
  el.addEventListener("change", () => onChange(el.checked));
  return el.checked;
}

export function openSheet() {
  const sheet = document.getElementById("sheet");
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}

export function closeSheet() {
  const sheet = document.getElementById("sheet");
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
}

export function setupSheetClose() {
  const handle = document.getElementById("sheetHandle");
  handle.addEventListener("click", closeSheet);
}

function badge(text) {
  const div = document.createElement("div");
  div.className = "badge";
  div.textContent = text;
  return div;
}

export function renderPlaceDetail(props) {
  document.getElementById("sheetTitle").textContent = props.Name ?? "";
  document.getElementById("sheetSub").textContent = props.Category ?? "";

  const badgeRow = document.getElementById("badgeRow");
  badgeRow.innerHTML = "";

  if (props.Best_today === true) badgeRow.appendChild(badge("✅ Good right now"));
  if (props.Rain_ok === false) badgeRow.appendChild(badge("🌧 Rain sensitive"));
  if (props.Wind_ok === false) badgeRow.appendChild(badge("💨 Wind exposed"));
  if (props.Tide_ok === false) badgeRow.appendChild(badge("🌊 Tide dependent"));

  document.getElementById("sheetDesc").textContent = props.Description ?? "";
  document.getElementById("sheetBestTime").textContent = props["Best Time"] ?? props.Best_Time ?? "";
  document.getElementById("sheetDuration").textContent = props.Duration ?? "";
  document.getElementById("sheetFacilities").textContent = props.Facilities ?? "";
  document.getElementById("sheetSafety").textContent = props["Safety Notes"] ?? props.Safety_Notes ?? "";
  document.getElementById("sheetPhoto").textContent = props["Photo Tips"] ?? props.Photo_Tips ?? "";

  const website = document.getElementById("sheetWebsite");
  const booking = document.getElementById("sheetBooking");

  const websiteUrl = props.Website ?? "";
  const bookingUrl = props["Booking Link"] ?? props.Booking_Link ?? "";

  website.style.display = websiteUrl ? "inline-block" : "none";
  booking.style.display = bookingUrl ? "inline-block" : "none";

  if (websiteUrl) website.href = websiteUrl;
  if (bookingUrl) booking.href = bookingUrl;

  // Directions uses Google Maps with coords
  const dirBtn = document.getElementById("sheetDirections");
  dirBtn.onclick = () => {
    const lat = props.Latitude;
    const lng = props.Longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank", "noopener");
  };
}
