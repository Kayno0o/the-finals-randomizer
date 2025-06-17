export function html(template: string, args: Record<string, string>) {
  let result = template

  for (const key of Object.keys(args)) {
    result = result.replaceAll(`[${key}]`, args[key])
  }

  return result
}
