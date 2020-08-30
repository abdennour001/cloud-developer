import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JwtToken";

const cert = `
MIIDBzCCAe+gAwIBAgIJG/k0bAtoy6+AMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmFiZGVubm91ci5ldS5hdXRoMC5jb20wHhcNMjAwODMwMTMxOTU0WhcNMzQw
NTA5MTMxOTU0WjAhMR8wHQYDVQQDExZhYmRlbm5vdXIuZXUuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApqFMntwKb7rJsLioaZAXtdaR
N9tsuQ8g6enne2QE+DDv6SR+l1a1TLoxkL9obBXECOiQnlIO0K8KCDeAPVB0LKKo
MucaZtBPkp14JucutGiE8S74YZi6E1rhSzy+yhIzV9W+9qvZiuAX2DAspoLWC7wv
BNeMd9HwUe+WT/M1smO21byMEJjkCx1kBy02VlcXEyJQF7xtmOPQPiXK1CTYRDz0
7IBEpRfVNtcyvy116OO6/RWI0EVnAXfYUJfHJtkWKDEi7nIPo5lAeRVBuJu7QfbJ
XETM2pPKp8ZztbFakf6lsCwnHhoXCnLM5ROk69N1ZRkICkqKMejC9ss0MQiC9QID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ9tiL+x6n/e9m2eW6j
9CFCpLVIajAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBABP7OuTW
3PiTv1UmZh9Qr5dHhW4SbiVUp6tsD6/Goldwy6IL3153yFiXpvb3f0Fq0/cQz+1J
wU7d0MGqJJcXSPPLOAmCgR0P85SkjukTmwF8Ve/p3wLwRgULFY2P9f7M08e/RbXw
bAS/NZ569nRQWO2ynOCXTO6f0wCNMzInq0NZQvLnrNojOgoDSXIn8QM/yvDL2GmL
/nCwpL1VzC1cN0+s4cVxck2Jd07vBOkFVP/1uhC+B1yi+wQXQhV5wmsDTNXnhgPx
N3SR8lYOb8EedfYEjimgXubkELKKozwSsEDchfpHxRiWYQxUVLOCqPiBa1kaPWlU
Kd98fPfDevELVas=`;

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken);
        console.log("User was authorized", jwtToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "*"
                    }
                ]
            }
        };
    } catch (e) {
        console.log("User authorized", e.message);

        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Deny",
                        Resource: "*"
                    }
                ]
            }
        };
    }
};

function verifyToken(authHeader: string): JwtToken {
    if (!authHeader) throw new Error("No authentication header");

    if (!authHeader.toLowerCase().startsWith("bearer "))
        throw new Error("Invalid authentication header");

    const split = authHeader.split(" ");
    const token = split[1];

    return verify(token, cert, { algorithms: ["RS256"] }) as JwtToken;
}
