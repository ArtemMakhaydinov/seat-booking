export const bigintReplacer = (
  key: string,
  val: unknown,
): Exclude<unknown, 'bigint'> => {
  return typeof val === 'bigint' ? val.toString() : val;
};
