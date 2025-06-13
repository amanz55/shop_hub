<script lang="ts">
  import { ArrowRight } from "lucide-svelte";

  let activeUsers = $state(1);

  $effect(() => {
    const interval = setInterval(() => {
      // Calculate a random increase between 2 and 10.
      // Math.floor(Math.random() * 9) gives a number from 0-8. Add 2 to get 2-10.
      const increase = Math.floor(Math.random() * 9) + 2;

      activeUsers += increase;
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  });
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="space-y-6">
    <h1
      class="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
    >
      Welcome to <span class="text-blue-600 dark:text-blue-400">SHOP_HUB</span>
    </h1>
    <p class="mx-auto max-w-xl text-lg text-gray-600 dark:text-gray-300">
      Your one-stop shop for the best products online. Built with the power and
      speed of Svelte 5.
    </p>

    <!-- Live Counter -->
    <div
      class="flex items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900/50 dark:text-green-300"
    >
      <div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
      <p class="font-medium">
        <span class="font-bold">{activeUsers}</span> active users online
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <a
        href="/products"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Browse Products
        <ArrowRight size={20} />
      </a>
      <a
        href="/checkout"
        class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
      >
        Go to Checkout
      </a>
    </div>
  </div>
</div>
