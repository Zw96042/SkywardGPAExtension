// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("predictionToggle");

  // Load toggle state
  chrome.storage.sync.get(["predictionEnabled"], (data) => {
    toggle.checked = data.predictionEnabled || false;
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ predictionEnabled: enabled });

    // Inform content script immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "TOGGLE_PREDICTION",
        enabled: enabled,
      });
    });
    console.log("changed");
  });
});