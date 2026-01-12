// export const ssr = false;
export const load = async ({ params }) => {
    const lang = params.lang === 'ja' ? 'ja' : 'en';

    try {
        const post = await import(`../../../lib/content/${lang}/compress-pdf.md`);
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
// export const ssr = false;
