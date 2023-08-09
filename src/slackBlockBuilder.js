const { Message, Blocks } = require('slack-block-builder');

const blockMessage = ( channel, imageUrl, title, text, altText = "") => {
    console.log("Entered blockMessage: ",  { channel, imageUrl, title, text, altText});
  return Message()
    .channel(channel)
    .text(text)
    .blocks(
      Blocks.Image()
        .imageUrl(imageUrl)
        .altText(altText)
        .title(title),
      Blocks.Section({ text: text}))
    .buildToJSON();
};

module.exports = { blockMessage };