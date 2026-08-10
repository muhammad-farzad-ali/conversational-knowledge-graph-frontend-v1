<script>
  let { code, onExecute } = $props();

  let copied = $state(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function handleExecute() {
    if (onExecute) {
      onExecute(code);
    }
  }
</script>

<div class="code-container">
  <div class="code-header">
    <span class="language-tag">SPARQL</span>
    <button class="copy-btn" onclick={copyToClipboard} title="Copy to clipboard">
      {#if copied}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
        Copied!
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
        Copy
      {/if}
    </button>
  </div>
  <pre class="code-block"><code>{code}</code></pre>

  {#if onExecute}
    <div class="code-footer">
      <button class="execute-btn" onclick={handleExecute} title="Execute query">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Execute
      </button>
    </div>
  {/if}
</div>

<style>
  .code-container {
    margin-top: 0.75rem;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background-color: #161b22;
    border-bottom: 1px solid var(--border);
  }

  .language-tag {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-btn:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .code-block {
    margin: 0;
    padding: 1rem;
    background-color: var(--code-bg);
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    color: #e6edf3;
  }

  .code-block code {
    white-space: pre;
  }

  .code-footer {
    padding: 0.5rem 0.75rem;
    background-color: #161b22;
    border-top: 1px solid var(--border);
  }

  .execute-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--accent);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .execute-btn:hover {
    background-color: var(--accent-hover);
    transform: scale(1.02);
  }
</style>
