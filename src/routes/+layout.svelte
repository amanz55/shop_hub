<!-- <script>
  let { children } = $props();
  import "../app.css";
</script>

{@render children()} -->

<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import CartModal from "../components/CartModal.svelte";
  import "../app.css";
</script>

<div
  class="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200"
>
  <Navbar />

  <main class="container mx-auto p-4 md:p-8">
    <slot />
  </main>

  <CartModal />
</div>
