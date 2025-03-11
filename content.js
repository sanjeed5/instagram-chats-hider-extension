// State management
let sidebarVisible = true;

// Helper function to get element by XPath
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Helper function to find sidebar using multiple strategies
function findSidebar() {
  // Strategy 1: Try to find by role and aria-label (most resilient)
  const sidebarByRole = document.querySelector('div[aria-label="Thread list"][role="navigation"]');
  if (sidebarByRole) return sidebarByRole;
  
  // Strategy 2: Try to find by class patterns that are common in Instagram's sidebar
  const possibleSidebars = Array.from(document.querySelectorAll('div[role="navigation"]'));
  const sidebarByContent = possibleSidebars.find(el => 
    el.querySelector('div[role="tablist"]') || // Tabs like "Primary", "General", "Requests"
    el.textContent.includes('Primary') || 
    el.textContent.includes('General')
  );
  if (sidebarByContent) return sidebarByContent;
  
  // Strategy 3: Look for elements with common Instagram class patterns
  // These class names may change, but the pattern of many x-prefixed classes is consistent
  const sidebarByClasses = document.querySelector('div[class*="x9f619"][class*="x1n2onr6"][class*="x1ja2u2z"][class*="x78zum5"][class*="xdt5ytf"][class*="x2lah0s"]');
  if (sidebarByClasses) return sidebarByClasses;
  
  // Strategy 4: Try to find by structure - looking for elements that contain message threads
  const threadContainers = document.querySelectorAll('div[role="list"]');
  const messageContainer = Array.from(threadContainers).find(el => 
    el.getAttribute('aria-label')?.includes('Chat') || 
    el.querySelectorAll('div[role="listitem"]').length > 0
  );
  if (messageContainer?.parentElement?.parentElement) {
    return messageContainer.parentElement.parentElement;
  }
  
  // Strategy 5: Fallback to the original XPath as last resort
  return getElementByXPath('/html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/section/div/div/div/div[1]/div/div[1]');
}

// Apply sidebar visibility based on current state
function applySidebarVisibility() {
  const sidebar = findSidebar();
  if (sidebar) {
    sidebar.style.display = sidebarVisible ? '' : 'none';
    console.log('Instagram DM Hider: Sidebar ' + (sidebarVisible ? 'shown' : 'hidden'));
  } else {
    console.log('Instagram DM Hider: Sidebar element not found');
  }
  
  // Also apply CSS class to body for more robust hiding
  if (!sidebarVisible) {
    document.body.classList.add('hide-dm-sidebar');
  } else {
    document.body.classList.remove('hide-dm-sidebar');
  }
}

// Toggle sidebar visibility
function toggleSidebar() {
  sidebarVisible = !sidebarVisible;
  applySidebarVisibility();
  chrome.storage.local.set({ sidebarVisible });
}

// Initialize sidebar state
function initializeSidebar() {
  chrome.storage.local.get(['sidebarVisible'], (result) => {
    if (result.sidebarVisible === undefined) {
      chrome.storage.local.set({ sidebarVisible: true });
    } else {
      sidebarVisible = result.sidebarVisible;
      applySidebarVisibility();
    }
  });
}

// Function to check if we're on a specific DM thread page
function isDMPage() {
  // Only match URLs with the format: https://www.instagram.com/direct/t/{thread-id}/
  return /^https?:\/\/(www\.)?instagram\.com\/direct\/t\/\d+\/?/.test(window.location.href);
}

// Set or remove the data attribute on body based on current page
function updateBodyAttribute() {
  if (isDMPage()) {
    document.body.setAttribute('data-instagram-dm-page', 'true');
    // Ensure we apply the correct sidebar visibility state when returning to a DM page
    chrome.storage.local.get(['sidebarVisible'], (result) => {
      if (result.sidebarVisible !== undefined) {
        sidebarVisible = result.sidebarVisible;
        // Apply with a slight delay to ensure the DOM has updated
        setTimeout(() => {
          applySidebarVisibility();
        }, 100);
      }
    });
  } else {
    document.body.removeAttribute('data-instagram-dm-page');
    // Also ensure we remove the hide-dm-sidebar class when not on a DM page
    document.body.classList.remove('hide-dm-sidebar');
  }
}

// Initialize extension
function initialize() {
  // Update body attribute regardless of page type
  updateBodyAttribute();
  
  // Only proceed with sidebar functionality if on a DM page
  if (!isDMPage()) return;
  
  // Set up a mutation observer to handle dynamic content loading
  const observer = new MutationObserver((mutations) => {
    // Check if our target sidebar exists now
    const sidebar = findSidebar();
    if (sidebar) {
      applySidebarVisibility();
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for URL changes (Instagram is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Update body attribute and initialize if needed
    updateBodyAttribute();
    initialize();
  }
}).observe(document, { subtree: true, childList: true });

// Initial setup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    sidebarVisible = request.sidebarVisible;
    applySidebarVisibility();
  }
});
