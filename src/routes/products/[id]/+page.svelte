<script lang="ts">
  import { itemStatus, addItemToCart } from "$lib/services/cart.service";
  import type { AddToCartStatus } from "$lib/services/cart.service";
  import { ShoppingCart, Check, Loader2, ArrowLeft } from "lucide-svelte";
  import { fly } from "svelte/transition";

  const { data } = $props();
  const { product } = data;

  let status: AddToCartStatus = $state("idle");
  $effect(() => {
    const unsubscribe = itemStatus.subscribe((statusMap) => {
      status = statusMap.get(product.id) || "idle";
    });
    return unsubscribe;
  });
</script>

<div class="container mx-auto max-w-5xl p-4">
  <!-- Back Navigation Link -->
  <a
    href="/products"
    class="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
  >
    <ArrowLeft size={18} />
    Back to all products
  </a>

  <!-- Main Product Grid -->
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
    <!-- Left Column: Image -->
    <div
      class="flex items-center justify-center rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800"
      transition:fly={{ y: 20, duration: 500 }}
    >
      <img
        src={product.image}
        alt={product.title}
        class="max-h-[400px] object-contain"
      />
    </div>

    <!-- Right Column: Details -->
    <div
      class="flex flex-col"
      transition:fly={{ y: 20, duration: 500, delay: 100 }}
    >
      <span
        class="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400"
      >
        {product.category}
      </span>
      <h1
        class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl"
      >
        {product.title}
      </h1>

      <!-- Price -->
      <p class="my-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
        ${product.price.toFixed(2)}
      </p>

      <!-- Description -->
      <p
        class="mb-6 flex-grow text-base leading-relaxed text-gray-600 dark:text-gray-300"
      >
        {product.description}
      </p>

      <!-- Add to Cart Button -->
      <div class="mt-auto">
        <button
          onclick={() => addItemToCart(product)}
          disabled={status !== "idle"}
          class="inline-flex w-full items-center justify-center gap-3 rounded-md px-8 py-4 text-lg font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
          class:bg-blue-600={status === "idle"}
          class:hover:bg-blue-700={status === "idle"}
          class:focus:ring-blue-500={status === "idle"}
          class:bg-gray-500={status === "pending"}
          class:cursor-wait={status === "pending"}
          class:bg-green-600={status === "success"}
          class:cursor-default={status === "success"}
        >
          {#if status === "idle"}
            <ShoppingCart size={22} />
            <span>Add to Cart</span>
          {:else if status === "pending"}
            <Loader2 size={22} class="animate-spin" />
            <span>Adding...</span>
          {:else if status === "success"}
            <Check size={22} />
            <span>Added!</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
