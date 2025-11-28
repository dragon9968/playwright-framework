type AnyMethod = (this: any, ...args: any[]) => any;

export function step(description: string) {
  return function (
    value: AnyMethod,
    context: ClassMethodDecoratorContext
  ) {
    if (context.kind !== 'method') return;

    return {
      get() {
        return async function (...args: any[]) {
          console.log(`Step: ${description}`);
          return await value.apply(this, args);
        };
      }
    };
  };
}
