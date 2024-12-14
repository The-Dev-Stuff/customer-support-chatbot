import { ChatOllama } from "@langchain/ollama";

class ModelSingleton {
  constructor() {
    if (!ModelSingleton.instance) {
      this.model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "mistral"
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
