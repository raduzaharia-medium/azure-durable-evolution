export default async (context) =>
  context.bindings.params.individual.map((e) =>
    Math.random() < context.bindings.params.probability ? e * Math.random() + Math.random() : e
  );
