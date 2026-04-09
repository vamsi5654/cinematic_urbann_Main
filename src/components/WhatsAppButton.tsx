import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      label: 'Design Consultation',
      number: '918977978321',
      message: "Hi, I'm interested in your interior design services",
    },
    {
      label: 'Project Quotation',
      number: '917022987826',
      message: "Hi, I'd like to request a quotation for my project. Could you please share the details and pricing?",
    },
  ];

  const handleClick = (number: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className={styles.whatsappContainer}>
      {/* Options Menu */}
      {isOpen && (
        <div className={styles.optionsMenu}>
          <div className={styles.menuHeader}>
            <span>Chat with us</span>
          </div>
          {options.map((option) => (
            <button
              key={option.label}
              className={styles.optionButton}
              onClick={() => handleClick(option.number, option.message)}
            >
              <MessageCircle size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.whatsappButton}
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {isOpen
          ? <X className={styles.whatsappIcon} size={28} />
          : <MessageCircle className={styles.whatsappIcon} size={28} />
        }
      </button>
    </div>
  );
};