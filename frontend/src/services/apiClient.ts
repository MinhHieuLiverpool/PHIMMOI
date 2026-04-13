export async function getJson<T = unknown>(url: string): Promise<{
  status: number
  data: T
}> {
  const response = await fetch(url)
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    const data = (await response.json()) as T
    return { status: response.status, data }
  }

  const text = await response.text()
  return {
    status: response.status,
    data: { raw: text } as T,
  }
}
