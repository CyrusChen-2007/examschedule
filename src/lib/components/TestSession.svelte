{#if session}
<div class="test-session">
  <div class="meta">
    <div class="time-block">
      <div class="date">{session.examDate}</div>
      <div class="time">{session.examTime}</div>
    </div>
    <div class="details">
      <div class="subject">{session.subject}</div>
      <div class="grade">{session.grade}</div>
    </div>
  </div>

  <div class="location">
    <strong>考场 Location:</strong>
    <div>{session.location}</div>
  </div>

  <div class="proctors">
    <strong>监考 Proctors:</strong>
    <div class="list">
      {#each session.proctors as proctor}
        <span class="chip">{proctor}</span>
      {/each}
    </div>
  </div>

  <div class="students">
    <strong>学生 Students ({session.students.length}):</strong>
    <div class="list">
      {#each session.students as student}
        <span class="chip">{student}</span>
      {/each}
    </div>
  </div>
</div>
{/if}

<script lang="ts">
  import type { TestSession } from '$lib/types';
  
  export let session: TestSession;
</script>

<style>
  .test-session {
    display: grid;
    background: #fff;
    padding: 20px;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    transition: all 0.2s ease-in-out;
    gap: 20px;
  }

  .test-session:hover {
    box-shadow: 6px 4px 0 #000;
  }

  .meta {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .time-block {
    display: grid;
    gap: 4px;
    font-weight: bold;
    padding: 8px 12px;
    background: #f0f0f0;
    border-radius: 4px;
    border: 1px solid #ddd;
    min-width: 140px;
    text-align: center;
  }

  .time {
    font-size: 1.2em;
  }

  .date {
    font-size: 0.9em;
    color: #666;
  }

  .details {
    display: grid;
    gap: 4px;
  }

  .subject {
    font-weight: bold;
    font-size: 1.1em;
  }

  .grade {
    color: #666;
  }

  .location, .proctors, .students {
    display: grid;
    gap: 8px;
  }

  strong {
    color: #007779;
    font-size: 0.9em;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    border: 1px solid #ddd;
    transition: all 0.2s ease-in-out;
  }

  .chip:hover {
    background: #e0e0e0;
    border-color: #ccc;
  }

  @media (max-width: 600px) {
    .meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .time-block {
      width: 100%;
    }
  }
</style> 