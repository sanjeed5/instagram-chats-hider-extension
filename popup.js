// Get the toggle checkbox element
const toggle = document.getElementById('sidebarToggle');

// Initialize toggle state from storage
chrome.storage.local.get(['sidebarVisible'], (result) => {
  // Set initial state of the toggle checkbox
  toggle.checked = result.sidebarVisible !== false;
});

// Listen for toggle changes
toggle.addEventListener('change', (e) => {
  const sidebarVisible = e.target.checked;
  
  // Update storage
  chrome.storage.local.set({ sidebarVisible });
  
  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar', sidebarVisible });
    }
  });
});
