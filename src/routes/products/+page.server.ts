import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/types';

async function getProducts(url: URL, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
	try {
		// --- FAKE 2-SECOND DELAY ---
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const response = await fetch('https://fakestoreapi.com/products');
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch products');
		}
		const allProducts: Product[] = await response.json();

		const page = parseInt(url.searchParams.get('page') ?? '1');
		const searchTerm = url.searchParams.get('search') ?? '';
		const PRODUCTS_PER_PAGE = 10;

		const filteredProducts = allProducts.filter((p) =>
			p.title.toLowerCase().includes(searchTerm.toLowerCase())
		);

		const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
		const productsForPage = filteredProducts.slice(
			(page - 1) * PRODUCTS_PER_PAGE,
			page * PRODUCTS_PER_PAGE
		);

		return {
			products: productsForPage,
			currentPage: page,
			totalPages
		};
	} catch (e) {
		console.error(e);
		throw error(503, 'Could not load products.');
	}
}

export const load: PageServerLoad = ({ url, fetch }) => {
	// The `load` function itself is now synchronous.
	// It returns an object containing the search term and a PROMISE for the products.
	return {
		searchTerm: url.searchParams.get('search') ?? '',
		streamed: {
			products: getProducts(url, fetch)
		}
	};
};