import type {PageLoad} from './$types';

export const prerender = false;

export const load: PageLoad = async ({fetch}) => {
    return {
        session: null,
    };
};

