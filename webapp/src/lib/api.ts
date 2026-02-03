// Use relative path for production (served by FastAPI) or localhost:8000 for dev
export const API_URL = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';

export async function fetchGroups(userId: number) {
    const res = await fetch(`${API_URL}/groups?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
}

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
