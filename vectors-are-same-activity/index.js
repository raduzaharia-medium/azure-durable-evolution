export default async (context) => {
  if (!context.bindings.params.a || !context.bindings.params.b) return false;
  if (context.bindings.params.a.length !== context.bindings.params.b.length) return false;

  let result = true;

  for (let i = 0; i < context.bindings.params.a.length; i++)
    if (context.bindings.params.a[i] !== context.bindings.params.b[i]) result = false;

  return { result };
};
