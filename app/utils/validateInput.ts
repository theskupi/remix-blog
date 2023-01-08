export function validateInput(input: string, charLength: number) {
  if (typeof input !== 'string' || input.length < charLength) {
    return `This input should be at least ${charLength} characters long.`
  }
}
