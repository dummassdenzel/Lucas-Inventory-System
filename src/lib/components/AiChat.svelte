<script lang="ts">
    let isOpen = $state(false);
    let messages = $state<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    let inputMessage = $state('');
    let isLoading = $state(false);
    // svelte-ignore non_reactive_update
        let chatContainer: HTMLDivElement;

    // Add initial greeting
    messages = [
        {
            role: 'assistant',
            content: 'Hello! I can help you with information about your inventory. Try asking about:\n- Current inventory status\n- Low stock items\n- Product categories'
        }
    ];

    async function sendMessage() {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        messages = [...messages, { role: 'user', content: userMessage }];
        inputMessage = '';

        // Scroll to bottom
        setTimeout(() => {
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 0);

        try {
            isLoading = true;
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            messages = [...messages, { 
                role: 'assistant', 
                content: data.response
            }];

            // Scroll to bottom again after response
            setTimeout(() => {
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }, 0);
        } catch (error) {
            console.error('Failed to send message:', error);
            messages = [...messages, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.'
            }];
        } finally {
            isLoading = false;
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }
</script>

<!-- Chat Button -->
<button
    on:click={() => isOpen = !isOpen}
    class="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-50">
    <svg xmlns="http://www.w3.org/2000/svg" 
         class="h-6 w-6" 
         fill="none" 
         viewBox="0 0 24 24" 
         stroke="currentColor">
        {#if isOpen}
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12" />
        {:else}
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        {/if}
    </svg>
</button>

<!-- Chat Window -->
{#if isOpen}
    <div class="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col z-50">
        <!-- Header -->
        <div class="p-4 border-b bg-gray-50 rounded-t-lg">
            <h3 class="text-lg font-semibold text-gray-800">Inventory Assistant</h3>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={chatContainer}>
            {#each messages as message}
                <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
                    <div class="{message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'} 
                        rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>
            {/each}
            {#if isLoading}
                <div class="flex justify-start">
                    <div class="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                        <div class="flex space-x-2">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Input -->
        <div class="p-4 border-t">
            <div class="flex space-x-2">
                <textarea
                    bind:value={inputMessage}
                    on:keypress={handleKeyPress}
                    placeholder="Ask about your inventory..."
                    disabled={isLoading}
                    class="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows="2"
                ></textarea>
                <button
                    on:click={sendMessage}
                    disabled={isLoading}
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {#if isLoading}
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    {:else}
                        Send
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if} 