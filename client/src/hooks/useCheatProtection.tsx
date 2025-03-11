import { useEffect, useState } from "react";

interface CheatProtectionOptions {
  onCheatDetected?: (type: string) => void;
  blockCtrlShortcuts?: boolean;
  blockScreenshot?: boolean;
  blockInspect?: boolean;
  blockCopy?: boolean;
  enabled?: boolean;
}

const useCheatProtection = ({
  onCheatDetected = (type) => console.warn(`Cheat detected: ${type}`),
  blockCtrlShortcuts = true,
  blockScreenshot = true,
  blockInspect = true,
  blockCopy = true,
  enabled = true,
}: CheatProtectionOptions = {}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const preventDefaultAndStop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const createPreventionOverlay = () => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "black";
      overlay.style.zIndex = "9999";
      overlay.style.display = "block";
      overlay.style.cursor = "pointer";

      const removeOverlay = () => {
        if (overlay.parentNode) {
          document.body.removeChild(overlay);
        }
        setOverlayVisible(false);
      };

      overlay.addEventListener("click", removeOverlay);
      overlay.addEventListener("touchstart", removeOverlay);

      document.body.appendChild(overlay);
      setOverlayVisible(true);
    };

    const preventCtrlShortcuts = (e: KeyboardEvent) => {
      if (!blockCtrlShortcuts || !e.ctrlKey) return;

      const blockedCtrlShortcuts = [
        e.key === "c",
        e.key === "x",
        e.key === "v",
        e.key === "a",
        e.key === "z",
        e.key === "y",
        e.key === "f",
        e.key === "s",
        e.key === "p",
        // e.key === "r",
        e.key === "d",
        e.key === "w",
        e.key === "t",
        e.key === "n",
      ];

      if (blockedCtrlShortcuts.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        createPreventionOverlay();
        onCheatDetected("CtrlShortcut");
      }
    };

    const preventDevTools = (e: KeyboardEvent) => {
      const devToolShortcuts = [
        e.key === "F12",
        e.ctrlKey && e.shiftKey && e.key === "I",
        e.ctrlKey && e.shiftKey && e.key === "C",
        e.ctrlKey && e.shiftKey && e.key === "J",
        e.ctrlKey && e.key === "U",
        e.metaKey && e.altKey && e.key === "I",
        e.metaKey && e.key === "Option",
      ];

      if (blockInspect && devToolShortcuts.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        createPreventionOverlay();
        onCheatDetected("DevTools");
      }
    };

    const preventCopy = (e: ClipboardEvent) => {
      if (blockCopy) {
        e.preventDefault();
        createPreventionOverlay();
        onCheatDetected("Copying");
      }
    };

    const preventScreenshot = (e: KeyboardEvent) => {
      const screenshotShortcuts = [
        e.key === "PrintScreen",
        (e.metaKey || e.key === "Meta") && e.shiftKey && e.key === "S",
        e.ctrlKey && e.key === "p",
        e.metaKey && e.key === "p",
      ];

      if (blockScreenshot && screenshotShortcuts.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        createPreventionOverlay();
        onCheatDetected("Screenshot");
      }
    };

    const disableSelection = () => {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    };

    document.addEventListener("keydown", preventDevTools);
    document.addEventListener("keydown", preventCtrlShortcuts);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("keyup", preventScreenshot);
    document.addEventListener("contextmenu", preventDefaultAndStop);

    if (blockScreenshot) {
      Object.defineProperties(window, {
        mozRequestFullScreen: { value: null },
        webkitRequestFullscreen: { value: null },
        requestFullscreen: { value: null },
      });

      try {
        document.exitFullscreen();
      } catch {}
    }

    disableSelection();

    const cheatCheckInterval = setInterval(() => {
      if (blockInspect) {
        if (window.outerWidth - window.innerWidth > 200) {
          createPreventionOverlay();
          onCheatDetected("DevToolsOpen");
        }
      }
    }, 1000);

    return () => {
      document.removeEventListener("keydown", preventDevTools);
      document.removeEventListener("keydown", preventCtrlShortcuts);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("keyup", preventScreenshot);
      document.removeEventListener("contextmenu", preventDefaultAndStop);

      clearInterval(cheatCheckInterval);

      document.body.style.userSelect = "auto";
      document.body.style.webkitUserSelect = "auto";
    };
  }, [
    enabled,
    blockScreenshot,
    blockInspect,
    blockCopy,
    blockCtrlShortcuts,
    onCheatDetected,
  ]);

  return { overlayVisible };
};

export default useCheatProtection;
