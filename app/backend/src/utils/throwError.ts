export default class ThrowError extends Error {
  constructor(
    public status: number,
    message: string,
  ) { super(message); }
}
