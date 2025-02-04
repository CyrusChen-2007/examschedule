<script lang="ts">
  import { onMount } from 'svelte';
  import { language, translations, type Language } from '$lib/stores/language';
  import SearchForm from '$lib/components/SearchForm.svelte';
  import '../lib/styles/theme.css';

  let names: string[] = [];
  let loadError: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/list?type=student');
      if (!res.ok) throw new Error('Failed to load student names');
      const text = await res.text();
      names = text.split('\n').filter(Boolean);
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Failed to load data';
    }
  });

  function handleLanguageSwitch() {
    language.update(l => (l === 'en' ? 'zh' : 'en') as Language);
  }

  $: t = translations[$language];
</script>

<svelte:head>
  <title>{t.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <div class="lang-switch">
    <button on:click={handleLanguageSwitch}>{t.language_switch}</button>
  </div>

  <div class="center">
    <div class="logo">
      <h1>
        <span class="brand">BRS</span>
        <span class="title-text">Exam Schedule</span>
      </h1>
    </div>
    
    <div class="search-container">
      <SearchForm
        {names}
        placeholder={t.search_placeholder}
      />
    </div>

    {#if loadError}
      <p class="error">{loadError}</p>
    {/if}
  </div>

  <div class="copyright">© 2022-Present uHenry</div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .lang-switch {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .lang-switch button {
    padding: 10px;
    font-size: 16px;
    line-height: 16px;
    color: black;
    background-color: #cdfeff;
    border: 2px solid #007779;
    box-shadow: 3px 2px 0 #007779;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    white-space: nowrap;
  }

  .lang-switch button:hover {
    outline: none;
    border: 2px solid #00a4aa;
    box-shadow: 4px 3px 0 #00a4aa;
  }

  .lang-switch button:active {
    border: 2px solid #00a4aa;
    box-shadow: 6px 4px 0 #00a4aa;
  }

  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    min-height: 500px;
  }

  .logo {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 4rem;
    font-weight: normal;
    margin: 0;
    text-align: center;
  }

  .brand {
    color: #E31E24;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .title-text {
    font-weight: bold;
  }

  .search-container {
    width: 100%;
    max-width: 584px;
    position: relative;
  }

  .error {
    color: var(--color-error);
    text-align: center;
    border: 2px solid var(--color-error);
    padding: 1rem;
    box-shadow: var(--shadow-box);
    margin: 1rem auto;
    max-width: 800px;
  }

  .copyright {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  @media (max-width: 800px) {
    h1 {
      font-size: 2.5rem;
    }

    .center {
      padding: 1rem;
    }
  }
</style> 