# Prompt Structurer

A professional web application that transforms natural language prompts into well-structured JSON format using AI-powered enhancement and parsing.

## Features

- 🤖 **AI-Powered Enhancement**: Uses Google Gemini API to intelligently improve prompts
- 📊 **Smart JSON Structuring**: Automatically extracts context, tasks, format, constraints, and examples
- 🎨 **Modern UI**: Beautiful React interface with Tailwind CSS
- 🌙 **Dark/Light Mode**: Persistent theme switching
- 💾 **Template Management**: Save and reuse structured prompts
- 📋 **Copy & Download**: Easy export of JSON results
- 📱 **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-structurer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key

### Environment Variables

- `VITE_GEMINI_API_KEY`: Google Gemini API key for AI-powered features

## Usage

1. **Enter Prompt**: Type your natural language prompt in the input area
2. **Select Type**: Choose the appropriate prompt type (chatbot, coding, etc.)
3. **Enhance**: Click "Enhance Prompt" to improve your prompt with AI
4. **Convert**: Click "Convert to Structured Format" to generate JSON
5. **Export**: Copy to clipboard or download as JSON file
6. **Save**: Save frequently used prompts as templates

## Example

**Input:**
```
Create app ideas for smart home dashboard
```

**Enhanced:**
```
You are an expert software developer. Create specific app ideas for smart home dashboard. Organize your response in a clear, structured format with detailed descriptions for each idea. Ensure accuracy, clarity, and completeness in your response.
```

**JSON Output:**
```json
{
  "context": "You are an expert software developer",
  "task": "Create specific app ideas for smart home dashboard",
  "format": "Clear, structured format with detailed descriptions",
  "constraints": ["Ensure accuracy, clarity, and completeness"],
  "examples": []
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details