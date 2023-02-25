import { Route53Client, ChangeResourceRecordSetsCommand } from "@aws-sdk/client-route-53";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const route53client = new Route53Client({ region: "us-east-2" });
const ec2Client = new EC2Client({ region: "us-east-2" });

export const handler = async(event) => {

    const ec2Params = {
        InstanceIds: [
            "i-08cfa61dffbf419fb"
        ]
    };

    let ec2Command = new DescribeInstancesCommand(ec2Params)

    try {
        const ec2Data = await ec2Client.send(ec2Command);
        const ec2IP = ec2Data?.Reservations[0]?.Instances[0]?.PublicIpAddress || false

        if (ec2IP !== false){
            var route53Params = {
                "ChangeBatch": {
                    "Changes": [
                        {
                        "Action": "UPSERT",
                        "ResourceRecordSet": {
                            "Failover": "PRIMARY", 
                            "HealthCheckId": "b4f78cfd-40e2-4207-a124-0e7900141006", 
                            "Name": "idle.gstreet.dev", 
                            "ResourceRecords": [
                            {
                                "Value": ec2IP
                            }
                            ],
                            "SetIdentifier": "primary", 
                            "TTL": 15, 
                            "Type": "A"
                        }
                        }
                    ], 
                    "Comment": "Update IP"
                }, 
                "HostedZoneId": "Z02055361VSA5A0DJ8SEO"
            }

            let route53Command = new ChangeResourceRecordSetsCommand(route53Params)

            try {
                const data53 = await route53client.send(route53Command);
                console.log(data53)
            } catch (error) {
                console.log(error)
            } finally {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify('DNS A RECORD UPDATED!'),
                };
                return response;
            }
        }
        else
        {
            console.log('failed to retrieve ec2 instance public ip. Check instand ID.')
        }
    } catch (error) {
        console.log(error)
    } 
};
