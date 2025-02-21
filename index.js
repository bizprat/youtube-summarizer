import dotenv from 'dotenv';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

dotenv.config();

// Configure OpenAI client with OpenRouter settings
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  // defaultHeaders: {
  //   'HTTP-Referer':
  //     'https://github.com/yourusername/youtube-summarizer', // Replace with your repo
  //   'X-Title': 'YouTube Summarizer',
  // },
});

// Hardcoded YouTube video URL for testing
const videoUrl =
  'https://www.youtube.com/watch?v=15LCeh46sMs'; // Test video URL

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
