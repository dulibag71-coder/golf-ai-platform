const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
    async get(endpoint: string, token?: string) {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, { headers });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `HTTP error! status: ${res.status}`);
        }
        return res.json();
    },

    async post(endpoint: string, body: any, token?: string, isFormData = false) {
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (!isFormData) headers['Content-Type'] = 'application/json';

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `HTTP error! status: ${res.status}`);
        }
        return res.json();
    },

    async put(endpoint: string, body: any, token?: string) {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `HTTP error! status: ${res.status}`);
        }
        return res.json();
    }
};
