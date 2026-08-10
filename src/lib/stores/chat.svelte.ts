import { generateSparql, executeSparql } from '$lib/api/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sparql?: string;
  table?: string;
  timestamp: Date;
  loading?: boolean;
  error?: boolean;
  executing?: boolean;
}

function createChatStore() {
  let messages = $state<Message[]>([]);
  let isLoading = $state(false);

  function generateId(): string {
    return crypto.randomUUID();
  }

  async function sendMessage(content: string): Promise<void> {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    messages = [...messages, userMessage];
    isLoading = true;

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true
    };

    messages = [...messages, assistantMessage];

    try {
      const sparql = await generateSparql(content.trim());

      messages = messages.map((m) =>
        m.id === assistantMessage.id
          ? {
              ...m,
              sparql,
              content: 'Here is your SPARQL query:',
              loading: false
            }
          : m
      );
    } catch (error) {
      messages = messages.map((m) =>
        m.id === assistantMessage.id
          ? {
              ...m,
              content: 'Sorry, an error occurred while generating the SPARQL query. Please try again.',
              loading: false,
              error: true
            }
          : m
      );
    } finally {
      isLoading = false;
    }
  }

  async function executeSparqlQuery(sparql: string): Promise<void> {
    if (!sparql.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: 'Execute this SPARQL query',
      timestamp: new Date()
    };

    messages = [...messages, userMessage];
    isLoading = true;

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      executing: true
    };

    messages = [...messages, assistantMessage];

    try {
      const table = await executeSparql(sparql);

      messages = messages.map((m) =>
        m.id === assistantMessage.id
          ? {
              ...m,
              table,
              content: 'Here are the query results:',
              executing: false
            }
          : m
      );
    } catch (error) {
      messages = messages.map((m) =>
        m.id === assistantMessage.id
          ? {
              ...m,
              content: 'Sorry, an error occurred while executing the query. Please try again.',
              executing: false,
              error: true
            }
          : m
      );
    } finally {
      isLoading = false;
    }
  }

  function clearMessages(): void {
    messages = [];
  }

  return {
    get messages(): Message[] {
      return messages;
    },
    get isLoading(): boolean {
      return isLoading;
    },
    sendMessage,
    executeSparqlQuery,
    clearMessages
  };
}

export const chatStore = createChatStore();
