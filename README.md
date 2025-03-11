# Instagram DM Sidebar Hider

A Chrome extension that allows you to hide the Instagram Direct Messages sidebar for a cleaner chat interface. This extension operates fully locally and doesn't collect any user data.

## Features

- Toggle the Instagram DM sidebar visibility with a single click
- Clean and minimal UI with an intuitive toggle switch
- Persistent state that remembers your preference
- Works with Instagram's dynamic content loading
- **Resilient to Instagram UI updates** with multi-strategy element targeting
- **Targeted functionality** that only activates on specific DM thread pages

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your browser toolbar

## Usage

1. Navigate to a specific Instagram Direct Message thread (`https://www.instagram.com/direct/t/{thread-id}/`)
2. Click the extension icon in your browser toolbar
3. Use the toggle switch to show or hide the DM sidebar
4. Enjoy a cleaner, more focused chat experience!

## How It Works

The extension uses content scripts to detect and manipulate the Instagram DM sidebar element. It leverages:

- **Multi-strategy element targeting** that combines:
  - Accessibility attributes (role, aria-label)
  - Content-based detection
  - Class pattern recognition
  - DOM structure analysis
  - XPath selectors as fallback
- MutationObserver to handle Instagram's dynamic content loading
- Chrome Storage API for state persistence
- Layered CSS selectors for robust styling and hiding
- URL pattern matching to only activate on specific DM thread pages

## Project Structure

```
instagram-chats-hider/
├── manifest.json     # Extension configuration
├── content.js        # Content script for DOM manipulation
├── popup.html        # Extension popup interface
├── popup.js          # Popup functionality for toggling sidebar
├── styles.css        # Custom styles for Instagram elements
└── icons/            # Extension icons in various sizes
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy

This extension does not collect any user data. It operates fully locally and only modifies the appearance of Instagram's DM interface within your browser. No data is sent to any external servers, and all settings are stored locally in your browser's storage.
