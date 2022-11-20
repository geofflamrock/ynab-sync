//Call this function if you need exhaustive checking in a case statement / bunch of if conditions since the parameter is never you have to handle all cases.
export function exhaustiveCheck(param: never, message: string): never {
  throw new Error(message);
}
