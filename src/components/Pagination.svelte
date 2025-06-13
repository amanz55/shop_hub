<script lang="ts">
  import { page } from "$app/stores";
  import {
    ChevronsLeft,
    ChevronsRight,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";

  interface Props {
    currentPage: number;
    totalPages: number;
  }
  const { currentPage, totalPages } = $props();

  function getPageUrl(pageNumber: number): string {
    const url = new URL($page.url);
    url.searchParams.set("page", String(pageNumber));
    return url.toString();
  }
</script>

{#if totalPages > 1}
  <nav
    aria-label="Pagination"
    class="flex items-center justify-between text-sm"
  >
    <!-- Previous Button -->
    <a
      href={getPageUrl(currentPage - 1)}
      class="flex items-center gap-2 rounded-md border bg-white px-3 py-2 font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Go to previous page"
      class:disabled={currentPage <= 1}
      onclick={(e) => {
        if (currentPage <= 1) e.preventDefault();
      }}
    >
      <ChevronLeft size={16} />
      <span>Previous</span>
    </a>

    <!-- Page Info -->
    <span class="font-medium text-gray-700 dark:text-gray-300 mx-4">
      Page {currentPage} of {totalPages}
    </span>

    <!-- Next Button -->
    <a
      href={getPageUrl(currentPage + 1)}
      class="flex items-center gap-2 rounded-md border bg-white px-3 py-2 font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Go to next page"
      class:disabled={currentPage >= totalPages}
      onclick={(e) => {
        if (currentPage >= totalPages) e.preventDefault();
      }}
    >
      <span>Next</span>
      <ChevronRight size={16} />
    </a>
  </nav>
{/if}
