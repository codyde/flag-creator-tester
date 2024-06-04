import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


export async function GET() {

    async function getPageFiles() {
        const fileUrl = 'https://github.com/launchdarkly-labs/ld-demo-airways/blob/main/app/page.tsx';

        const response = await fetch(fileUrl, {
            headers: {
                // 'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const fileContents = await response.text();
        return fileContents

    }

    const data = await getPageFiles()

    console.log(data)


    const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Tell me whats happening in this provided code: ${data}`,
    });

    console.log(text)

    return Response.json({ text })
}