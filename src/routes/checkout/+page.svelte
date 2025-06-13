<script lang="ts">
  import {
    cart,
    totalPrice,
    checkoutRateLimitEnd,
  } from "$lib/services/cart.service";
  import CartItem from "../../components/CartItem.svelte";
  import { CheckCircle, ShoppingBag, Loader2 } from "lucide-svelte";
  import { fade } from "svelte/transition";

  // --- Local State ---
  let isProcessing = $state(false);
  let showSuccess = $state(false);
  let countdown = $state(0);
  $effect(() => {
    let timer: any;

    const unsubscribe = checkoutRateLimitEnd.subscribe((endTime) => {
      // Clear any previous timer
      clearInterval(timer);

      const updateCountdown = () => {
        const now = Date.now();
        if (endTime > now) {
          countdown = Math.ceil((endTime - now) / 1000);
        } else {
          countdown = 0;
          clearInterval(timer); // Stop the timer when it reaches zero
        }
      };

      updateCountdown(); // Run once immediately
      if (endTime > Date.now()) {
        timer = setInterval(updateCountdown, 1000); // Start ticking every second
      }
    });

    // Cleanup function: stop the timer and unsubscribe when the component is destroyed.
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  });

  // --- Derived state for the button UI ---
  const isButtonDisabled = $derived(() => isProcessing || countdown > 0);
  const buttonText = $derived(() => {
    if (isProcessing) return "Processing...";
    if (countdown > 0) return `Please wait ${countdown}s`;
    return "Complete Purchase";
  });

  // --- The Checkout Action ---
  async function handleCheckout() {
    isProcessing = true;
    await new Promise((res) => setTimeout(res, 1000));

    cart.clearCart();
    // Set the GLOBAL rate-limit signal for 10 seconds in the future.
    checkoutRateLimitEnd.set(Date.now() + 10000);

    isProcessing = false;
    showSuccess = true;

    setTimeout(() => (showSuccess = false), 5000);
  }
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6">
  {#if showSuccess}
    <div
      transition:fade
      class="mb-8 flex flex-col items-center justify-center rounded-lg bg-green-100 p-8 text-center text-green-800 dark:bg-green-900/50 dark:text-green-300"
    >
      <CheckCircle class="h-16 w-16" />
      <h2 class="mt-4 text-2xl font-bold">Checkout Successful!</h2>
      <p class="mt-2">
        Thank you for your purchase. A confirmation has been sent to your email.
      </p>
      <a
        href="/products"
        class="mt-6 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Continue Shopping
      </a>
    </div>
  {:else}
    <h1
      class="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
      Checkout
    </h1>

    {#if $cart.length === 0}
      <div
        class="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-8 text-center dark:bg-gray-800"
      >
        <ShoppingBag class="h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-semibold">Your cart is empty</h3>
        <p class="mt-1 text-gray-500">
          There's nothing to check out. Let's find something for you!
        </p>
        <a
          href="/products"
          class="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Browse Products
        </a>
      </div>
    {:else}
      <div
        class="rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          {#each $cart as item (item.id)}
            <div class="p-4">
              <CartItem {item} />
            </div>
          {/each}
        </div>
      </div>

      <div
        class="mt-8 flex flex-col items-end gap-4 rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-2xl font-bold">
          <span>Total: </span>
          <span class="text-blue-600 dark:text-blue-400"
            >${$totalPrice.toFixed(2)}</span
          >
        </div>
        <button
          onclick={handleCheckout}
          disabled={isButtonDisabled()}
          class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 sm:w-auto"
        >
          {#if isProcessing}
            <Loader2 class="h-6 w-6 animate-spin" />
          {/if}
          <span>{buttonText()}</span>
        </button>
      </div>
    {/if}
  {/if}
</div>
