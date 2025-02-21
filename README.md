# YouTube Video Summarizer

A Node.js application that automatically generates bullet-point summaries of YouTube videos using AI. The application extracts the video transcript and uses OpenRouter.ai's GPT-4-mini model to create concise, easy-to-read summaries.

## Features

- Extract transcripts from YouTube videos
- Generate AI-powered bullet-point summaries
- Easy-to-use command-line interface
- Uses OpenRouter.ai's GPT-4-mini model for high-quality summarization

## Prerequisites

- Node.js installed on your system
- An OpenRouter.ai API key
- YouTube video URL to summarize

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bizprat/youtube-summarizer.git
cd youtube-summarizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_api_key_here
```

## Usage

1. Open `index.js` and replace the `videoUrl` with your desired YouTube video URL:
```javascript
const videoUrl = 'your-youtube-video-url';
```

2. Run the script:
```bash
node index.js
```

The script will fetch the video transcript and generate a bullet-point summary in the console.

## How It Works

1. Uses `youtube-transcript` to extract the video transcript
2. Sends the transcript to OpenRouter.ai's GPT-4-mini model
3. Processes the response to create a bullet-point summary
4. Displays the summary in the console

## Contributing

Feel free to open issues or submit pull requests if you have suggestions for improvements.

## License

This project is licensed under the ISC License - see below for details:

```
Copyright (c) 2024

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
