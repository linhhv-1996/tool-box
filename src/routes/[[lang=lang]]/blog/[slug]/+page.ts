import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { lang = 'en', slug } = params;
    
    try {
        const post = await import(`../../../../lib/content/${lang}/blog/${slug}.md`);
        
        return {
            content: post.default,
            meta: post.metadata,
            lang,
            slug
        };
    } catch (e) {
        throw error(404, `Blog post not found in ${lang}`);
    }
};
