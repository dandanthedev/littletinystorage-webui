import { goto } from "$app/navigation";

let foundInstance = null;

async function ping(url) {
    const res = await fetch(url + "/api/ping").catch(() => null);
    if (!res.ok) return false;
    const text = await res.text();
    return text == "littletinystorage";
}

export async function findInstance() {
    if (foundInstance) return foundInstance;

    const storedURL = localStorage.getItem("instanceURL");
    if (storedURL) {
        const storedURLWorks = await ping(storedURL);
        if (storedURLWorks) {
            foundInstance = storedURL;
            return foundInstance;
        }
    }

    const toPing = ["", "http://localhost:7999"];
    for (const url of toPing) {
        const urlWorks = await ping(url).catch(() => false);
        if (urlWorks) {
            foundInstance = url;
            return foundInstance;
        }
    }



    goto("/setupURL")



}