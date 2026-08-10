const API_BASE = 'http://127.0.0.1:8000';

export interface SparqlResponse {
  sparql: string;
}

export interface ResultsResponse {
  table: string;
}

export interface HealthResponse {
  status: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function generateSparql(request: string): Promise<string> {
  const response = await fetch(`${API_BASE}/sparql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ request })
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  const data: SparqlResponse = await response.json();
  return data.sparql;
}

export async function executeSparql(sparql: string): Promise<string> {
  const response = await fetch(`${API_BASE}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sparql })
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  const data: ResultsResponse = await response.json();
  return data.table;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) return false;
    const data: HealthResponse = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
