<script lang="ts">
  import { X } from "lucide-svelte";
  import { isCartOpen, cart, totalPrice } from "$lib/services/cart.service";
  import CartItem from "./CartItem.svelte";
  import { quintOut } from "svelte/easing";
  import { fly, fade } from "svelte/transition";
  import { goto } from "$app/navigation";

  function closeCart() {
    isCartOpen.set(false);
  }

  function proceedToCheckout() {
    closeCart();
    goto("/checkout");
  }
</script>

<!-- The `#if $isCartOpen` block now reads directly from our signal's state -->
{#if $isCartOpen}
  <!-- Backdrop with a fade transition -->
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-30 bg-black/60"
    onclick={closeCart}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Escape" && closeCart()}
  ></div>

  <!-- The Modal Panel with a slide-in (fly) transition -->
  <div
    transition:fly={{ duration: 300, x: 400, easing: quintOut }}
    class="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-800"
    aria-modal="true"
    role="dialog"
  >
    <!-- Modal Header -->
    <header
      class="flex items-center justify-between border-b p-4 dark:border-gray-700"
    >
      <h2 class="text-xl font-bold">Your Cart</h2>
      <button
        onclick={closeCart}
        class="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Close cart"
      >
        <X size={24} />
      </button>
    </header>

    <!-- Cart Content -->
    <div class="flex-grow overflow-y-auto p-4">
      {#if $cart.length === 0}
        <div
          class="flex h-full flex-col items-center justify-center text-center"
        >
          <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
            Your cart is empty.
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            Add some products to get started!
          </p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each $cart as item (item.id)}
            <CartItem {item} />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Modal Footer (only shows if there are items) -->
    {#if $cart.length > 0}
      <footer class="border-t p-4 dark:border-gray-700">
        <div class="mb-4 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <!-- `$totalPrice` is our custom derived signal, always up-to-date -->
          <span>${$totalPrice.toFixed(2)}</span>
        </div>
        <a
          href="/checkout"
          class="block w-full rounded-md bg-green-600 py-3 text-center font-bold text-white transition-colors hover:bg-green-700"
          onclick={proceedToCheckout}
        >
          Proceed to Checkout
        </a>
      </footer>
    {/if}
  </div>
{/if}
