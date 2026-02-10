const NEIGHBORHOODS = [
  "Dinkytown",
  "Stadium Village",
  "Marcy-Holmes",
  "Como",
  "Prospect Park",
  "Cedar-Riverside",
  "East Bank",
  "West Bank",
  "St. Paul Campus",
  "Midtown",
];

const listings = [
  {
    id: 1,
    title: "Sunlit studio steps from Dinkytown",
    price: 1150,
    neighborhood: "Dinkytown",
    bedrooms: 0,
    moveIn: "2026-05-15",
    moveOut: "2026-08-20",
    distance: "0.3 mi",
    tags: ["Furnished", "Utilities included", "Wi-Fi"],
  },
  {
    id: 2,
    title: "2BR Riverside apartment",
    price: 1650,
    neighborhood: "Cedar-Riverside",
    bedrooms: 2,
    moveIn: "2026-06-01",
    moveOut: "2026-09-10",
    distance: "0.7 mi",
    tags: ["Balcony", "Pet friendly", "Parking"],
  },
  {
    id: 3,
    title: "Cozy 1BR in Stadium Village",
    price: 1450,
    neighborhood: "Stadium Village",
    bedrooms: 1,
    moveIn: "2026-05-20",
    moveOut: "2026-08-15",
    distance: "0.4 mi",
    tags: ["In-unit laundry", "Gym", "Furnished"],
  },
  {
    id: 4,
    title: "Shared 3BR near Como",
    price: 980,
    neighborhood: "Como",
    bedrooms: 3,
    moveIn: "2026-06-15",
    moveOut: "2026-12-15",
    distance: "0.9 mi",
    tags: ["Roommate match", "Study lounge", "Wi-Fi"],
  },
  {
    id: 5,
    title: "Modern studio by West Bank",
    price: 1325,
    neighborhood: "West Bank",
    bedrooms: 0,
    moveIn: "2026-05-10",
    moveOut: "2026-07-30",
    distance: "0.6 mi",
    tags: ["Rooftop", "Furnished", "Secure access"],
  },
  {
    id: 6,
    title: "Townhouse room in Marcy-Holmes",
    price: 860,
    neighborhood: "Marcy-Holmes",
    bedrooms: 1,
    moveIn: "2026-05-25",
    moveOut: "2026-08-25",
    distance: "0.8 mi",
    tags: ["Flexible dates", "Bike storage", "Utilities included"],
  },
  {
    id: 7,
    title: "Garden-level 1BR in Prospect Park",
    price: 1090,
    neighborhood: "Prospect Park",
    bedrooms: 1,
    moveIn: "2026-06-05",
    moveOut: "2026-09-05",
    distance: "0.7 mi",
    tags: ["Quiet street", "Walkable", "Furnished"],
  },
  {
    id: 8,
    title: "East Bank 2BR with study nook",
    price: 1500,
    neighborhood: "East Bank",
    bedrooms: 2,
    moveIn: "2026-05-18",
    moveOut: "2026-08-18",
    distance: "0.5 mi",
    tags: ["Study nook", "In-unit laundry", "Parking"],
  },
  {
    id: 9,
    title: "Studio in Midtown with skyline view",
    price: 980,
    neighborhood: "Midtown",
    bedrooms: 0,
    moveIn: "2026-05-12",
    moveOut: "2026-08-12",
    distance: "1.6 mi",
    tags: ["Utilities included", "Wi-Fi"],
  },
  {
    id: 10,
    title: "Spacious 2BR near St. Paul Campus",
    price: 1725,
    neighborhood: "St. Paul Campus",
    bedrooms: 2,
    moveIn: "2026-06-10",
    moveOut: "2026-09-20",
    distance: "0.4 mi",
    tags: ["Transit access", "Gym", "Balcony"],
  },
  {
    id: 11,
    title: "Quiet 1BR in Marcy-Holmes",
    price: 1200,
    neighborhood: "Marcy-Holmes",
    bedrooms: 1,
    moveIn: "2026-05-22",
    moveOut: "2026-08-22",
    distance: "0.8 mi",
    tags: ["Courtyard", "Bike storage", "Pet friendly"],
  },
  {
    id: 12,
    title: "Top-floor studio near East Bank",
    price: 1280,
    neighborhood: "East Bank",
    bedrooms: 0,
    moveIn: "2026-06-01",
    moveOut: "2026-08-31",
    distance: "0.5 mi",
    tags: ["Balcony", "Gym", "Security"],
  },
];

const searchInput = document.getElementById("search");
const priceInput = document.getElementById("price");
const priceValue = document.getElementById("priceValue");
const locationSelect = document.getElementById("location");
const bedroomsSelect = document.getElementById("bedrooms");
const moveInInput = document.getElementById("moveIn");
const moveOutInput = document.getElementById("moveOut");
const savedOnlyInput = document.getElementById("savedOnly");
const listingsContainer = document.getElementById("listings");
const resultCount = document.getElementById("resultCount");
const savedCount = document.getElementById("savedCount");

const emailInput = document.getElementById("email");
const verifyBtn = document.getElementById("verifyBtn");
const verifyStatus = document.getElementById("verifyStatus");
const gateMessage = document.getElementById("gateMessage");
const postAction = document.getElementById("postAction");
const browseAction = document.getElementById("browseAction");

const savedListings = new Set(
  JSON.parse(localStorage.getItem("savedListings") || "[]")
);

let isVerified = false;

const persistSaved = () => {
  localStorage.setItem("savedListings", JSON.stringify([...savedListings]));
};

const populateNeighborhoods = () => {
  NEIGHBORHOODS.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.value = neighborhood;
    option.textContent = neighborhood;
    locationSelect.appendChild(option);
  });
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const matchesDate = (listing, moveIn, moveOut) => {
  if (!moveIn && !moveOut) return true;
  const listingStart = new Date(listing.moveIn);
  const listingEnd = new Date(listing.moveOut);
  if (moveIn) {
    const desiredStart = new Date(moveIn);
    if (desiredStart < listingStart || desiredStart > listingEnd) return false;
  }
  if (moveOut) {
    const desiredEnd = new Date(moveOut);
    if (desiredEnd > listingEnd || desiredEnd < listingStart) return false;
  }
  return true;
};

const setVerificationState = (verified) => {
  isVerified = verified;
  verifyStatus.textContent = verified
    ? "Verified UMN email"
    : "Not verified";
  gateMessage.style.display = verified ? "none" : "grid";
  postAction.disabled = !verified;
  browseAction.disabled = !verified;

  const filterSection = document.querySelector(".filters");
  const resultsSection = document.querySelector(".results");
  if (filterSection && resultsSection) {
    filterSection.classList.toggle("disabled", !verified);
    resultsSection.classList.toggle("disabled", !verified);
  }
};

const renderListings = (items) => {
  listingsContainer.innerHTML = "";
  if (!items.length) {
    listingsContainer.innerHTML = "<p>No listings match your filters.</p>";
    resultCount.textContent = "0 results";
    savedCount.textContent = `${savedListings.size} saved`;
    return;
  }
  resultCount.textContent = `${items.length} results`;
  savedCount.textContent = `${savedListings.size} saved`;
  items.forEach((listing) => {
    const card = document.createElement("article");
    card.className = "card";
    const isSaved = savedListings.has(listing.id);
    card.innerHTML = `
      <div class="card-header">
        <h3>${listing.title}</h3>
        <button class="save-btn ${isSaved ? "is-saved" : ""}" data-id="${listing.id}" aria-pressed="${isSaved}">
          ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
      <div class="price">$${listing.price}</div>
      <div class="meta">${listing.neighborhood} · ${listing.distance} to campus</div>
      <div class="meta">${formatDate(listing.moveIn)} – ${formatDate(listing.moveOut)}</div>
      <div class="tags">
        ${listing.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    `;
    listingsContainer.appendChild(card);
  });
};

const applyFilters = () => {
  if (!isVerified) return;
  const searchTerm = searchInput.value.toLowerCase();
  const maxPrice = Number(priceInput.value);
  const neighborhood = locationSelect.value;
  const bedrooms = bedroomsSelect.value;
  const moveIn = moveInInput.value;
  const moveOut = moveOutInput.value;
  const savedOnly = savedOnlyInput.checked;

  const filtered = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm) ||
      listing.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      listing.neighborhood.toLowerCase().includes(searchTerm);
    const matchesPrice = listing.price <= maxPrice;
    const matchesNeighborhood = neighborhood === "all" || listing.neighborhood === neighborhood;
    const matchesBedrooms =
      bedrooms === "all" ||
      (bedrooms === "3" ? listing.bedrooms >= 3 : listing.bedrooms === Number(bedrooms));
    const matchesSaved = !savedOnly || savedListings.has(listing.id);

    return (
      matchesSearch &&
      matchesPrice &&
      matchesNeighborhood &&
      matchesBedrooms &&
      matchesDate(listing, moveIn, moveOut) &&
      matchesSaved
    );
  });

  renderListings(filtered);
};

listingsContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains("save-btn")) return;
  const id = Number(target.dataset.id);
  if (savedListings.has(id)) {
    savedListings.delete(id);
  } else {
    savedListings.add(id);
  }
  persistSaved();
  applyFilters();
});

[
  searchInput,
  priceInput,
  locationSelect,
  bedroomsSelect,
  moveInInput,
  moveOutInput,
  savedOnlyInput,
].forEach((input) => input.addEventListener("input", applyFilters));

priceInput.addEventListener("input", () => {
  priceValue.textContent = `$${Number(priceInput.value).toLocaleString()}`;
});

verifyBtn.addEventListener("click", () => {
  const value = emailInput.value.trim().toLowerCase();
  if (!value.endsWith("@umn.edu")) {
    verifyStatus.textContent = "Please use your @umn.edu email";
    return;
  }
  verifyStatus.textContent = "Verification sent. Click again to confirm.";
  if (verifyBtn.dataset.sent === "true") {
    setVerificationState(true);
    verifyBtn.textContent = "Verified";
    verifyBtn.disabled = true;
  } else {
    verifyBtn.dataset.sent = "true";
  }
});

populateNeighborhoods();
setVerificationState(false);
