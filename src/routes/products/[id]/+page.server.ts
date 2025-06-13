
import { error, type HttpError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/types';


export const load: PageServerLoad<{ product: Product }> = async ({ params, fetch }) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${params.id}`);

        if (!response.ok) {
            throw error(response.status, 'Product not found');
        }

        const product: Product | null = await response.json();

        if (!product) {
            throw error(404, 'Product not found');
        }

        return {
            product
        };
    } catch (e) {
        console.error('Failed to load single product:', e);

        // If the error is an HttpError thrown by SvelteKit, re-throw it.
        const httpError = e as HttpError;
        if (httpError.status) {
            throw error(httpError.status, httpError.body.message);
        }

        // Otherwise, throw a generic internal server error.
        throw error(500, 'An internal error occurred while trying to load the product.');
    }
};