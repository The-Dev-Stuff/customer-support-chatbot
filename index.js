import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "mistral"
});

async function main() {
  try {
    const result = await model.invoke(["Hello, how are you?"], {
      temperature: 0.5,
      stream: false
    });
    console.log('result is', result);
  } catch (error) {
    console.error('Error invoking model:', error);
  }
}

main();
