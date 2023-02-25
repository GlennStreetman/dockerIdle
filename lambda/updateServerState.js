import { EC2Client, StopInstancesCommand, StartInstancesCommand } from "@aws-sdk/client-ec2"; // ES Modules import

const client = new EC2Client({ region: "us-east-2" });

export const handler = async(event) => {

    console.log("event", event.hibernate)
    if (event.hibernate === "true") console.log('Hibernating Instance')
    if (event.hibernate !== "true") console.log('Starting Instance')
    const ec2Params = event.hibernate === "true" ? {
        InstanceIds: [
            "i-08cfa61dffbf419fb"
        ],
        Hibernate: true
    } :
    {
        InstanceIds: [
            "i-08cfa61dffbf419fb"
        ]
    }

    const command = event.hibernate === "true" ? 
        new StopInstancesCommand(ec2Params) :
        new StartInstancesCommand(ec2Params)

    try {
        const data = await client.send(command);
        console.log(data)
    } catch (error) {
        console.log(error)
    } finally {
        const response = {
            statusCode: 200,
            body: JSON.stringify(`i-08cfa61dffbf419fb state changed to: ${event.hibernate}`),
        };
        return response;
    }
};
