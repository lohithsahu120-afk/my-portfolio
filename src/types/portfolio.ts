export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'vision' | 'rag' | 'edge' | 'mlops' | 'bio';
  categoryLabel: string;
  year: string;
  image: string;
  summary: string;
  problem: string;
  solution: string;
  architecture: string[];
  metrics: { label: string; value: string; detail: string }[];
  tags: string[];
  codeSnippet?: string;
  githubUrl: string;
  demoUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  doi?: string;
  badge: string;
  pdfUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: string;
  achievements: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: string; description: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
}
