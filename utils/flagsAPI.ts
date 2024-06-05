export async function CreateFlagInProject(project: string, type: string , name: string, key: string, description: string) {
    const projectKey = project;

    console.log("kind is: "+type)

    let variation;
    if (type === 'boolean') {
        variation = [
            {
                "value": true,
                "name": "Available",
                "description": "Flag is Enabled"
            },
            {
                "value": false,
                "name": "Unavailable",
                "description": "Flag is Disabled"
            }
        ];
    } else if (type === 'string') {
        variation = [
            {
                "value": "This flag is string enabled true",
                "name": "New Value",
                "description": "This flag is string enabled true"
            },
            {
                "value": "This flag is the default",
                "name": "Old Value",
                "description": "This flag is string enabled false"
            }
        ];
    }

    const body = {
        clientSideAvailability: {
            usingEnvironmentId: true,
            usingMobileKey: false
        },
        key: key,
        name: name,
        description: description,
        variations: variation
    };

    console.log(body)

    const resp = await fetch(
      `https://app.launchdarkly.com/api/v2/flags/${projectKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_LD_API_KEY || ''
        },
        body: JSON.stringify(body)
      }
    );
  
    const data = await resp.json();
    return data
  }