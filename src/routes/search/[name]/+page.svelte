<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { language, translations } from '$lib/stores/language';
  import type { TestSession } from '$lib/types';
  import SearchForm from '$lib/components/SearchForm.svelte';
  import '../../../lib/styles/theme.css';

  let names: string[] = [];
  let sessions: TestSession[] = [];
  let loadError: string | null = null;
  let loading = true;

  $: name = $page.params.name;
  $: t = translations[$language];

  async function loadData() {
    loading = true;
    loadError = null;
    try {
      const dataRes = await fetch(`/api/data?type=student&name=${encodeURIComponent(name)}`);
      if (!dataRes.ok) throw new Error('Failed to load sessions');
      const data = await dataRes.json();
      sessions = data[name] || [];
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Failed to load data';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      $language = savedLang;
    }
    try {
      const res = await fetch('/api/list?type=student');
      if (!res.ok) throw new Error('Failed to load student names');
      const text = await res.text();
      names = text.split('\n').filter(Boolean);
      if (name) {
        await loadData();
      }
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Failed to load data';
      loading = false;
    }
  });

  function formatDate(date: string): string {
    if (!date) return '';
    try {
      const [month, day] = date.split('/').map(n => parseInt(n));
      const dateObj = new Date(2024, month - 1, day);
      return dateObj.toLocaleDateString($language === 'zh' ? 'zh-CN' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  }

  function groupSessionsByDay(sessions: TestSession[]): Record<string, TestSession[]> {
    const groups: Record<string, TestSession[]> = {};
    for (const session of sessions) {
      const date = session.examDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    }
    return groups;
  }

  function isAM(time: string): boolean {
    const startTime = parseInt(time.split('-')[0]);
    return startTime < 1200;
  }

  $: groupedSessions = groupSessionsByDay(sessions);
  $: sortedDates = Object.keys(groupedSessions).sort();
  $: formattedDates = $language && sortedDates.reduce((acc, date) => {
    acc[date] = formatDate(date);
    return acc;
  }, {} as Record<string, string>);

  function toggleLanguage() {
    const newLang = $language === 'en' ? 'zh' : 'en';
    $language = newLang;
    localStorage.setItem('preferred_language', newLang);
  }
</script>

<div class="header">
  <div class="header-content">
    <div class="title-section">
      <div class="title-border">
      <a href="/" class="title">
        <p>
          <span class="brand">BRS</span>
          <span class="title-text">Exam Schedule</span>
        </p>
      </a>
      </div>
      <div class="search-container">
        <SearchForm
          {names}
          placeholder={t.search_placeholder}
        />
      </div>
    </div>
  </div>
</div>

<div class="content">
  <h1 class="page-title">
    {$language === 'zh' ? '2024年第一学期期末考试安排' : '2024 1st Semester Final Exam Schedule'}<br>
    <span class="for">{$language === 'zh' ? '学生' : 'for'}</span>
    <span class="student-name">{name}</span>
  </h1>

  {#if loading}
    <div class="loading">{t.loading}</div>
  {:else if loadError}
    <div class="error">{loadError}</div>
  {:else if sessions.length === 0}
    <div class="empty">{t.no_results}</div>
  {:else}
    {#each sortedDates as date}
      <div class="day-group">
        <h2 class="date-header">{formattedDates[date]}</h2>
        <div class="sessions">
          {#each groupedSessions[date] as session}
            <div class="session">
              <div class="room">{session.room}</div>
              <div class="time-block">
                <span class="period {isAM(session.examTime) ? 'am' : 'pm'}">{isAM(session.examTime) ? 'AM' : 'PM'}</span>
                <span class="time">{session.examTime}</span>
              </div>
              <div class="details">
                <div class="course">
                  {session.course.split(' ').slice(0, -1).join(' ')}
                </div>
                <div class="grade">高一、高二</div>
                <div class="proctors">
                  {#each session.proctors as proctor}
                    <span class="proctor">{proctor}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<button class="lang-button" on:click={toggleLanguage}>
  {$language === 'en' ? '切换到中文' : 'Switch to English'}
</button>

<div class="copyright-container">
  <div class="copyright">© 2022-Present uHenry</div>
</div>

<style>
  .header {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-background);
    border: none;
    border-radius: 0;
    padding: 0;
    z-index: 100;
    width: 90%;
    max-width: 800px;
    box-shadow: var(--shadow-box);
  }

  .header-content {
    width: 100%;
    margin: 0 auto;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 0rem;
    width: 100%;
    padding-left: 0rem;
  }

  .title {
    font-size: 2rem;
    font-weight: normal;
    margin: 0;
    white-space: nowrap;
    text-decoration: none;
    color: var(--color-text);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .brand {
    color: #E31E24;
    font-weight: bold;
  }

  .title-text {
    font-weight: bold;
    margin: 0;
  }

  .title-border {
    border: 2px solid var(--color-border);
    border-right-width: 0px;
    height: 56px;
    padding-left: 1rem;
    box-sizing: content-box;

    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-container {
    width: 66.67%;
    position: relative;
  }

  .search-container :global(input) {
    height: 56px;
    border: 2px solid var(--color-border);
  }

  .search-container :global(button.search-button) {
    height: 56px !important;
  }

  .page-title {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 2rem;
    text-align: center;
    line-height: 1.4;
  }

  .for {
    font-style: italic;
    font-weight: normal;
    margin: 0 0.5rem;
  }

  .student-name {
    font-weight: bold;
  }

  .content {
    max-width: 800px;
    margin: 120px auto 2rem;
    padding: 1rem;
  }

  .loading,
  .error,
  .empty {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-secondary);
    font-family: var(--font-sans);
  }

  .error {
    color: var(--color-error);
  }

  .day-group {
    margin-bottom: 2rem;
  }

  .date-header {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 2rem 0 1rem;
    color: var(--color-text);
  }

  .sessions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .session {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--color-background);
    border: 2px solid var(--color-border);
    box-shadow: var(--shadow-box);
    width: 100%;
  }

  .time-block {
    display: flex;
    align-items: center;
  }

  .details {
    display: flex;
    flex-direction: column;
  }

  .lang-button {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem 1rem;
    font-size: 14px;
    color: black;
    background-color: #cdfeff;
    border: 2px solid #007779;
    box-shadow: var(--shadow-box);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1000;
  }

  .lang-button::before {
    content: "🌐";
  }

  .lang-button:hover {
    outline: none;
    transform: translate(-1px, -1px);
    box-shadow: 7px 7px 0 #007779;
  }

  .lang-button:active {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #007779;
  }

  .copyright-container {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 2px 4px;
    background-color: #ffffffaa;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: none;
    box-shadow: none;
  }

  .copyright {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 800px) {
    .header {
      width: calc(100% - 32px);
      top: 16px;
    }

    .title-section {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .title {
      margin-bottom: 0;
    }

    .content {
      margin-top: 200px;
    }

    .sessions {
      grid-template-columns: 1fr;
    }
  }
</style> 