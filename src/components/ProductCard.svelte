<script lang="ts">
  import { itemStatus, addItemToCart } from "$lib/services/cart.service";
  import type { AddToCartStatus } from "$lib/services/cart.service";
  import type { Product } from "$lib/types";
  import { ShoppingCart, Check, Loader2 } from "lucide-svelte";

  const { product } = $props<{ product: Product }>();

  // --- THIS IS THE CORRECT REACTIVITY PATTERN ---
  let status: AddToCartStatus = $state("idle");

  $effect(() => {
    const unsubscribe = itemStatus.subscribe((statusMap) => {
      status = statusMap.get(product.id) || "idle";
    });

    // The effect's cleanup function will call unsubscribe when the component is destroyed.
    return unsubscribe;
  });
</script>

<div
  class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
>
  <a href={`/products/${product.id}`} class="block aspect-square bg-white p-4">
    <img
      src={product.image}
      alt={product.title}
      class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  </a>

  <div class="flex flex-grow flex-col p-4">
    <h3 class="mb-2 line-clamp-2 h-12 font-bold text-lg dark:text-white">
      {product.title}
    </h3>

    <div class="mt-auto flex items-center justify-between pt-4">
      <span class="text-xl font-semibold dark:text-gray-200"
        >${product.price.toFixed(2)}</span
      >

      <button
        onclick={() => addItemToCart(product)}
        disabled={status !== "idle"}
        class="inline-flex w-36 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        class:bg-blue-600={status === "idle"}
        class:hover:bg-blue-700={status === "idle"}
        class:focus:ring-blue-500={status === "idle"}
        class:bg-gray-500={status === "pending"}
        class:cursor-wait={status === "pending"}
        class:bg-green-600={status === "success"}
        class:cursor-default={status === "success"}
        aria-label={`Add ${product.title} to cart`}
      >
        {#if status === "idle"}
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        {:else if status === "pending"}
          <Loader2 size={16} class="animate-spin" />
          <span>Adding...</span>
        {:else if status === "success"}
          <Check size={16} />
          <span>Added!</span>
        {/if}
      </button>
    </div>
  </div>
</div>
