'use client';

import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import AskAIOverlay from './AskAIOverlay';

// Global state management for Ask AI panel
let globalSetIsOpen: ((open: boolean) => void) | null = null;
let isGlobalOpen = false;

export const openAskAI = () => {
  if (globalSetIsOpen) {
    globalSetIsOpen(true);
  }
};

export const closeAskAI = () => {
  if (globalSetIsOpen) {
    globalSetIsOpen(false);
  }
};

export const toggleAskAI = () => {
  if (globalSetIsOpen) {
    globalSetIsOpen(!isGlobalOpen);
  }
};

export default function AskAIPersistent() {
  const [isOpen, setIsOpenState] = useState(false);

  useEffect(() => {
    // Register global state handlers
    globalSetIsOpen = (open: boolean | ((prev: boolean) => boolean)) => {
      const newOpen = typeof open === 'function' ? open(isGlobalOpen) : open;
      isGlobalOpen = newOpen;
      setIsOpenState(newOpen);
    };

    // Sync initial state
    isGlobalOpen = isOpen;

    return () => {
      globalSetIsOpen = null;
    };
  }, [isOpen]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    isGlobalOpen = newOpen;
    setIsOpenState(newOpen);
  };

  const handleClose = () => {
    isGlobalOpen = false;
    setIsOpenState(false);
  };

  return (
    <>
      {/* Persistent Ask AI Button - Fixed Position */}
      <button
        onClick={handleToggle}
        className="fixed top-4 right-4 z-[99999] flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        aria-label="Open AI Assistant"
        style={{ zIndex: 99999 }}
      >
        <Brain className="w-4 h-4" />
        <span className="text-sm">Ask AI</span>
      </button>

      {/* Ask AI Overlay */}
      <AskAIOverlay open={isOpen} onClose={handleClose} />
    </>
  );
}