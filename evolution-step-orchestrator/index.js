import { orchestrator } from "durable-functions";

export default orchestrator(function* (context) {
  const params = context.df.getInput();
  const population = params.population;
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
  return nextGeneration;
});
