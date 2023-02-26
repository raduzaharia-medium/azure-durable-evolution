import { entity } from "durable-functions";

export default entity(function (context) {
  const population = context.df.getState(() => []);
  const value = context.df.getInput();

  switch (context.df.operationName) {
    case "setPopulation":
      context.df.setState(value);
      break;
    case "getPopulation":
      context.df.return(population);
      break;
  }
});
