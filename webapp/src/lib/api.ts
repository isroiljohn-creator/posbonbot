export const API_URL = 'http://localhost:8000/api';

export async function fetchGroupSettings(groupId: string) {
    const res = await fetch(`${API_URL}/groups/${groupId}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
}

export async function updateGroupSettings(groupId: string, settings: any) {
    const res = await fetch(`${API_URL}/groups/${groupId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
}
