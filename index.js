import { graph } from './graph/index.js';

const stream = await graph.stream({
  messages: [
    {
      role: "user",
      content: "I've changed my mind and I want a refund for order #182818! Billing item.",
    }
  ]
}, {
  configurable: {
    thread_id: "refund_testing_id",
  }
});

for await (const value of stream) {
  console.log("---STEP---");
  console.log(value);
  console.log("---END STEP---");
}
