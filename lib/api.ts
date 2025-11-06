export interface CarPublicResponse {
  id: number
  name: string
  brand: string
  model: string
  make: string
  fuel_type: string
  color: string
  price: number | null
  registered_year: number | null
  mileage: number | null
  wheel_drive: string | null
  external_link: string | null
  display_image_url: string | null
}

export interface PaginatedPublicResponse {
  items: CarPublicResponse[]
  total: number
  limit: number
  offset: number
}

export interface CarsQueryParams {
  limit?: number
  offset?: number
  order_by?: 'price' | 'price_desc' | 'registered_year' | 'registered_year_desc'
  max_price?: number
  year?: number
  wheel_drive?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchCars(params: CarsQueryParams = {}): Promise<PaginatedPublicResponse> {
  const queryParams = new URLSearchParams()

  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.offset) queryParams.append('offset', params.offset.toString())
  if (params.order_by) queryParams.append('order_by', params.order_by)
  if (params.max_price) queryParams.append('max_price', params.max_price.toString())
  if (params.year) queryParams.append('year', params.year.toString())
  if (params.wheel_drive) queryParams.append('wheel_drive', params.wheel_drive)

  const url = `${API_BASE_URL}/v1/cars/public?${queryParams.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch cars: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchCarById(id: number): Promise<CarPublicResponse | null> {
  // Fetch with a large limit to find the car, then filter client-side
  // In a real app, you'd have a dedicated endpoint for this
  try {
    const data = await fetchCars({ limit: 1000 })
    const car = data.items.find((c) => c.id === id)
    return car || null
  } catch (error) {
    console.error('Failed to fetch car:', error)
    return null
  }
}

