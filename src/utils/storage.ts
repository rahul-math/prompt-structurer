import { PromptTemplate } from '../types/prompt';

export class StorageManager {
  private static readonly TEMPLATES_KEY = 'prompt-structurer-templates';
  private static readonly THEME_KEY = 'prompt-structurer-theme';

  static saveTemplate(template: PromptTemplate): void {
    const templates = this.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
  }

  static getTemplates(): PromptTemplate[] {
    try {
      const stored = localStorage.getItem(this.TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
  }

  static saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  static getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }
}