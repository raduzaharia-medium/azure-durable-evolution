export default async (context) => {
  const sum = context.bindings.params.individual.reduceRight((result, e) => result + e, 0);
  return Math.abs(sum - 50);
};
