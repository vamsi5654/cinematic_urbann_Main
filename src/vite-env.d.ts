/// <reference types="vite/client" />

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';
declare module '*.module.less';

// These types are helpful for static imports from Vite
declare const __DEV__: boolean;
declare const __VERSION__: string;

declare module 'motion/react';
