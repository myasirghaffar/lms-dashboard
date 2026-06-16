const ALLOWED_PROFILE_IMAGE_HOSTS = new Set([
    "i.pravatar.cc",
    "ui-avatars.com",
    "tpeiuretlbrtadoyfrwk.supabase.co",
]);

export function getProfileImageSrc(imageUrl: string | null | undefined, name: string, fallbackLabel = "User") {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || fallbackLabel)}`;

    if (!imageUrl) return fallback;
    if (imageUrl.startsWith("/")) return imageUrl;

    try {
        const url = new URL(imageUrl);
        if (url.protocol !== "https:") return fallback;
        if (!ALLOWED_PROFILE_IMAGE_HOSTS.has(url.hostname)) return fallback;
        return imageUrl;
    } catch {
        return fallback;
    }
}
