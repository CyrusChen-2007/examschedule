<script lang="ts">
  import { goto } from '$app/navigation';
  import { language, translations } from '$lib/stores/language';

  export let names: string[] = [];
  export let placeholder = '';
  
  let searchTerm = '';
  let suggestions: string[] = [];
  let selectedIndex = -1;
  let showSuggestions = false;

  $: t = translations[$language];
  $: filteredNames = searchTerm
    ? names.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10)
    : [];

  $: suggestions = showSuggestions ? filteredNames : [];

  function handleInput() {
    selectedIndex = -1;
    showSuggestions = true;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex >= 0) {
        searchTerm = suggestions[selectedIndex];
      }
      if (searchTerm) {
        handleSearch();
      }
    } else if (event.key === 'Escape') {
      showSuggestions = false;
    }
  }

  function handleSearch() {
    if (searchTerm) {
      showSuggestions = false;
      // HACK: WHY GOTO DOESNT WORK?????????????
      setTimeout(() => {
        window.location.reload();
      }, 500);
      goto(`/search/${encodeURIComponent(searchTerm)}`);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    searchTerm = suggestion;
    handleSearch();
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      showSuggestions = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="search-container">
  <div class="search-box">
    <input
      type="text"
      bind:value={searchTerm}
      {placeholder}
      on:input={handleInput}
      on:keydown={handleKeydown}
    />
    <button class="search-button" on:click={handleSearch}>
      {t.search_button}
    </button>
  </div>

  {#if suggestions.length > 0 && showSuggestions}
    <ul class="suggestions">
      {#each suggestions as suggestion, i}
        <li
          class:selected={i === selectedIndex}
          on:click={() => handleSuggestionClick(suggestion)}
          on:mouseenter={() => selectedIndex = i}
        >
          {suggestion}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search-container {
    position: relative;
    width: 100%;
  }

  .search-box {
    display: flex;
    width: 100%;
  }

  input {
    flex: 1;
    height: 52px;
    border: 2px solid var(--color-border);
    box-shadow: var(--shadow-box);
    font-family: var(--font-sans);
    font-size: 1rem;
    padding: 0 1rem;
    border-right: none;
    border-radius: 0;
    box-sizing: content-box;
    margin: 0;
  }

  input:hover, input:focus {
    outline: none;
  }

  .search-button {
    height: 52px;
    padding: 0 2rem;
    font-size: 20px;
    line-height: 16px;
    color: #005c5e;
    background-color: #cdfeff;
    border: 2px solid #007779;
    box-shadow: var(--shadow-box);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    margin-left: -2px;
    border-radius: 0;
    position: relative;
    z-index: 1;
    font-weight: bold;
    box-sizing: content-box;
  }

  .search-button:hover {
    outline: none;
    transform: translate(-1px, -1px);
    box-shadow: 7px 7px 0 #007779;
  }

  .search-button:active {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #007779;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    background: var(--color-background);
    border: 2px solid var(--color-border);
    box-shadow: var(--shadow-box);
    list-style: none;
    z-index: 10;
    border-radius: 0;
  }

  .suggestions li {
    padding: 8px 16px;
    cursor: pointer;
    color: var(--color-text);
  }

  .suggestions li:hover,
  .suggestions li.selected {
    background: var(--color-hover);
  }
</style> 