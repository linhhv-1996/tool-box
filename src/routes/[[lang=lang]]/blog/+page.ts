// src/routes/[[lang=lang]]/blog/+page.ts
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { lang = 'en' } = params;
    
    // Lấy tất cả file markdown trong folder blog theo ngôn ngữ
    const posts = import.meta.glob('$lib/content/**/*.md');
    const iterablePosts = Object.entries(posts);
    
    const allPosts = await Promise.all(
        iterablePosts
            .filter(([path]) => path.includes(`/content/${lang}/blog/`))
            .map(async ([path, resolver]) => {
                const { metadata }: any = await resolver();
                const slug = path.split('/').pop()?.replace('.md', '');
                return {
                    meta: metadata,
                    slug
                };
            })
    );

    // Sắp xếp bài mới nhất lên đầu
    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });

    return {
        posts: sortedPosts,
        lang
    };
};
