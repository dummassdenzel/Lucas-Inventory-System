import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
    try {
        const category = await db.select().from(categories).where(eq(categories.id, parseInt(params.id))).limit(1);
        if (category.length === 0) {
            return json({ error: 'Category not found' }, { status: 404 });
        }
        return json(category[0]);
    } catch (error) {
        return json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const categoryData = await request.json();
        const updatedCategory = await db
            .update(categories)
            .set(categoryData)
            .where(eq(categories.id, parseInt(params.id)));
        
        if (!updatedCategory) {
            return json({ error: 'Category not found' }, { status: 404 });
        }
        return json(updatedCategory);
    } catch (error) {
        return json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    try {
        await db.delete(categories).where(eq(categories.id, parseInt(params.id)));
        return new Response(null, { status: 204 });
    } catch (error) {
        return json({ error: 'Failed to delete category' }, { status: 500 });
    }
} 