const { axiosCall, validateSlackRequest, responseGenerator, randomPicker } = require("./utils");
const { blockMessage } = require("./slackBlockBuilder")

exports.lambdaHandler = async (event) => {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

  let response;
  if (validateSlackRequest(event, signingSecret)) {
    console.log("event", event);
    const body = await JSON.parse(event.body);
    console.log("body", body);

    try {
      const GetRockets = await axiosCall(
        "get",
        "https://api.spacexdata.com/v4/rockets"
      );

      const rocketData = await randomPicker(GetRockets.data)
      console.log("rocketData", rocketData);

      let channel =  body.event.channel
      let imageUrl = rocketData.flickr_images[0]
      let title = rocketData.name
      let text = rocketData.description

      let resBlockMessage = await blockMessage(channel, imageUrl, title, text)
      const sendBlockMessage = await axiosCall(
        "post",
        "https://slack.com/api/chat.postMessage",
        headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": resBlockMessage.length,
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          Accept: "application/json",
        },
        data = resBlockMessage
      );

      console.log(await sendBlockMessage);
    
    } catch (err) {
      console.log(err);
      response = responseGenerator(500, "Internal Server Error")
    }
  } else {
    response = responseGenerator(401, "Unauthorized")
  }

  return response;
};
