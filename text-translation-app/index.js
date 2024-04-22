const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = "8b0eab61f028479c9b5cba0086961032";
const endpoint = "https://api.cognitive.microsofttranslator.com/";
const region = "global";

async function main() {

  console.log("== Text translation sample ==");

  const translateCredential = {
    key: apiKey,
    region,
  };
  const translationClient = new TextTranslationClient(endpoint,translateCredential);

  const inputText = [{ text: "This is a test." }];
  const translateResponse = await translationClient.path("/translate").post({
    body: inputText,
    queryParameters: {
      to: "fr",
      from: "en",
    },
  });

  const translations = translateResponse.body;
  for (const translation of translations) {
    console.log(
      `Text was translated to: '${translation?.translations[0]?.to}' and the result is: '${translation?.translations[0]?.text}'.`
    );
  }
}

main().catch((err) => {
    console.error("An error occurred:", err);
    process.exit(1);
  });

  module.exports = { main };