import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
    try {
        const product = await db.select().from(products).where(eq(products.id, parseInt(params.id))).limit(1);
        if (product.length === 0) {
            return json({ error: 'Product not found' }, { status: 404 });
        }
        return json(product[0]);
    } catch (error) {
        return json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const productData = await request.json();
        const updatedProduct = await db
            .update(products)
            .set(productData)
            .where(eq(products.id, parseInt(params.id)));
        
        if (!updatedProduct) {
            return json({ error: 'Product not found' }, { status: 404 });
        }
        return json(updatedProduct);
    } catch (error) {
        return json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    try {
        await db.delete(products).where(eq(products.id, parseInt(params.id)));
        return new Response(null, { status: 204 });
    } catch (error) {
        return json({ error: 'Failed to delete product' }, { status: 500 });
    }
} 