import { StateGraph, MemorySaver } from '@langchain/langgraph';
import { initialSupport } from './nodes/initial-support.js';
import { billingSupport } from './nodes/billing-support.js';
import { technicalSupport } from './nodes/technical-support.js';
import { handleRefund } from './nodes/handle-refund.js';
import { StateAnnotation } from '../state.js';

// # Adding the nodes
let builder = new StateGraph(StateAnnotation)
  .addNode('initial_support', initialSupport)
  .addNode('billing_support', billingSupport)
  .addNode('technical_support', technicalSupport)
  .addNode('handle_refund', handleRefund)
  .addEdge('__start__', 'initial_support');

// # Defining the edges

// ## Conditional edges
/*
  This is adding a conditional edge from the 'initial_support' node based on the state.

  If the state.nextRepresentative includes 'BILLING', transition to 'billing_support',
  If the state.nextRepresentative includes 'TECHNICAL', transition to 'technical_support'.

  Otherwise we can treat the conversation as 'conversational' and just transition to '__end__' aka, end the conversation.
 */
builder = builder.addConditionalEdges('initial_support', async (state) => {
  if (state.nextRepresentative?.includes('BILLING')) {
    return 'billing';
  } else if (state.nextRepresentative?.includes('TECHNICAL')) {
    return 'technical';
  } else {
    return 'conversational';
  }
}, {
  billing: 'billing_support',
  technical: 'technical_support',
  conversational: '__end__',
});

/*
 From billing_support, we can transition to 'handle_refund' if the state.nextRepresentative includes 'REFUND'
 or transition to '__end__' if it does not.
*/
builder.addConditionalEdges('billing_support', async (state) => {
  if (state.nextRepresentative?.includes('REFUND')) {
    return 'refund';
  } else {
    return '__end__';
  }
}, {
  refund: 'handle_refund',
  __end__: '__end__',
});


// ## Static Edges
// Here we add an edge to the 'technical_support' node so we always transition to '__end__' from this node.
builder.addEdge('technical_support', '__end__').addEdge('handle_refund', '__end__')

const checkPointer = new MemorySaver();

export const graph = builder.compile({
  checkPointer
});
