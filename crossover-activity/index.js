export default async (context) => [
  ...context.bindings.params.parent1.slice(0, context.bindings.params.crossPoint),
  ...context.bindings.params.parent2.slice(context.bindings.params.crossPoint, context.bindings.params.parent2.length),
];
