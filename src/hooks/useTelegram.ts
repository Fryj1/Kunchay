import type { WebApp } from "@twa-dev/types";

const tg = (window as any).Telegram?.WebApp as WebApp;

export function useTelegram() {
    
    const onClose = () => {
        tg.close();
    };
    
    return {
        onClose,
        tg,
        user: tg.initDataUnsafe?.user,
    };
}
