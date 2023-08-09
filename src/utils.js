const axios = require("axios");
const crypto = require("crypto");

 const axiosCall = async (method, url, headers={}, data= {}, params = {}) => {
  console.log("Entered: axiosCall ", `Method: ${method} , URL: ${url}`);
  const config = {
    method: method,
    url: url,
    headers: headers,
    data: data
  };
  try {
    const res = await axios(config);
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

 const validateSlackRequest = (event, signingSecret) => {
  const requestBody = event["body"];
  const headers = makeLower(event.headers);
  const timestamp = headers["x-slack-request-timestamp"];
  const slackSignature = headers["x-slack-signature"];
  const baseString = "v0:" + timestamp + ":" + requestBody;

  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");
  const computedSlackSignature = "v0=" + hmac;
  const isValid = computedSlackSignature === slackSignature;

  return isValid;
};

const makeLower = (headers) => {
  let lowerCaseHeaders = {};

  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      lowerCaseHeaders[key.toLowerCase()] = headers[key].toLowerCase();
    }
  }

  return lowerCaseHeaders;
};


const responseGenerator = (statusCode, message) => {
let response = {
  statusCode: statusCode,
  body: JSON.stringify({
    message: message,
  }),
};
return response
}

const randomPicker = (listItems) => {
  const random = Math.floor(Math.random() * listItems.length);
  return listItems[random]
}

module.exports = {  axiosCall, validateSlackRequest, responseGenerator,randomPicker };