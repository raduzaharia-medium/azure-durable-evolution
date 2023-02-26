import { orchestrator } from "durable-functions";

export default orchestrator(function* (context) {
  const params = context.df.getInput();
  const tasks = [];

  for (let i = 0; i < params.vectors.length; i++) {
    tasks.push(context.df.callActivity("get-fitness-activity", { individual: params.vectors[i] }));
  }

  const fitness = yield context.df.Task.all(tasks);

  let bestFitnessIndex = 0;
  for (let i = 0; i < fitness.length; i++) {
    if (fitness[i] < fitness[bestFitnessIndex]) bestFitnessIndex = i;
  }

  return params.vectors[bestFitnessIndex];
});
