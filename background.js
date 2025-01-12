// Debugging - Ensure service worker runs
console.log("[Background.js] Service worker running!");

// Function to resize the window correctly
function resizeWindow(width) {
  chrome.windows.getCurrent((win) => {
    console.log(`[Background.js] Resizing to ${width}px`);
    chrome.windows.update(win.id, { width: width, height: win.height });
  });
}

// Listen for shortcut commands
chrome.commands.onCommand.addListener((command) => {
  console.log(`[Background.js] Received command: ${command}`);

  switch (command) {
    case "resize-1536":
      resizeWindow(1536);
      break;
    case "resize-1280":
      resizeWindow(1280);
      break;
    case "resize-1024":
      resizeWindow(1024);
      break;
    case "resize-640":
      resizeWindow(640);
      break;
    default:
      console.log("[Background.js] Unknown command received");
  }
});
