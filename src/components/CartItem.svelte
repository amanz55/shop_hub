<script lang="ts">
  import { cart } from "$lib/services/cart.service";
  import type { CartItem } from "$lib/services/cart.service";
  import { Plus, Minus, Trash2 } from "lucide-svelte";

  interface Props {
    item: CartItem;
  }

  const { item } = $props();

  // Helper functions to call methods on the imported `cart` signal.
  const increment = () => cart.updateQuantity(item.id, item.quantity + 1);
  const decrement = () => cart.updateQuantity(item.id, item.quantity - 1);
  const remove = () => cart.removeItem(item.id);
</script>

<div
  class="flex items-center gap-4 border-b border-gray-200 py-4 dark:border-gray-700"
>
  <img
    src={item.image}
    alt={item.title}
    class="h-16 w-16 rounded-md object-contain"
  />

  <div class="flex-grow">
    <h4 class="font-semibold leading-tight">{item.title}</h4>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      ${item.price.toFixed(2)}
    </p>
  </div>

  <div class="flex items-center gap-2">
    <!-- Decrement Button -->
    <button
      onclick={decrement}
      class="rounded-full p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label="Decrease quantity"
    >
      <Minus size={16} />
    </button>

    <span class="w-8 text-center font-medium">{item.quantity}</span>

    <!-- Increment Button -->
    <button
      onclick={increment}
      class="rounded-full p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label="Increase quantity"
    >
      <Plus size={16} />
    </button>
  </div>

  <!-- Remove Button -->
  <button
    onclick={remove}
    class="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
    aria-label="Remove item"
  >
    <Trash2 size={18} />
  </button>
</div>
