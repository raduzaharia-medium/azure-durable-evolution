import { EntityId, orchestrator } from "durable-functions";

// each call evolves the population once
// the state is saved across calls in the evolution-state durable entity
export default orchestrator(function* (context) {
  const state = new EntityId("evolution-state-entity", `evolution-state`);
  let population = yield context.df.callEntity(state, "getPopulation");

  if (population.length === 0) {
    const newPopulation = yield context.df.callSubOrchestrator("get-random-matrix-orchestrator", {
      length: 5,
      width: 10,
    });
    yield context.df.callEntity(state, "setPopulation", newPopulation);
  }
  population = yield context.df.callEntity(state, "getPopulation");

  const nextGeneration = [];
  const currentBest = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", { vectors: population });
  const mutant = yield context.df.callActivity("mutation-activity", { individual: currentBest, probability: 0.2 });
  const best = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", {
    vectors: [currentBest, mutant],
  });
  nextGeneration.push(best);

  const tasks = [];
  for (const element of population) {
    const other = population[Math.round(Math.random() * (population.length - 1))];
    tasks.push(
      context.df.callSubOrchestrator("create-child-orchestrator", {
        parent1: element,
        parent2: other,
        mutationProbability: 0.2,
      })
    );
  }
  const children = yield context.df.Task.all(tasks);

  for (const element of children) if (element) nextGeneration.push(element);
  yield context.df.callEntity(state, "setPopulation", nextGeneration);

  const finalBest = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", { vectors: nextGeneration });
  const fitness = yield context.df.callActivity("get-fitness-activity", { individual: finalBest });
  return { result: finalBest, fitness };
});
