import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, parseInt(params.id)))
            .limit(1);

        if (!product || product.length === 0) {
            return json({ error: 'Product not found' }, { status: 404 });
        }

        return json(product[0]);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return json({ error: 'Failed to fetch product' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const productData = await request.json();
        
        // Remove fields that shouldn't be updated
        const { id, createdAt, updatedAt, ...updateData } = productData;

        // Ensure numeric fields are numbers
        if (updateData.quantity !== undefined) {
            updateData.quantity = parseInt(updateData.quantity.toString());
        }
        if (updateData.minQuantity !== undefined) {
            updateData.minQuantity = parseInt(updateData.minQuantity.toString());
        }

        // First update the product
        await db
            .update(products)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(products.id, parseInt(params.id)));

        // Then fetch the updated product
        const updatedProduct = await db
            .select()
            .from(products)
            .where(eq(products.id, parseInt(params.id)))
            .limit(1);

        if (!updatedProduct || updatedProduct.length === 0) {
            return json({ error: 'Product not found' }, { status: 404 });
        }

        return json(updatedProduct[0]);
    } catch (error) {
        console.error('Failed to update product:', error);
        return json({ error: 'Failed to update product' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        await db
            .delete(products)
            .where(eq(products.id, parseInt(params.id)));

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return json({ error: 'Failed to delete product' }, { status: 500 });
    }
}; 