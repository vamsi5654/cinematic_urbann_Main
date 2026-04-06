import React from 'react';
import { Phone, Mail, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import styles from './Topbar.module.css';

export function Topbar() {
  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.contact}>
          <a href="tel:+1234567890" className={styles.contactItem}>
            <Phone size={14} />
            <span>+91 8977978321</span>
          </a>
          <a href="mailto:hello@theurbann.com" className={styles.contactItem}>
            <Mail size={14} />
            <span>hello@theurbann.com</span>
          </a>
        </div>
        
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/reel/DWEKWNhkvi9/?igsh=aDZjc3M4cXgwdDZk" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Instagram size={16} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Facebook size={16} />
          </a>
          {/*<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Linkedin size={16} />
          </a>*/}
          <a
            href="https://www.youtube.com/@UrbannInteriors"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <Youtube size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
