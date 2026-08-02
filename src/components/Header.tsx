'use client';

import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onLogout: () => void;
}

export default function Header({ title, onBack, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.side}>
        {onBack && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onBack}
            aria-label="Voltar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>

      <div className={`${styles.side} ${styles.sideRight}`}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onLogout}
          aria-label="Sair"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
