<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import AiChat from '$lib/components/AiChat.svelte';
	
	let { children } = $props();
	let isSidebarOpen = $state(true);
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="{isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out">
		<div class="p-6">
			<h1 class="text-2xl font-bold text-gray-800">Inventory System</h1>
		</div>
		<nav class="mt-6">
			<a href="/" 
			   class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
			   class:bg-gray-100={$page.url.pathname === '/'}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
				Dashboard
			</a>
			<a href="/products" 
			   class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
			   class:bg-gray-100={$page.url.pathname.startsWith('/products')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
				</svg>
				Products
			</a>
			<a href="/categories" 
			   class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
			   class:bg-gray-100={$page.url.pathname.startsWith('/categories')}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
				</svg>
				Categories
			</a>
		</nav>
	</aside>

	<!-- Main Content -->
	<div class="{isSidebarOpen ? 'pl-64' : 'pl-0'} min-h-screen transition-all duration-200">
		<!-- Top Navigation -->
		<header class="bg-white shadow-sm">
			<div class="flex justify-between items-center px-6 py-4">
				<button 
					on:click={() => isSidebarOpen = !isSidebarOpen}
					class="text-gray-500 hover:text-gray-600">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<div class="flex items-center">
					<span class="text-gray-700">Welcome to Inventory System</span>
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<main class="p-6">
			{@render children()}
		</main>
	</div>

	<!-- AI Chat Component -->
	<AiChat />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
