export interface DocCodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface DocEndpointExample {
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  curl: string;
  response: string;
}

export interface DocSection {
  id: string;
  badge: string;
  title: string;
  summary: string;
  details: string[];
  codeSnippet?: DocCodeSnippet;
  endpoints?: DocEndpointExample[];
  metrics?: { label: string; value: string; desc: string }[];
}
