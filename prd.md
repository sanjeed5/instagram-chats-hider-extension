# Instagram DM Sidebar Hider - Developer Guide

## Project Structure
```
instagram-chats-hider/
├── manifest.json         # Extension configuration
├── content.js            # Content script for DOM manipulation
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality for toggling sidebar
├── styles.css            # Custom styles for Instagram elements
├── README.md             # Project documentation
├── LICENSE               # MIT License
└── icons/                # Extension icons in various sizes
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Implementation Details

### Core Functionality
The extension works by targeting the Instagram DM sidebar using multiple targeting strategies and applying CSS to hide it when toggled. It uses the Chrome Storage API to persist the user's preference.

### URL Targeting
The extension is specifically designed to only activate on Instagram Direct Message thread pages with URLs matching the pattern:
```
https://www.instagram.com/direct/t/{thread-id}/
```

This ensures the extension only runs on actual conversation threads and not on other Instagram pages.

### Element Targeting
The extension uses a multi-layered approach to target the Instagram DM sidebar:

1. **Accessibility-Based Targeting**
   - Targets elements with `role="navigation"` and `aria-label="Thread list"`
   - Most resilient to UI changes as accessibility attributes are less likely to change

2. **Content-Based Targeting**
   - Looks for navigation elements containing tabs like "Primary", "General", "Requests"
   - Finds elements based on their content rather than structure

3. **Class Pattern Recognition**
   - Identifies Instagram's characteristic x-prefixed class patterns
   - Example: `div[class*="x9f619"][class*="x1n2onr6"][class*="x1ja2u2z"]`

4. **Structure-Based Targeting**
   - Finds elements that contain message threads
   - Looks for elements with `role="list"` containing `role="listitem"` children

5. **XPath Fallback**
   - Uses XPath as a last resort: `/html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/section/div/div/div/div[1]/div/div[1]`
   - Provides backward compatibility with previous versions

### State Management
- Stores visibility state in chrome.storage.local
- Toggles sidebar visibility when extension icon is clicked
- Syncs state between popup and content script
- Handles page refreshes and navigation

### User Experience
- Provides visual feedback in popup for current sidebar state
- Ensures smooth transitions when hiding/showing
- One-click toggle via extension icon for simplicity

## Development Guidelines

### Adding New Features
1. Ensure compatibility with Instagram's current DOM structure
2. Test on different Instagram chat pages
3. Verify state persistence
4. Ensure no conflicts with Instagram's functionality
5. Test performance and load times

### Updating Element Selectors
Instagram's DOM structure may change over time. The extension uses multiple targeting strategies to remain resilient to these changes. If the extension stops working:

1. Check the browser console for any error messages
2. Verify which targeting strategies are failing
3. Update the relevant selectors in `content.js` and `styles.css`
4. Consider adding new targeting strategies if Instagram has significantly changed its UI

### Building for Production
1. Test all functionality
2. Update version number in `manifest.json`
3. Create a zip file of all necessary files for Chrome Web Store submission

## Testing
Test the extension on various Instagram DM thread pages with the format `https://www.instagram.com/direct/t/{thread-id}/` to ensure it works consistently across different chat states and screen sizes.

## Sidebar details
sideabar.html 
Selector: #mount_0_0_TQ > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x1v4esvl.x8vgawa > section > main > section > div > div > div > div.xjp7ctv > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.xvbhtw8.__web-inspector-hide-shortcut__

JS Path = document.querySelector("#mount_0_0_TQ > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x1v4esvl.x8vgawa > section > main > section > div > div > div > div.xjp7ctv > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.xvbhtw8.__web-inspector-hide-shortcut__")

Full XPATH = /html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/section/div/div/div/div[1]/div/div[1]