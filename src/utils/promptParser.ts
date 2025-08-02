import { StructuredPrompt, PromptType } from '../types/prompt';
import { geminiService } from '../services/geminiService';

export class PromptParser {
  static async parsePrompt(rawPrompt: string, type: PromptType = 'general'): Promise<StructuredPrompt> {
    try {
      return await geminiService.structurePrompt(rawPrompt, type);
    } catch (error) {
      console.error('Error with Gemini parsing, using fallback:', error);
      return this.fallbackParsing(rawPrompt, type);
    }
  }

  private static fallbackParsing(rawPrompt: string, type: PromptType): StructuredPrompt {
    const context = this.extractContext(rawPrompt);
    const task = this.extractTask(rawPrompt, context);
    const format = this.extractFormat(rawPrompt);
    const constraints = this.extractConstraints(rawPrompt);
    const examples = this.extractExamples(rawPrompt);
    
    return {
      context: context || this.getDefaultContext(type),
      task: task || rawPrompt.trim(),
      format: format || this.getDefaultFormat(type),
      constraints,
      examples
    };
  }
  private static extractContext(prompt: string): string {
    const contextPatterns = [
      /you're?\s+(?:an?\s+)?([^.!?]+)/i,
      /act as\s+(?:an?\s+)?([^.!?]+)/i,
      /assume the role of\s+([^.!?]+)/i,
      /as\s+(?:an?\s+)?([^.!?]+),/i,
      /^([^.!?]*expert[^.!?]*)/i,
      /^([^.!?]*professional[^.!?]*)/i
    ];

    for (const pattern of contextPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/[,.]$/, '');
      }
    }

    return '';
  }

  private static extractTask(prompt: string, context: string): string {
    let task = prompt;
    
    // Remove context from task
    if (context) {
      task = task.replace(new RegExp(context.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
    }
    
    // Clean up task
    task = task.replace(/^[.,\s]+/, '').replace(/[.,\s]+$/, '');
    task = task.replace(/^(you're?|act as|assume the role of)[^.!?]*[.!?]?\s*/i, '');
    
    return task || prompt;
  }

  private static extractFormat(prompt: string): string {
    const formatPatterns = [
      /in\s+(?:the\s+form\s+of\s+)?(?:a\s+)?([^.!?]+format[^.!?]*)/i,
      /as\s+(?:a\s+)?([^.!?]*list[^.!?]*)/i,
      /in\s+([^.!?]*json[^.!?]*)/i,
      /as\s+([^.!?]*table[^.!?]*)/i,
      /in\s+([^.!?]*bullet\s+points?[^.!?]*)/i,
      /(\d+\s+(?:bullet\s+)?points?)/i,
      /(\d+\s+ideas?)/i,
      /(\d+\s+examples?)/i,
      /(step-by-step)/i
    ];

    for (const pattern of formatPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return '';
  }

  private static extractConstraints(prompt: string): string[] {
    const constraints: string[] = [];
    
    const constraintPatterns = [
      /(?:keep\s+(?:them?\s+)?|make\s+(?:them?\s+)?)?under\s+(\d+\s+words?)/i,
      /(?:max|maximum)\s+(\d+\s+words?)/i,
      /no\s+more\s+than\s+(\d+\s+words?)/i,
      /limit(?:ed)?\s+to\s+(\d+\s+words?)/i,
      /within\s+(\d+\s+words?)/i,
      /(no\s+repetition)/i,
      /(avoid\s+[^.!?]+)/i,
      /(don't\s+[^.!?]+)/i,
      /(must\s+(?:be\s+)?[^.!?]+)/i,
      /(should\s+(?:be\s+)?[^.!?]+)/i,
      /(ensure\s+[^.!?]+)/i
    ];

    for (const pattern of constraintPatterns) {
      const matches = prompt.match(new RegExp(pattern.source, 'gi'));
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.trim().replace(/[.,]$/, '');
          if (!constraints.includes(cleaned)) {
            constraints.push(cleaned);
          }
        });
      }
    }

    return constraints;
  }

  private static extractExamples(prompt: string): Array<{ input: string; output: string }> {
    const examples: Array<{ input: string; output: string }> = [];
    
    // Look for example patterns
    const examplePatterns = [
      /example[s]?[:\s]+([^]+?)(?=\n\n|\n[A-Z]|$)/i,
      /for instance[:\s]+([^]+?)(?=\n\n|\n[A-Z]|$)/i,
      /such as[:\s]+([^]+?)(?=\n\n|\n[A-Z]|$)/i
    ];

    for (const pattern of examplePatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        examples.push({
          input: 'Example input',
          output: match[1].trim()
        });
      }
    }

    return examples;
  }

  private static getDefaultContext(type: PromptType): string {
    const defaults = {
      'chatbot': 'You are a helpful AI assistant',
      'coding': 'You are an expert software developer',
      'image-generation': 'You are a creative AI image generator',
      'content-writing': 'You are a professional content writer',
      'data-analysis': 'You are a data analysis expert',
      'general': 'You are an AI assistant'
    };
    return defaults[type];
  }

  private static getDefaultFormat(type: PromptType): string {
    const defaults = {
      'chatbot': 'Conversational response',
      'coding': 'Code with explanations',
      'image-generation': 'Detailed image description',
      'content-writing': 'Well-structured content',
      'data-analysis': 'Analytical report with insights',
      'general': 'Clear and organized response'
    };
    return defaults[type];
  }
}