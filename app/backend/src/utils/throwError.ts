export default class ThrowError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) { super(); }
}
