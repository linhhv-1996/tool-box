import { SUPPORTED_LANGS } from '$lib/config/constant';
import type { Handle } from '@sveltejs/kit';

const DEFAULT_LANG = 'en';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Lấy segment đầu tiên của đường dẫn (ví dụ: /ja/blog/abc -> ja)
    const pathname = event.url.pathname;
    const firstSegment = pathname.split('/')[1];

    // 2. Kiểm tra xem segment đó có phải là ngôn ngữ mình hỗ trợ không
    const lang = SUPPORTED_LANGS.includes(firstSegment) ? firstSegment : DEFAULT_LANG;

    // 3. Thay thế %lang% trong app.html
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang)
    });

    // Giữ nguyên các header bảo mật của bạn
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    
    return response;
};
