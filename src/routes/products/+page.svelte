<script lang="ts">
    import { onMount } from 'svelte';

    let products:any = $state([]);
    let categories:any = $state([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Form state
    let showForm = $state(false);
    let editingProduct = $state<any>(null);
    let formData = $state({
        name: '',
        description: '',
        sku: '',
        quantity: 0,
        minQuantity: 0,
        categoryId: 0
    });

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            loading = true;
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/products').then(r => r.json()),
                fetch('/api/categories').then(r => r.json())
            ]);
            products = productsRes;
            categories = categoriesRes;
        } catch (err) {
            error = 'Failed to load data';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function openForm(product: any = null) {
        if (product) {
            editingProduct = product;
            formData = { ...product };
        } else {
            editingProduct = null;
            formData = {
                name: '',
                description: '',
                sku: '',
                quantity: 0,
                minQuantity: 0,
                categoryId: 0
            };
        }
        showForm = true;
    }

    async function handleSubmit() {
        try {
            const url = editingProduct 
                ? `/api/products/${editingProduct.id}`
                : '/api/products';
            

            const response = await fetch(url, {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save product');
            
            await loadData();
            showForm = false;
        } catch (err) {
            error = 'Failed to save product';
            console.error(err);
        }
    }

    async function deleteProduct(id: number) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');
            
            await loadData();
        } catch (err) {
            error = 'Failed to delete product';
            console.error(err);
        }
    }

    function getCategoryName(categoryId: number | null) {
        if (!categoryId) return 'Uncategorized';
        const category = categories.find((c:any) => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    }
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Products</h1>
        <button
            on:click={() => openForm()}
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Product
        </button>
    </div>

    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="text-center py-4">Loading...</div>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each products as product}
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{product.name}</div>
                                <div class="text-sm text-gray-500">{product.description}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{getCategoryName(product.categoryId)}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.sku}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.quantity}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    {product.quantity <= product.minQuantity 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'}">
                                    {product.quantity <= product.minQuantity ? 'Low Stock' : 'In Stock'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    on:click={() => openForm(product)}
                                    class="text-blue-600 hover:text-blue-900 mr-4">
                                    Edit
                                </button>
                                <button
                                    on:click={() => deleteProduct(product.id)}
                                    class="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No products available
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<!-- Product Form Modal -->
{#if showForm}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center pb-4 mb-4 border-b">
                <h3 class="text-xl font-semibold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </h3>
                <button 
                    on:click={() => showForm = false}
                    class="text-gray-400 hover:text-gray-500">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={formData.name}
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        bind:value={formData.categoryId}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="">Select a category</option>
                        {#each categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
                    <input
                        type="text"
                        id="sku"
                        bind:value={formData.sku}
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        bind:value={formData.description}
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            bind:value={formData.quantity}
                            min="0"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label for="minQuantity" class="block text-sm font-medium text-gray-700">Min Quantity</label>
                        <input
                            type="number"
                            id="minQuantity"
                            bind:value={formData.minQuantity}
                            min="0"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div class="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        on:click={() => showForm = false}
                        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {editingProduct ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}