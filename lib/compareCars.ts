import { CarPublicResponse } from './api'

export interface ComparisonResult {
  field: string
  label: string
  car1Value: string | number | null
  car2Value: string | number | null
  car1Better?: boolean
  car2Better?: boolean
  isNumeric?: boolean
}

export function compareCars(car1: CarPublicResponse, car2: CarPublicResponse): ComparisonResult[] {
  const comparisons: ComparisonResult[] = []

  // Price comparison
  comparisons.push({
    field: 'price',
    label: 'Price',
    car1Value: car1.price,
    car2Value: car2.price,
    car1Better: car1.price !== null && car2.price !== null ? car1.price < car2.price : undefined,
    car2Better: car1.price !== null && car2.price !== null ? car2.price < car1.price : undefined,
    isNumeric: true,
  })

  // Registered Year comparison
  comparisons.push({
    field: 'registered_year',
    label: 'Registered Year',
    car1Value: car1.registered_year,
    car2Value: car2.registered_year,
    car1Better: car1.registered_year !== null && car2.registered_year !== null ? car1.registered_year > car2.registered_year : undefined,
    car2Better: car1.registered_year !== null && car2.registered_year !== null ? car2.registered_year > car1.registered_year : undefined,
    isNumeric: true,
  })

  // Mileage comparison (lower is better)
  comparisons.push({
    field: 'mileage',
    label: 'Mileage',
    car1Value: car1.mileage,
    car2Value: car2.mileage,
    car1Better: car1.mileage !== null && car2.mileage !== null ? car1.mileage < car2.mileage : undefined,
    car2Better: car1.mileage !== null && car2.mileage !== null ? car2.mileage < car1.mileage : undefined,
    isNumeric: true,
  })

  // Brand comparison
  comparisons.push({
    field: 'brand',
    label: 'Brand',
    car1Value: car1.brand,
    car2Value: car2.brand,
  })

  // Model comparison
  comparisons.push({
    field: 'model',
    label: 'Model',
    car1Value: car1.model,
    car2Value: car2.model,
  })

  // Make comparison
  comparisons.push({
    field: 'make',
    label: 'Make',
    car1Value: car1.make,
    car2Value: car2.make,
  })

  // Fuel Type comparison
  comparisons.push({
    field: 'fuel_type',
    label: 'Fuel Type',
    car1Value: car1.fuel_type,
    car2Value: car2.fuel_type,
  })

  // Color comparison
  comparisons.push({
    field: 'color',
    label: 'Color',
    car1Value: car1.color,
    car2Value: car2.color,
  })

  // Wheel Drive comparison
  comparisons.push({
    field: 'wheel_drive',
    label: 'Wheel Drive',
    car1Value: car1.wheel_drive,
    car2Value: car2.wheel_drive,
  })

  return comparisons
}

