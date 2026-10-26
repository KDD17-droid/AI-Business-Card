const { app } = require("@azure/functions");
const { AzureOpenAI } = require("openai");

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { message, systemPrompt } = body;

      const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const apiKey = process.env.AZURE_OPENAI_KEY;
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
      const deployment =
        process.env.AZURE_OPENAI_DEPLOYMENT ||
        process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

      if (!endpoint || !apiKey || !apiVersion || !deployment) {
        context.error("Missing Azure OpenAI configuration.", {
          hasEndpoint: Boolean(endpoint),
          hasApiKey: Boolean(apiKey),
          hasApiVersion: Boolean(apiVersion),
          hasDeployment: Boolean(deployment),
        });

        return {
          status: 500,
          jsonBody: {
            error: "Azure OpenAI configuration is missing.",
          },
        };
      }

      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
      });

      const response = await client.chat.completions.create({
        model: deployment,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_completion_tokens: 2000,
      });

      return {
        jsonBody: {
          reply: response.choices[0].message.content,
        },
      };
    } catch (error) {
      context.error("chat function failed", error);
      return {
        status: 500,
        jsonBody: {
          error: "Failed to generate reply.",
        },
      };
    }
  },
});
