import express from 'express';
import { graph } from './graph/index.js';
import { verifyHasUserInput } from '../../shared/middleware/validate-user.middleware.js';
import { extractResponseContent, processStream } from './chat.js';

const router = express.Router();

// waits for all operations to complete, then returns 1 response
router.post('/customer-request-static', verifyHasUserInput, async (req, res) => {
  const { userInput } = req.body;

  try {
    const result = await processStream(userInput, graph);
    console.log('Result:', result);
    res.send({ result });
  } catch (error) {
    console.log('Error processing text:', error);
    res.status(500).send({ error: 'An error ocurred. Lets try that again, how can I help you?' });
  }
});

// streams responses as they are processed
router.post('/customer-request-stream', verifyHasUserInput, async (req, res) => {
  const { userInput } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await graph.stream({
      messages: [
        {
          role: 'user',
          content: userInput,
        }
      ]
    }, {
      configurable: {
        thread_id: 'text_processing_id'
      }
    });

    for await (const value of stream) {
      console.log('---STEP-STREAM---');
      const formattedResponse = extractResponseContent(value);

      const jsonData = JSON.stringify({
        data: {
          id: formattedResponse.id,
          node: formattedResponse.node,
          message: `AI response: ${formattedResponse.content}`,
          nextRepresentative: `Next representative: ${formattedResponse.nextRepresentative.toLowerCase()}`
        }
      });

      res.write(`data: ${jsonData}\n\n`);

      console.log('---END STEP-STREAM--');
    }

    res.write('event: end\n data: Stream ended\n\n');
    res.end();
  } catch (error) {
    console.log('Error processing text:', error);
    const errorData = JSON.stringify({
      errorMessage: 'Error processing text',
      error
    });
    res.write(`event: error\ndata: Error processing text: Error:  ${errorData}\n\n`);
    res.end();
  }
});

export default router;


