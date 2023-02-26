import { orchestrator } from "durable-functions";

export default orchestrator(function* (context) {
  const params = context.df.getInput();

  const identicalParents = yield context.df.callActivity("vectors-are-same-activity", {
    a: params.parent1,
    b: params.parent2,
  });

  if (identicalParents.result) return null;

  const crossPoint = Math.round(Math.random() * params.parent1.length);
  const child = yield context.df.callActivity("crossover-activity", {
    parent1: params.parent1,
    parent2: params.parent2,
    crossPoint,
  });
  const mutant = yield context.df.callActivity("mutation-activity", {
    individual: child,
    probability: params.mutationProbability,
  });
  const best = yield context.df.callSubOrchestrator("pick-best-vector-orchestrator", {
    vectors: [params.parent1, params.parent2, child, mutant],
  });

  return best;
});
