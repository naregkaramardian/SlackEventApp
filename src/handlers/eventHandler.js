const { validateSlackRequest, responseGenerator } = require("../utils");

const aws = require('aws-sdk');
const lambda = new aws.Lambda({
  region: 'ca-central-1' 
});

exports.lambdaHandler =  (event) => {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  let response;
  if (validateSlackRequest(event, signingSecret)) {
    console.log("event", event);
    const body = JSON.parse(event.body);
    console.log("body", body);

    try {
      console.log(1);
      const params = {
        FunctionName: 'slackBlockMessageFunction',
        Payload: JSON.stringify(event),
      };
    
      lambda.invoke(params, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Data:', data);
        }
      });
      console.log(2);
      response = responseGenerator(200, "Success!")
    
    } catch (err) {
      console.log(err);
      response = responseGenerator(500, "Internal Server Error")
    }
  } else {
    response = responseGenerator(401, "Unauthorized")
  }

  console.log(response);
  return response;
};
