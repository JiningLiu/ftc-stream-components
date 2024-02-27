import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private'

export const load = (async () => {
    return {
        post: {
			title: env.FTC_API_USERNAME,
			content: env.FTC_API_KEY
		}
    };
}) satisfies PageServerLoad;