import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const lang = event.params.lang === 'ja' || event.url.pathname.startsWith('/ja') ? 'ja' : 'en';

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang)
    });

    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    
    return response;
};
