import { CreateFlagInProject } from '@/utils/flagsAPI';
import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

const flagSchema = z.object({
    items: z.array(z.object({
        flagName: z.string(),
        flagKey: z.string(),
        description: z.string(),
        type: z.enum(['boolean', 'integer', 'string', 'json']),
        summary: z.string(),
        file: z.string()
    }))
});

export async function POST(request: Request) {
    const { gitUrl, project, yolocreate } = await request.json();

    async function getPageFiles() {
        const fileUrl = gitUrl;
        // const fileUrl = 'https://api.github.com/repos/codyde/flag-creator-tester/pulls/1';

        const response = await fetch(fileUrl, {
            headers: {
                // 'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3.diff',
                'Cache-Control': 'no-store'
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const fileContents = await response.text();
        return fileContents

    }

    const data = await getPageFiles()

    const result = await generateObject({
        model: openai('gpt-4o'),
        mode: 'json',
        messages: [
            { role: 'system', content: 'You are an assistant whose role is to detect changes that relate to the creation of new feature flags. You will receive a user prompt with diff changes from GitHub, and you should analyze those diffs and make safe assumptions on what the flags being created are, what type they are (from boolean, integer, string, or json). You should look for multiple flags. Your role is to suggest flag names, keys, description of what the flag looks to doing in the code, and the flag types. Structure this return as a JSON response. Include a summary field. Also include a field that indicates what file the new flag is found in within the PR. You should only track additions that are specific to feature flagging only.' },
            { role: 'user', content: `The data for this diff is ${data}` }
        ],
        schema: flagSchema,
    })

    console.log(result)

    // console.log(result.object
    // console.log("The LD Project to create flags is: "+project)

    const flagData = await result.object

    if (yolocreate === true) {
        for (let flag of flagData.items) {
            const newFlag = await CreateFlagInProject(project, flag.type, flag.flagName, flag.flagKey, flag.description);
            console.log(newFlag)
        }
    } else {
        console.log("We are not yolo'ing today - return to UI")
    }

    return Response.json({ flagData })
}