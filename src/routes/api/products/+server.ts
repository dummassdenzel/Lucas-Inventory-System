import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';

export async function GET() {
    try {
        const allProducts = await db.select().from(products);
        return json(allProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const productData = await request.json();
        const result = await db.insert(products).values(productData);
        return json(result, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return json({ error: 'Failed to create product' }, { status: 500 });
    }
}