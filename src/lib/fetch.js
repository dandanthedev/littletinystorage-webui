import { findInstance } from "$lib/findInstance.js";

let apiKey = localStorage.getItem('apiKey');
let instance;
export async function customFetch(url, options = {}, customAPIKey, returnRaw = false) {
    if (!instance) instance = await findInstance();
    const res = await fetch(`${instance}${url}`, {
        ...options,
        headers: {
            ...options?.headers || {},
            'Authorization': `Bearer ${customAPIKey ?? apiKey}`,
        }
    });

    if (returnRaw) return res;

    if (res.status != 200) {
        alert(await res.text());
        return null;

    }

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }

}

export function setAPIKey(key) {
    apiKey = key;
}