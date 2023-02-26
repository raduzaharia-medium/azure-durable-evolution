import { orchestrator } from "durable-functions";

export default orchestrator(function* (context) {
  const params = context.df.getInput();
  const tasks = [];

  for (let i = 0; i < params.length; i++) {
    tasks.push(context.df.callActivity("get-random-vector-activity", { length: params.width }));
  }

  const result = yield context.df.Task.all(tasks);
  return result;
});
