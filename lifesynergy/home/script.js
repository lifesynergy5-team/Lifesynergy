// State
let migrants = [];
let selectedMigrant = null;
let aiEstimateLoading = false;

// DOM Elements
const migrantForm = document.getElementById("migrantForm");
const migrantListContainer = document.getElementById("migrantList");
const totalRecordsEl = document.getElementById("totalRecords");
const vaccinatedEl = document.getElementById("vaccinated");
const chronicEl = document.getElementById("chronic");
const summaryRingsEl = document.getElementById("summaryRings");
const migrantDetailsEl = document.getElementById("migrantDetails");
const detailsContentEl = document.getElementById("detailsContent");
const loadSampleBtn = document.getElementById("loadSampleBtn");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");

// Dashboard Summary
function updateDashboardSummary() {
  const vaccinatedCount = migrants.filter(m => m.vaccine && m.vaccine !== "None" && m.vaccine !== "No").length;
  const chronicCount = migrants.filter(m => m.chronic && m.chronic !== "No" && m.chronic !== "None").length;
  const totalCount = migrants.length;

  totalRecordsEl.textContent = totalCount;
  vaccinatedEl.textContent = vaccinatedCount;
  chronicEl.textContent = chronicCount;

  renderSummaryRings(vaccinatedCount, chronicCount, totalCount);
}

// Summary Rings
function renderSummaryRings(vaccinated, chronic, total) {
  const vacPct = total > 0 ? Math.round((vaccinated / total) * 100) : 0;
  const chrPct = total > 0 ? Math.round((chronic / total) * 100) : 0;

  summaryRingsEl.innerHTML = `
    <div class="text-center">
      <svg width="120" height="120" viewBox="0 0 36 36" class="transform -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e0e0e0" stroke-width="3" />
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round" stroke-dasharray="${vacPct} 100" class="transition-all duration-700" />
        <text x="18" y="20" text-anchor="middle" font-size="5" fill="#333" dy="1">${vacPct}%</text>
      </svg>
      <p class="text-sm font-medium mt-1 text-slate-700">Vaccinated</p>
    </div>
    <div class="text-center">
      <svg width="120" height="120" viewBox="0 0 36 36" class="transform -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e0e0e0" stroke-width="3" />
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#4fd1c5" stroke-width="3" stroke-linecap="round" stroke-dasharray="${chrPct} 100" class="transition-all duration-700" />
        <text x="18" y="20" text-anchor="middle" font-size="5" fill="#333" dy="1">${chrPct}%</text>
      </svg>
      <p class="text-sm font-medium mt-1 text-slate-700">Chronic Illness</p>
    </div>
  `;
}

// Migrant List
function renderMigrantList() {
  migrantListContainer.innerHTML = "";
  migrants.forEach(migrant => {
    const migrantDiv = document.createElement("div");
    migrantDiv.className = `p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 ${selectedMigrant && selectedMigrant.id === migrant.id ? "bg-blue-50 border-blue-400" : "bg-white hover:bg-slate-50 border-slate-300"}`;
    migrantDiv.innerHTML = `
      <div>
        <div class="font-semibold text-slate-800">
          ${migrant.name} <span class="text-sm text-slate-500 font-mono">(${migrant.id})</span>
        </div>
        <div class="text-sm text-slate-500 mt-1">
          From: ${migrant.state} • Last Visit: ${migrant.lastVisit || "N/A"}
        </div>
      </div>
      <div class="flex gap-2 mt-3 sm:mt-0 self-start sm:self-center">
        <button class="view-btn btn-secondary">View</button>
        <button class="ai-estimate-btn px-3 py-1 rounded-md bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors" title="${aiEstimateLoading ? "Estimating..." : "AI Health Estimate"}">
          ${aiEstimateLoading ? "..." : "AI Est."}
        </button>
        <button class="export-btn btn-secondary">Export</button>
      </div>
    `;
    migrantDiv.querySelector(".view-btn").addEventListener("click", () => showMigrantDetails(migrant));
    migrantDiv.querySelector(".ai-estimate-btn").addEventListener("click", () => simulateAIEstimate(migrant.id));
    migrantDiv.querySelector(".export-btn").addEventListener("click", () => exportReport(migrant));
    migrantListContainer.appendChild(migrantDiv);
  });
}

// Show Details
function showMigrantDetails(migrant) {
  selectedMigrant = migrant;
  migrantDetailsEl.classList.remove("hidden");
  detailsContentEl.innerHTML = `
    <p class="text-slate-500">Name:</p><p class="font-semibold text-slate-800">${migrant.name}</p>
    <p class="text-slate-500">ID:</p><p class="font-semibold text-slate-800 font-mono">${migrant.id}</p>
    <p class="text-slate-500">Age:</p><p class="font-semibold text-slate-800">${migrant.age}</p>
    <p class="text-slate-500">State:</p><p class="font-semibold text-slate-800">${migrant.state}</p>
    <p class="text-slate-500">Vaccine Status:</p><p class="font-semibold text-slate-800">${migrant.vaccine || "N/A"}</p>
    <p class="text-slate-500">Chronic Conditions:</p><p class="font-semibold text-slate-800">${migrant.chronic || "N/A"}</p>
    <p class="text-slate-500">Last Clinic Visit:</p><p class="font-semibold text-slate-800">${migrant.lastVisit}</p>
    <p class="text-slate-500">AI Health Risk:</p>
    <p class="font-bold ${migrant.riskScore > 60 ? 'text-red-500' : 'text-green-600'}">
      ${migrant.riskScore !== undefined ? `${migrant.riskScore}%` : "Not estimated"}
    </p>
  `;
  renderMigrantList();
}

// Close Details
function closeMigrantDetails() {
  selectedMigrant = null;
  migrantDetailsEl.classList.add("hidden");
  renderMigrantList();
}

// Add Migrant
function addMigrant(event) {
  event.preventDefault();
  const newMigrant = {
    id: `M-${Math.floor(Math.random() * 900 + 100)}`,
    name: event.target.name.value,
    age: event.target.age.value,
    state: event.target.state.value,
    vaccine: event.target.vaccine.value,
    chronic: event.target.chronic.value,
    lastVisit: event.target.lastVisit.value,
  };
  migrants.unshift(newMigrant);
  migrantForm.reset();
  renderAll();
}

// AI Simulation
function simulateAIEstimate(migrantId) {
  aiEstimateLoading = true;
  renderMigrantList();
  setTimeout(() => {
    migrants = migrants.map(m => (m.id === migrantId ? { ...m, riskScore: Math.round(Math.random() * 100) } : m));
    aiEstimateLoading = false;
    renderMigrantList();
    if (selectedMigrant && selectedMigrant.id === migrantId) {
      showMigrantDetails(migrants.find(m => m.id === migrantId));
    }
  }, 900);
}

// Export Report
function exportReport(migrant) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(migrant, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${migrant.id}_report.json`);




  
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Sample Data
function loadSampleData() {
  migrants = [
    { id: "M-001", name: "Ravi Kumar", age: 28, state: "Bihar", vaccine: "TT 2", chronic: "No", lastVisit: "2024-09-01" },
    { id: "M-002", name: "Fatima Sheikh", age: 33, state: "West Bengal", vaccine:
