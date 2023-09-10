/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_CHAT_URL: string;
    // more env variables coming up...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}