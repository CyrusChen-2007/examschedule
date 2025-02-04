<script lang="ts">
  import { onMount } from 'svelte';
  import SearchForm from '$lib/components/SearchForm.svelte';
  import TestSession from '$lib/components/TestSession.svelte';
  import type { TestSession as TestSessionType } from '$lib/types';
  import Feedback from '$lib/components/Feedback.svelte';
  import GitHubButton from '$lib/components/GitHubButton.svelte';

  let names: string[] = [];
  let sessions: TestSessionType[] = [];
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/list?type=proctor');
      if (!res.ok) throw new Error('Failed to load proctor names');
      const text = await res.text();
      names = text.split('\n').filter(Boolean);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load data';
    }
  });

  async function handleSearch(name: string) {
    try {
      error = null;
      const res = await fetch(`/api/data?type=proctor&name=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error('Failed to load sessions');
      const data = await res.json();
      sessions = data[name] || [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load data';
      sessions = [];
    }
  }
</script>

<svelte:head>
  <title>Test Schedule (Proctor Edition)</title>
</svelte:head>

<main>
  <GitHubButton />
  <h1>监考时间查询 Proctor Schedule</h1>
  <small>已经更新2024-2025学年第1学期期末考试，请老师们查收</small>
  <small>Data Last Updated Jan 4, 2025, 14:30:00 UTC+8</small>
  
  <SearchForm
    {names}
    {error}
    placeholder="输入教师姓名 Enter Proctor Name"
    onSearch={handleSearch}
  />

  {#if error}
    <p class="error">{error}</p>
  {:else if sessions.length > 0}
    <div id="schedule">
      {#each sessions as session}
        <TestSession {session} />
      {/each}
    </div>
  {/if}

  <div class="info">
    这是一个
    <a href="https://fsf.org">自由软件</a>
    项目，由
    <a href="https://github.com/plushugh/examschedule">@plushugh</a>
    开发
  </div>

  <Feedback />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  h1 {
    margin: 20px 0;
    text-align: center;
  }

  small {
    display: block;
    margin: 0 0 10px;
    text-align: center;
  }

  #schedule {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(min(90vw, 400px), 1fr));
    width: 90%;
    max-width: 130ch;
    margin: 64px auto 200px;
  }

  .error {
    color: red;
    text-align: center;
    margin: 20px 0;
  }

  .info {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #fff;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    transition: all 0.2s ease-in-out;
    padding: 10px;
    z-index: 50;
  }

  .info:hover {
    box-shadow: 4px 3px 0 #000;
  }

  .info > a {
    text-decoration: none;
  }

  .info > a:hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    .info {
      bottom: 66.5px;
      left: 0;
      margin: 10px;
      right: unset;
    }
  }
</style> 