import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';

export async function GET() {
    try {
        const allCategories = await db.select().from(categories);
        return json(allCategories);
    } catch (error) {
        return json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const categoryData = await request.json();
        const newCategory = await db.insert(categories).values(categoryData);
        return json(newCategory, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create category' }, { status: 500 });
    }
} 