<script>
  export let label = "";
  export let onClick = () => {};
</script>

<button
  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
  on:click={onClick}
>
  {label}
</button>
