import { EC2Client, StopInstancesCommand, StartInstancesCommand } from "@aws-sdk/client-ec2"; // ES Modules import

const client = new EC2Client({ region: "us-east-2" });

export const handler = async(event) => {

    const queryParams = event.queryStringParameters
    console.log(queryParams)

    const ec2Params = queryParams.hibernate === true ? {
        InstanceIds: [
            "i-08cfa61dffbf419fb"
        ],
        Hibernate: queryParams.hibernate
    } :
    {
        InstanceIds: [
            "i-08cfa61dffbf419fb"
        ]
    }

    const command = queryParams.hibernate === true ? 
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
            body: JSON.stringify(`i-08cfa61dffbf419fb state changed to: ${queryParams.hibernate}`),
        };
        return response;
    }
};
