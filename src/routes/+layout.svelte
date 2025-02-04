<script lang="ts">
  import '@fontsource/inter';
</script>

<slot />

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }
</style> 