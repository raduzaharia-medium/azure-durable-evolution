export default async (context) => [...new Array(context.bindings.params.length)].map(() => Math.random());
