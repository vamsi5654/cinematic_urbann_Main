import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

/**
 * WhatsApp Floating Button Component
 * 
 * Features:
 * - Fixed position at bottom-right corner
 * - Opens WhatsApp chat with pre-filled message
 * - Works on mobile (opens app) and desktop (opens WhatsApp Web)
 * - Responsive design
 * - Smooth animations
 */

export const WhatsAppButton: React.FC = () => {
  // WhatsApp configuration
  const WHATSAPP_NUMBER = '918977978321'; // Format: country code + number (no spaces, no +)
  const DEFAULT_MESSAGE = 'Hi, I\'m interested in your interior design services';
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
  
  // WhatsApp URL (works for both mobile app and web)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  const handleClick = () => {
    // Track analytics (optional)
    console.log('WhatsApp button clicked');
    
    // Open WhatsApp in new tab/app
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.whatsappContainer}>
      <button
        onClick={handleClick}
        className={styles.whatsappButton}
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className={styles.whatsappIcon} size={28} />
        
        {/* Optional: Tooltip that appears on hover */}
        <span className={styles.tooltip}>Chat with us</span>
      </button>
    </div>
  );
};
