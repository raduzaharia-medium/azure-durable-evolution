import { orchestrator } from "durable-functions";

// each call evolves the population once
// the state is saved across calls in the evolution-state durable entity
export default orchestrator(function* (context) {
  // const state = new EntityId("evolution-state-entity", `evolution-state-${context.invocationId}`);
  let population = yield context.df.callSubOrchestrator("get-random-matrix-orchestrator", {
    length: 5,
    width: 10,
  });
  let finalBest = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", { vectors: population });
  let fitness = yield context.df.callActivity("get-fitness-activity", { individual: finalBest });
  // yield context.df.callEntity(state, "setPopulation", population);
  context.df.setCustomStatus({ partialResult: finalBest, fitness, populationLength: population.length });

  while (fitness > 1) {
    population = yield context.df.callSubOrchestrator("evolution-step-orchestrator", { population });
    // yield context.df.callEntity(state, "setPopulation", population);

    finalBest = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", { vectors: population });
    fitness = yield context.df.callActivity("get-fitness-activity", { individual: finalBest });

    context.df.setCustomStatus({ partialResult: finalBest, fitness, populationLength: population.length });
  }

  return { result: finalBest, fitness };
});
