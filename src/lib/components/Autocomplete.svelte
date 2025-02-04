<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let items: string[] = [];
  export let value: string = '';
  export let placeholder: string = '';
  export let id: string = '';

  let showSuggestions = false;
  let filteredItems: string[] = [];
  let selectedIndex = -1;
  
  const dispatch = createEventDispatcher();

  $: {
    if (value) {
      filteredItems = items.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
    } else {
      filteredItems = [];
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    showSuggestions = true;
    selectedIndex = -1;
    dispatch('input', value);
  }

  function selectItem(item: string) {
    value = item;
    showSuggestions = false;
    dispatch('select', item);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && filteredItems[selectedIndex]) {
          selectItem(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        showSuggestions = false;
        break;
    }
  }

  function handleBlur() {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }
</script>

<div class="autocomplete">
  <input
    {id}
    type="text"
    {placeholder}
    bind:value
    on:input={handleInput}
    on:keydown={handleKeydown}
    on:blur={handleBlur}
    autocomplete="off"
  />
  
  {#if showSuggestions && filteredItems.length > 0}
    <ul class="suggestions" transition:fade={{ duration: 100 }}>
      {#each filteredItems as item, i}
        <li
          class:selected={i === selectedIndex}
          on:mousedown={() => selectItem(item)}
          on:mouseover={() => selectedIndex = i}
        >
          {item}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .autocomplete {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    line-height: 14px;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    transition: all 0.2s ease-in-out;
  }

  input:hover {
    outline: none;
    border: 2px solid #00a4aa;
    box-shadow: 4px 3px 0 #00a4aa;
  }

  input:focus {
    outline: none;
    border: 2px solid #00a4aa;
    box-shadow: 4px 3px 0 #00a4aa;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  .suggestions li {
    padding: 8px 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .suggestions li:hover,
  .suggestions li.selected {
    background-color: #cdfeff;
  }
</style> 