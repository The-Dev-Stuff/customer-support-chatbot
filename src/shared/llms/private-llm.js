import { ChatOllama } from '@langchain/ollama';

class ModelSingleton {
  constructor() {
    if (!ModelSingleton.instance) {
      this.model = new ChatOllama({
        baseUrl: process.env.LLM_MODEL_BASE_URL,
        model: process.env.LLM_MODEL,
        temperature: parseFloat(process.env.LLM_TEMPERATURE || 0)
      });
      ModelSingleton.instance = this;
    }
    return ModelSingleton.instance;
  }

  getModel() {
    return this.model;
  }
}

const llmModal = new ModelSingleton();
Object.freeze(llmModal);

export default llmModal;
