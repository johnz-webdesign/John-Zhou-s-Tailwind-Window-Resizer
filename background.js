// Debugging - Ensure service worker runs
console.log("[Background.js] Service worker running!");

// Function to resize window and ensure exact viewport size
function resizeWindow(targetWidth) {
  chrome.windows.getCurrent((win) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("[Background.js] No active tab found!");
        return;
      }

      let tab = tabs[0];
      let tabId = tab.id;

      // Check if tab is a restricted page
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("about:") ||
        tab.url.startsWith("edge://")
      ) {
        console.warn(
          "[Background.js] Cannot resize a restricted page:",
          tab.url
        );
        return;
      }

      // Get viewport width
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          function: () => {
            return {
              viewportWidth: window.innerWidth,
              outerWidth: window.outerWidth,
            };
          },
        },
        (results) => {
          if (
            !results ||
            results.length === 0 ||
            results[0].result === undefined
          ) {
            console.error("[Background.js] Failed to get viewport width");
            return;
          }

          let { viewportWidth, outerWidth } = results[0].result;

          // Calculate the browser UI width difference
          let browserUIWidth = outerWidth - viewportWidth;
          let adjustedWidth = targetWidth + browserUIWidth;

          console.log(
            `[Background.js] Target: ${targetWidth}px | Initial Adjusted: ${adjustedWidth}px (Browser UI: ${browserUIWidth}px)`
          );

          // Apply the adjustment
          chrome.windows.update(
            win.id,
            { width: adjustedWidth, height: win.height },
            () => {
              setTimeout(() => {
                // SECOND RESIZE (Fix Remaining Offset)
                chrome.scripting.executeScript(
                  {
                    target: { tabId: tabId },
                    function: () => window.innerWidth,
                  },
                  (finalResults) => {
                    if (
                      !finalResults ||
                      finalResults.length === 0 ||
                      finalResults[0].result === undefined
                    ) {
                      console.error(
                        "[Background.js] Failed to get final viewport width"
                      );
                      return;
                    }

                    let finalViewportWidth = finalResults[0].result;
                    let finalOffset = targetWidth - finalViewportWidth;

                    if (Math.abs(finalOffset) > 0) {
                      console.warn(
                        `[Background.js] Final offset detected: ${finalOffset}px. Correcting...`
                      );
                      chrome.windows.update(win.id, {
                        width: adjustedWidth + finalOffset,
                        height: win.height,
                      });
                    }
                  }
                );
              }, 100);
            }
          );
        }
      );
    });
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
