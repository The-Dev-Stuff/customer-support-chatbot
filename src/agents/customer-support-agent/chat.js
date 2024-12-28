
export const processStream = async (userInput, graph) => {
  const stream = await graph.stream({
    messages: [
      {
        role: "user",
        content: userInput,
      }
    ]
  }, {
    configurable: {
      thread_id: "text_processing_id",
    }
  });

  let result = '';
  for await (const value of stream) {
    result += value;
    console.log("---STEP---");
    console.log(value);
    console.log("---END STEP---");
  }

  return result;
};

export const extractResponseContent = (input) => {
  if (typeof input === 'string') {
    return {
      id: '',
      node: '',
      content: input,
      nextRepresentative: '',
    };
  }

  const fullResponse = JSON.parse(JSON.stringify(input));
  const [ node ] = Object.keys(fullResponse);

  // The last message is an object, not an array
  const message = Array.isArray(fullResponse[node]?.messages) ? fullResponse[node]?.messages[0]?.kwargs : fullResponse[node]?.messages?.kwargs;

  return {
    id: message?.id,
    node,
    content: message?.content?.trim(),
    nextRepresentative: fullResponse[node]?.nextRepresentative,
  };
};
