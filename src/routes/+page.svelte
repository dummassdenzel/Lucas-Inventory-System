<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    let totalProducts = $state(0);
    let lowStockProducts = $state(0);
    let totalCategories = $state(0);
    let recentProducts:any = $state([]);

    onMount(async () => {
        try {
            const [products, categories] = await Promise.all([
                fetch('/api/products').then(r => r.json()),
                fetch('/api/categories').then(r => r.json())
            ]);

            totalProducts = products.length;
            lowStockProducts = products.filter((p:any) => p.quantity <= p.minQuantity).length;
            totalCategories = categories.length;
            recentProducts = products.slice(-5).reverse();
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    });
</script>

<div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div class="ml-4">
                    <h2 class="text-sm font-medium text-gray-600">Total Products</h2>
                    <p class="text-lg font-semibold text-gray-800">{totalProducts}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div class="ml-4">
                    <h2 class="text-sm font-medium text-gray-600">Low Stock Products</h2>
                    <p class="text-lg font-semibold text-gray-800">{lowStockProducts}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <div class="ml-4">
                    <h2 class="text-sm font-medium text-gray-600">Categories</h2>
                    <p class="text-lg font-semibold text-gray-800">{totalCategories}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Products -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-medium text-gray-800">Recent Products</h2>
        </div>
        <div class="divide-y">
            {#each recentProducts as product}
                <div class="px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-sm font-medium text-gray-800">{product.name}</h3>
                            <p class="text-sm text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-800">Quantity: {product.quantity}</p>
                            {#if product.quantity <= product.minQuantity}
                                <p class="text-sm text-red-600">Low Stock</p>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="px-6 py-4 text-center text-gray-500">
                    No products available
                </div>
            {/each}
        </div>
    </div>
</div>
