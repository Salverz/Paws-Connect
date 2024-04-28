const TextTranslationClient = require("@azure-rest/ai-translation-text").default;

const apiKey = process.env.AZURE_API_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com/";
const region = "global";

const translateClient = new TextTranslationClient(endpoint, { key: apiKey, region });

// Function to detect language
async function detectLanguage(text) {
    try {
        const response = await translateClient.path("/detect").post({
            body: [{ Text: text }]
        });
        if (response.status === 200) {
            return response.body[0].language;
        } else {
            throw new Error(`Failed to detect language with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error in language detection:", error);
        throw error;
    }
}

// Function to translate text
async function translateText(text, targetLanguage) {
    try {
        const response = await translateClient.path("/translate").post({
            queryParameters: { "api-version": "3.0", to: [targetLanguage] },
            body: [{ Text: text }]
        });
        if (response.status === 200) {
            return response.body[0].translations[0].text;
        } else {
            throw new Error(`Translation failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error in translating text:", error);
        throw error;
    }
}


main().catch((err) => {
    console.error("An error occurred:", err);
    process.exit(1);
  });
  module.exports = { detectLanguage, translateText };