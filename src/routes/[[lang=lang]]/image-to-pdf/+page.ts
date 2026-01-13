import type { Language } from "$lib/translate/ui";

export const load = async ({ params }) => {
    // Dùng ?? '' để biến undefined thành chuỗi rỗng trước khi check .includes()
    const lang = (['ko', 'ja'].includes(params.lang ?? '') ? params.lang : 'en') as Language;

    try {
        const post = await import(`../../../lib/content/${lang}/image-to-pdf.md`);
        return {
            Content: post.default,
        };
    } catch (e) {
        console.error(`${lang}`, e);
        // Có thể throw error 404 ở đây nếu cần
        return {
            status: 404,
            error: ''
        };
    }
};
