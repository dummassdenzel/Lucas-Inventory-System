import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const allProducts = await db.select().from(products);
        return json(allProducts);
    } catch (error) {
        return json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const productData = await request.json();
        const newProduct = await db.insert(products).values(productData);
        return json(newProduct, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create product' }, { status: 500 });
    }
}