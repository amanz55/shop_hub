<script lang="ts">
  import { goto } from "$app/navigation";
  import ProductCard from "../../components/ProductCard.svelte";
  import Loader from "../../components/Loader.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import { Search, Frown } from "lucide-svelte";

  const props = $props();

  let localSearchTerm = $state(props.data.searchTerm || "");

  $effect(() => {
    if (localSearchTerm !== props.data.searchTerm) {
      const timer = setTimeout(() => {
        const url = new URL(location.origin);
        url.pathname = "/products";
        url.searchParams.set("search", localSearchTerm);
        url.searchParams.set("page", "1");
        goto(url.toString(), { keepFocus: true, noScroll: true });
      }, 300);
      return () => clearTimeout(timer);
    }
  });

  $effect(() => {
    localSearchTerm = props.data.searchTerm || "";
  });
</script>

<div class="p-4 sm:p-6">
  <h1
    class="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    Our Products
  </h1>

  <div class="relative mb-8">
    <input
      bind:value={localSearchTerm}
      type="text"
      placeholder="Search for products..."
      class="w-full rounded-md border-gray-300 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <Search class="h-5 w-5 text-gray-400" />
    </div>
  </div>

  <!-- USE THE #await BLOCK TO HANDLE STREAMED DATA -->
  {#await props.data.streamed.products}
    <!-- This content shows while the promise is pending -->
    <div class="flex h-64 items-center justify-center">
      <Loader />
    </div>
  {:then data}
    <!-- This content shows when the promise resolves -->
    {#if data.products.length === 0}
      <div
        class="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-100 p-8 text-center dark:bg-gray-800"
      >
        <Frown class="h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-semibold">No products found</h3>
        <p class="mt-1 text-gray-500">
          We couldn't find any products matching "{props.data.searchTerm}". Try
          a different search.
        </p>
      </div>
    {:else}
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {#each data.products as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>

      <div class="mt-12 flex justify-center">
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
        />
      </div>
    {/if}
  {:catch error}
    <!-- This content shows if the promise rejects -->
    <div
      class="flex h-64 flex-col items-center justify-center rounded-lg bg-red-100 p-8 text-center text-red-700"
    >
      <h3 class="text-xl font-semibold">Error loading products</h3>
      <p>{error.message}</p>
    </div>
  {/await}
</div>
