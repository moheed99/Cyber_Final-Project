import { GoogleGenAI } from "@google/genai";
import { LogEntry } from '../types';

export const generateSecurityReport = async (logs: LogEntry[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key not found. Please set process.env.API_KEY to use AI reporting.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Summarize logs for the prompt to save tokens
    const logSummary = logs.slice(-50).map(l => `[${l.timestamp}] [${l.tool}] ${l.type}: ${l.message}`).join('\n');

    const prompt = `
      You are a senior cybersecurity analyst for PayBuddy.
      Generate a professional executive summary and technical analysis based on the following session logs from the 'CyberGuard' testing toolkit.
      
      Logs:
      ${logSummary}

      Format the report as follows:
      1. Executive Summary
      2. Key Findings (Categorized by tool: Port Scan, Auth, Network)
      3. Risk Assessment (Low/Medium/High)
      4. Recommendations

      Keep it concise and professional. Use Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No report generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate report due to an API error. Please check console.";
  }
};