export class StudioError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = 'STUDIO_ERROR',
  ) {
    super(message)
    this.name = 'StudioError'
  }
}
