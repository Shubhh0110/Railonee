// Set Default Journey Date to Tomorrow
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("journey-date");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split("T")[0];
  }

  // Station Swap button functionality
  const swapBtn = document.getElementById("swap-stations");
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const fromInput = document.getElementById("from-station");
      const toInput = document.getElementById("to-station");
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
    });
  }

  // Setup tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tabKey = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.remove("active");
      });
      const activePanel = document.getElementById("tab-" + tabKey);
      if (activePanel) activePanel.classList.add("active");
    });
  });
});

// Switch Tab programmatically
function switchServiceTab(tabName) {
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.click();
}

// Active Bottom Nav Item helper
function setActiveNav(el) {
  document.querySelectorAll(".bottom-tab-bar .nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  el.classList.add("active");
}

// Search Train mock results
function handleTrainSearch() {
  const from = document.getElementById("from-station").value;
  const to = document.getElementById("to-station").value;
  const date = document.getElementById("journey-date").value;
  const resultsArea = document.getElementById("results-area");
  const resultsList = document.getElementById("results-list");
  const countSpan = document.getElementById("results-count");

  const trains = [
    {
      num: "22226",
      name: "VANDE BHARAT EXP",
      dep: "06:25 AM",
      arr: "09:30 AM",
      duration: "03h 05m",
      classes: [
        { name: "CC", status: "AVL 48", fare: "₹560", type: "avail" },
        { name: "EC", status: "AVL 12", fare: "₹1,080", type: "avail" },
      ],
    },
    {
      num: "12128",
      name: "INTERCITY SF EXP",
      dep: "06:30 AM",
      arr: "09:57 AM",
      duration: "03h 27m",
      classes: [
        { name: "2S", status: "WL 14", fare: "₹115", type: "wait" },
        { name: "CC", status: "AVL 32", fare: "₹385", type: "avail" },
      ],
    },
    {
      num: "12124",
      name: "DECCAN QUEEN SUPERFAST",
      dep: "07:15 AM",
      arr: "10:25 AM",
      duration: "03h 10m",
      classes: [
        { name: "2S", status: "AVL 86", fare: "₹120", type: "avail" },
        { name: "CC", status: "AVL 18", fare: "₹395", type: "avail" },
      ],
    },
  ];

  countSpan.innerText = `${trains.length} Trains found`;
  resultsList.innerHTML = trains
    .map(
      (t) => `
    <div class="train-item-card">
      <div class="train-main-info">
        <div class="train-name-block">
          <h4>${t.name}</h4>
          <span class="train-number">#${t.num} • Runs Daily</span>
        </div>
        <span class="pill-live" style="background: #e8f5e9; color: #1b873f;">On Time</span>
      </div>
      
      <div class="train-timing-row">
        <div class="time-box">
          <strong>${t.dep}</strong>
          <span>${from.split(" ")[0]}</span>
        </div>
        <div class="duration-line">
          <span>${t.duration}</span>
        </div>
        <div class="time-box" style="text-align: right;">
          <strong>${t.arr}</strong>
          <span>${to.split(" ")[0]}</span>
        </div>
      </div>

      <div class="classes-row">
        ${t.classes
          .map(
            (c) => `
          <div class="class-chip ${c.type === "avail" ? "available" : "waiting"}" onclick="bookCoach('${t.name}', '${c.name}', '${c.fare}')">
            <strong>${c.name}</strong>
            <span>${c.status}</span>
            <small style="display:block; color:#475569; font-weight:600;">${c.fare}</small>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");

  resultsArea.style.display = "block";
  resultsArea.scrollIntoView({ behavior: "smooth" });
}

// Simulated PNR Search
function handlePNRSearch() {
  const pnr = document.getElementById("pnr-number").value.trim();
  if (pnr.length !== 10) {
    alert("Please enter a valid 10-digit PNR number.");
    return;
  }
  openModal(
    "PNR Status: " + pnr,
    `
    <div style="background:#f8fafc; padding:12px; border-radius:10px; margin-bottom:12px;">
      <p><strong>Train:</strong> 22226 - Vande Bharat Express</p>
      <p><strong>Date:</strong> Tomorrow</p>
      <p><strong>From / To:</strong> Pune Jn (PUNE) ➔ CSMT</p>
    </div>
    <table style="width:100%; font-size:0.85rem; border-collapse:collapse; text-align:left;">
      <tr style="border-bottom:1px solid #e2e8f0;">
        <th style="padding:6px 0;">Passenger</th>
        <th>Booking Status</th>
        <th>Current Status</th>
      </tr>
      <tr>
        <td style="padding:8px 0;">Passenger 1</td>
        <td><span style="color:#1b873f; font-weight:bold;">CNF (C3 / 42)</span></td>
        <td><span style="color:#1b873f; font-weight:bold;">CONFIRMED</span></td>
      </tr>
    </table>
    <p style="font-size:0.75rem; color:#64748b; margin-top:10px;">Chart Not Prepared. Charting occurs 4 hours before departure.</p>
  `
  );
}

// Live Train Spotting
function handleLiveTrain() {
  const query = document.getElementById("train-query").value;
  openModal(
    "Live Running Status",
    `
    <div style="text-align:center; padding:10px;">
      <div style="font-size:2rem; margin-bottom:4px;">🚆</div>
      <h3 style="color:#0b4fba;">Train ${query}</h3>
      <p style="color:#1b873f; font-weight:bold; margin-top:4px;">Running On Time</p>
      <div style="background:#f1f5f9; padding:12px; border-radius:8px; margin-top:12px; font-size:0.85rem; text-align:left;">
        <p><strong>Last Station Passed:</strong> Lonavala (LNL) at 07:45 AM</p>
        <p><strong>Next Halt:</strong> Kalyan Jn (KYN) - Exp. 08:52 AM</p>
        <p><strong>Platform:</strong> Platform 4 (Expected)</p>
      </div>
    </div>
  `
  );
}

// E-Catering
function handleFoodOrder() {
  const pnr = document.getElementById("food-pnr").value;
  openModal(
    "IRCTC E-Catering",
    `
    <p>IRCTC verified food vendors available for <strong>${pnr}</strong>:</p>
    <ul style="margin-top:10px; padding-left:18px; font-size:0.85rem; line-height:1.7;">
      <li>Haldiram's - Thali & Snacks (Available at Pune Jn)</li>
      <li>Comscreen Food Plaza - South Indian & North Indian</li>
      <li>Domino's Pizza Delivery to Berth (Available at Kalyan)</li>
    </ul>
    <p style="margin-top:12px; font-size:0.75rem; color:#64748b;">Direct delivery to your seat 15 minutes before arrival.</p>
  `
  );
}

// Quick action modals
function openModal(type, customContent = null) {
  const modal = document.getElementById("app-modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");

  if (customContent) {
    title.innerText = type;
    body.innerHTML = customContent;
  } else if (type === "rwallet") {
    title.innerText = "RailOne R-Wallet";
    body.innerHTML = `
      <p>Balance: <strong>₹450.00</strong></p>
      <p style="margin-top:6px; color:#1b873f; font-weight:600;">3% Recharge Cashback Active</p>
      <p style="margin-top:10px; font-size:0.82rem; color:#64748b;">Use R-Wallet for zero PG fees on UTS suburban and platform tickets.</p>
    `;
  } else if (type === "madad") {
    title.innerText = "Rail Madad Grievance";
    body.innerHTML = `
      <p>Direct integration with Ministry of Railways helpline.</p>
      <p style="margin-top:10px; font-size:0.85rem;"><strong>Instant Call:</strong> Dial 139 (Toll Free)</p>
      <p style="font-size:0.85rem;"><strong>Clean My Coach:</strong> Send SMS with PNR to 58888</p>
    `;
  } else if (type === "coach") {
    title.innerText = "Coach Position Indicator";
    body.innerHTML = `
      <p>View coach sequence from Engine to Guard Van:</p>
      <div style="background:#f1f5f9; padding:10px; border-radius:6px; margin-top:8px; font-size:0.8rem; overflow-x:auto; white-space:nowrap;">
        ENG ➔ SLR ➔ GS ➔ S1 ➔ S2 ➔ B1 ➔ B2 ➔ A1 ➔ GS ➔ SLR
      </div>
    `;
  } else if (type === "refund") {
    title.innerText = "Instant Refund & TDR";
    body.innerHTML = `
      <p>Instant UPI/Bank refund processing within 15 to 45 minutes for auto-cancelled waitlist tickets and eligible TDR filings.</p>
    `;
  } else if (type === "account") {
    title.innerText = "RailOne Account";
    body.innerHTML = `
      <p><strong>User:</strong> Rohit Kshirsagar</p>
      <p><strong>IRCTC Linked:</strong> Yes (Verified)</p>
      <p><strong>Aadhaar Status:</strong> KYC Verified (12 tickets/mo)</p>
    `;
  }

  modal.classList.add("open");
}

function closeModal() {
  const modal = document.getElementById("app-modal");
  modal.classList.remove("open");
}

function bookCoach(trainName, coachClass, fare) {
  openModal(
    "Proceed to Booking",
    `
    <p>Selected Train: <strong>${trainName}</strong></p>
    <p>Class: <strong>${coachClass}</strong> | Fare: <strong>${fare}</strong></p>
    <p style="margin-top:10px; font-size:0.82rem; color:#64748b;">Redirecting to IRCTC secured gateway with single sign-on credentials.</p>
  `
  );
}