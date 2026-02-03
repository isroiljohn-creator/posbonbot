import { useEffect, useState } from 'react';

export function DebugPanel() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id;

        const debugInfo = [
            `🔍 Debug Info:`,
            `Telegram WebApp: ${tg ? '✅ Found' : '❌ Not Found'}`,
            `User ID: ${userId || '❌ Not Found'}`,
            `Init Data: ${tg?.initData ? '✅ Present' : '❌ Missing'}`,
            `Platform: ${tg?.platform || 'Unknown'}`,
        ];

        setLogs(debugInfo);

        // Test API
        if (userId) {
            fetch(`/api/groups?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setLogs(prev => [...prev, `✅ API Response: ${JSON.stringify(data).slice(0, 100)}`]);
                })
                .catch(err => {
                    setLogs(prev => [...prev, `❌ API Error: ${err.message}`]);
                });
        }
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-4 text-xs font-mono max-h-48 overflow-y-auto z-50">
            {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
            ))}
        </div>
    );
}
