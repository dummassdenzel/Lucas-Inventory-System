import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';

async function fetchOllama(messages: any[]) {
    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral',
                messages: messages,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Ollama');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Ollama API error:', error);
        throw error;
    }
}

async function getInventoryStatus() {
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);

    const lowStockProducts = allProducts.filter(p => p.quantity <= p.minQuantity);
    
    return {
        totalProducts: allProducts.length,
        totalCategories: allCategories.length,
        lowStockCount: lowStockProducts.length,
        lowStockItems: lowStockProducts.map(p => ({
            name: p.name,
            quantity: p.quantity,
            minQuantity: p.minQuantity
        })),
        categories: allCategories.map(c => c.name)
    };
}

export async function POST({ request }) {
    try {
        const { message } = await request.json();

        // Get current inventory status
        const inventoryStatus = await getInventoryStatus();

        // Prepare the system message with inventory context
        const systemMessage = {
            role: 'system',
            content: `You are an AI assistant for an inventory management system. Here's the current inventory status:
            - Total Products: ${inventoryStatus.totalProducts}
            - Total Categories: ${inventoryStatus.totalCategories}
            - Low Stock Items: ${inventoryStatus.lowStockCount}
            
            Low stock products:
            ${inventoryStatus.lowStockItems.map(item => 
                `- ${item.name}: ${item.quantity}/${item.minQuantity} (current/minimum)`
            ).join('\n')}
            
            Categories: ${inventoryStatus.categories.join(', ')}
            
            Provide concise and helpful responses about the inventory status.`
        };

        // Prepare the user's message
        const userMessage = {
            role: 'user',
            content: message
        };

        // Get response from Ollama
        const aiResponse = await fetchOllama([systemMessage, userMessage]);

        return json({ response: aiResponse.content });
    } catch (error) {
        console.error('Chat API error:', error);
        return json({ error: 'Failed to process request' }, { status: 500 });
    }
} 