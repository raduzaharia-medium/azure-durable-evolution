export default async (context) => context.bindings.params.array.map((e) => e.toFixed(2));
