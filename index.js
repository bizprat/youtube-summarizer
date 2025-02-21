import dotenv from 'dotenv';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

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
 * Ensures the output directory exists
 * @returns {Promise<void>}
 */
async function ensureOutputDir() {
  const outputDir = path.join(process.cwd(), 'output');
  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir);
  }
  return outputDir;
}

/**
 * Extracts video ID from YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {string} Video ID
 */
function getVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : 'video';
}

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
 * Saves the summary to a file in the output directory
 * @param {string} summary - The generated summary
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<string>} Path to the saved file
 */
async function saveSummary(summary, videoId) {
  const outputDir = await ensureOutputDir();
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');
  const filename = `summary_${videoId}_${timestamp}.txt`;
  const filepath = path.join(outputDir, filename);

  await fs.writeFile(filepath, summary, 'utf8');
  return filepath;
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

    // Save summary to file
    const videoId = getVideoId(videoUrl);
    const filepath = await saveSummary(summary, videoId);

    console.log('\nSummary:');
    console.log(summary);
    console.log(`\nSummary saved to: ${filepath}`);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
