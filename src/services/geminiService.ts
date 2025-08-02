import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuredPrompt, EnhancedPrompt, PromptType } from '../types/prompt';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async enhancePrompt(rawPrompt: string, type: PromptType = 'general'): Promise<EnhancedPrompt> {
    try {
      const enhancementPrompt = `
You are an expert prompt engineer. Your task is to enhance the following prompt to make it more effective and structured.

Original prompt: "${rawPrompt}"
Prompt type: ${type}

Please enhance this prompt by:
1. Adding appropriate role/context if missing
2. Making the task more specific and clear
3. Adding format specifications
4. Including helpful constraints
5. Adding examples if beneficial

Provide your response in the following JSON format:
{
  "enhanced": "The improved prompt text",
  "improvements": ["List of specific improvements made"],
  "score": 85
}

The score should be between 0-100 based on how much the prompt was improved.
Make sure the enhanced prompt is professional, clear, and follows prompt engineering best practices.
`;

      const result = await this.model.generateContent(enhancementPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        original: rawPrompt,
        enhanced: parsedResponse.enhanced,
        improvements: parsedResponse.improvements || [],
        score: parsedResponse.score || 75
      };
    } catch (error) {
      console.error('Error enhancing prompt with Gemini:', error);
      // Fallback to local enhancement
      return this.fallbackEnhancement(rawPrompt, type);
    }
  }

  async structurePrompt(prompt: string, type: PromptType = 'general'): Promise<StructuredPrompt> {
    try {
      const structuringPrompt = `
You are an expert prompt engineer. Analyze the following prompt and extract its components into a structured JSON format.

Prompt: "${prompt}"
Type: ${type}

Extract and organize the prompt into the following JSON structure:
{
  "context": "Background or role definition (e.g., 'You are an expert developer')",
  "task": "Main objective or request (what the user wants accomplished)",
  "format": "Output format requirements (e.g., 'bullet points', 'JSON', 'step-by-step')",
  "constraints": ["Array of limitations or requirements"],
  "examples": [
    {
      "input": "Example input if provided",
      "output": "Expected output if provided"
    }
  ]
}

Rules:
- Extract actual content from the prompt, don't make up information
- If a section is not present in the prompt, provide a reasonable default based on the prompt type
- Constraints should be specific limitations mentioned in the prompt
- Examples should only be included if explicitly provided in the prompt
- Keep the extracted content concise but complete

Respond only with valid JSON.
`;

      const result = await this.model.generateContent(structuringPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const structured = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure all required fields exist
      return {
        context: structured.context || this.getDefaultContext(type),
        task: structured.task || prompt,
        format: structured.format || this.getDefaultFormat(type),
        constraints: Array.isArray(structured.constraints) ? structured.constraints : [],
        examples: Array.isArray(structured.examples) ? structured.examples : []
      };
    } catch (error) {
      console.error('Error structuring prompt with Gemini:', error);
      // Fallback to local parsing
      return this.fallbackStructuring(prompt, type);
    }
  }

  private fallbackEnhancement(rawPrompt: string, type: PromptType): EnhancedPrompt {
    // Simple fallback enhancement logic
    let enhanced = rawPrompt;
    const improvements: string[] = [];
    
    if (!this.hasRoleDefinition(enhanced)) {
      const role = this.getDefaultRole(type);
      enhanced = `${role} ${enhanced}`;
      improvements.push('Added role definition');
    }
    
    if (!enhanced.includes('format') && !enhanced.includes('structure')) {
      enhanced += ` Please provide your response in a clear, organized format.`;
      improvements.push('Added format specification');
    }
    
    return {
      original: rawPrompt,
      enhanced,
      improvements,
      score: 70
    };
  }

  private fallbackStructuring(prompt: string, type: PromptType): StructuredPrompt {
    return {
      context: this.extractContext(prompt) || this.getDefaultContext(type),
      task: this.extractTask(prompt),
      format: this.extractFormat(prompt) || this.getDefaultFormat(type),
      constraints: this.extractConstraints(prompt),
      examples: []
    };
  }

  private hasRoleDefinition(prompt: string): boolean {
    const rolePatterns = [
      /you're?\s+(?:an?\s+)?/i,
      /act as\s+/i,
      /assume the role of\s+/i,
      /as\s+(?:an?\s+)?.*expert/i
    ];
    return rolePatterns.some(pattern => pattern.test(prompt));
  }

  private getDefaultRole(type: PromptType): string {
    const roles = {
      'chatbot': 'You are a helpful AI assistant.',
      'coding': 'You are an expert software developer.',
      'image-generation': 'You are a creative AI image generator.',
      'content-writing': 'You are a professional content writer.',
      'data-analysis': 'You are a data analysis expert.',
      'general': 'You are a knowledgeable AI assistant.'
    };
    return roles[type];
  }

  private getDefaultContext(type: PromptType): string {
    const contexts = {
      'chatbot': 'You are a helpful AI assistant',
      'coding': 'You are an expert software developer',
      'image-generation': 'You are a creative AI image generator',
      'content-writing': 'You are a professional content writer',
      'data-analysis': 'You are a data analysis expert',
      'general': 'You are a knowledgeable AI assistant'
    };
    return contexts[type];
  }

  private getDefaultFormat(type: PromptType): string {
    const formats = {
      'chatbot': 'Conversational response',
      'coding': 'Code with explanations',
      'image-generation': 'Detailed description',
      'content-writing': 'Well-structured content',
      'data-analysis': 'Analytical report',
      'general': 'Clear and organized response'
    };
    return formats[type];
  }

  private extractContext(prompt: string): string {
    const contextPatterns = [
      /you're?\s+(?:an?\s+)?([^.!?]+)/i,
      /act as\s+(?:an?\s+)?([^.!?]+)/i,
      /assume the role of\s+([^.!?]+)/i
    ];

    for (const pattern of contextPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/[,.]$/, '');
      }
    }
    return '';
  }

  private extractTask(prompt: string): string {
    // Remove context and extract main task
    let task = prompt;
    const contextMatch = prompt.match(/^[^.!?]*(?:you're?|act as|assume)[^.!?]*[.!?]?\s*/i);
    if (contextMatch) {
      task = prompt.replace(contextMatch[0], '');
    }
    return task.trim() || prompt;
  }

  private extractFormat(prompt: string): string {
    const formatPatterns = [
      /in\s+(?:the\s+form\s+of\s+)?(?:a\s+)?([^.!?]+format[^.!?]*)/i,
      /as\s+(?:a\s+)?([^.!?]*list[^.!?]*)/i,
      /in\s+([^.!?]*json[^.!?]*)/i,
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

  private extractConstraints(prompt: string): string[] {
    const constraints: string[] = [];
    const constraintPatterns = [
      /(?:keep\s+(?:them?\s+)?|make\s+(?:them?\s+)?)?under\s+(\d+\s+words?)/i,
      /(?:max|maximum)\s+(\d+\s+words?)/i,
      /no\s+more\s+than\s+(\d+\s+words?)/i,
      /(no\s+repetition)/i,
      /(avoid\s+[^.!?]+)/i
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
}

export const geminiService = new GeminiService();