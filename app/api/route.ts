import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

const flagSchema = z.object({
    flagName: z.string(),
    flagKey: z.string(),
    description: z.string(),
    type: z.enum(['boolean', 'integer', 'string', 'json']),
    summary: z.string()
});

export async function GET() {

    async function getPageFiles() {
        const fileUrl = 'https://api.github.com/repos/codyde/flag-creator-tester/pulls/1';

        const response = await fetch(fileUrl, {
            headers: {
                // 'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3.diff'
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

    const result = await generateObject({
        model: openai('gpt-4-turbo'),
        mode: 'json',
        messages: [
            { role: 'system', content: 'You are an assistant whose sole purpose is to detect changes that relate to the creation of new feature flags. You will receive a user prompt with diff changes from GitHub, and you should analyze those diffs and make safe assumptions on what the flags being created are, what type they are (from boolean, integer, string, or json). Your role is to suggest a flag name, a flag key, a description, and the type. Structure this return as a JSON response. Include a summary field' },
            { role: 'user', content: `The data for this diff is ${data}` }
        ],
        schema: flagSchema
    });

    console.log(result.object)

    const flagData = await result.object

    return Response.json({ flagData })
}