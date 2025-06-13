<script lang="ts">
  import { ShoppingCart } from "lucide-svelte";
  import { isCartOpen, totalItems } from "$lib/services/cart.service";
</script>

<nav
  class="sticky top-0 z-20 bg-white/80 shadow-md backdrop-blur-md dark:bg-gray-800/80"
>
  <div class="container mx-auto flex items-center justify-between p-4">
    <a
      href="/"
      class="text-2xl font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      SHOP_HUB
    </a>

    <div class="flex items-center space-x-4 sm:space-x-6">
      <a
        href="/products"
        class="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 sm:block"
      >
        Products
      </a>
      <a
        href="/checkout"
        class="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 sm:block"
      >
        Checkout
      </a>

      <!-- This button now calls the .update method on our isCartOpen signal -->
      <button
        onclick={() => isCartOpen.update((open) => !open)}
        class="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Open cart"
      >
        <ShoppingCart size={24} />

        <!-- We use the $ prefix to auto-subscribe to the totalItems signal -->
        {#if $totalItems > 0}
          <span
            class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          >
            {$totalItems}
          </span>
        {/if}
      </button>
    </div>
  </div>
</nav>
