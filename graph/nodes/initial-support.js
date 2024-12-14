import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import llmModal from '../../llm/llm-model.js';

export const initialSupport = async (state) => {
  const model = llmModal.getModel();

  const SYSTEM_TEMPLATE =
    `You are frontline support staff for LangCorp, a company that sells computers.
Be concise in your responses.
You can chat with customers and help them with basic questions, but if the customer is having a billing or technical problem,
do not try to answer the question directly or gather information.
Instead, immediately transfer them to the billing or technical team by asking the user to hold for a moment.
Otherwise, just respond conversationally.`;
  const supportResponse = await model.invoke([
    { role: "system", content: SYSTEM_TEMPLATE },
    ...state.messages,
  ]);

  const CATEGORIZATION_SYSTEM_TEMPLATE = `You are an expert customer support routing system.
Your job is to detect whether a customer support representative is routing a user to a billing team or a technical team, or if they are just responding conversationally.`;
  const CATEGORIZATION_HUMAN_TEMPLATE =
    `The previous conversation is an interaction between a customer support representative and a user.
Extract whether the representative is routing the user to a billing or technical team, or whether they are just responding conversationally.
Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:

If they want to route the user to the billing team, respond only with the word "BILLING".
If they want to route the user to the technical team, respond only with the word "TECHNICAL".
Otherwise, respond only with the word "RESPOND".`;
  const categorizationResponse = await model.invoke([{
      role: "system",
      content: CATEGORIZATION_SYSTEM_TEMPLATE,
    },
      ...state.messages,
      {
        role: "user",
        content: CATEGORIZATION_HUMAN_TEMPLATE,
      }],
    {
      response_format: {
        type: "json_object",
        schema: zodToJsonSchema(
          z.object({
            nextRepresentative: z.enum(["BILLING", "TECHNICAL", "RESPOND"]),
          })
        )
      }
    });

  const categorizationOutput = JSON.parse(categorizationResponse.content);
  // Will append the response message to the current interaction state
  return { messages: [supportResponse], nextRepresentative: categorizationOutput.nextRepresentative };
};
