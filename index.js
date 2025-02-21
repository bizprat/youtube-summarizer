import dotenv from 'dotenv';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

dotenv.config();

// Configure OpenAI client with OpenRouter settings
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer':
      'https://github.com/bizprat/youtube-summarizer',
    'X-Title': 'YouTube Summarizer',
  },
});

// YouTube video URL to summarize
const videoUrl =
  'https://www.youtube.com/watch?v=15LCeh46sMs';

/**
 * Extracts the transcript from a YouTube video
 * @param {string} videoUrl - The URL of the YouTube video
 * @returns {Promise<string>} The complete transcript text
 */
async function getTranscript(videoUrl) {
  try {
    const transcript =
      await YoutubeTranscript.fetchTranscript(videoUrl);
    return transcript.map((item) => item.text).join(' ');
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

/**
 * Generates a bullet-point summary of the provided text using OpenRouter AI
 * @param {string} text - The text to summarize
 * @returns {Promise<string>} The bullet-point summary
 */
async function summarizeText(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates concise bullet-point summaries. Focus on the main points and key takeaways.',
        },
        {
          role: 'user',
          content: `Please summarize the following text in bullet points:\n\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

/**
 * Main function to orchestrate the video summarization process
 */
async function main() {
  try {
    console.log('Fetching video transcript...');
    const transcript = await getTranscript(videoUrl);

    console.log('Generating summary...');
    const summary = await summarizeText(transcript);

    console.log('\nSummary:');
    console.log(summary);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
