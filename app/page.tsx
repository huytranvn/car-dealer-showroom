'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Pagination,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from '@mui/material'
import { CompareArrows, Close, Calculate } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { fetchCars, CarPublicResponse, CarsQueryParams } from '@/lib/api'
import CarComparison from '@/components/CarComparison'
import LoanCalculator from '@/components/LoanCalculator'

const ITEMS_PER_PAGE = 12

export default function Home() {
  const router = useRouter()
  const [cars, setCars] = useState<CarPublicResponse[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState<CarsQueryParams['order_by'] | ''>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [wheelDrive, setWheelDrive] = useState<string>('')
  const [selectedCars, setSelectedCars] = useState<CarPublicResponse[]>([])
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [loanCalculatorOpen, setLoanCalculatorOpen] = useState(false)
  const [selectedCarForLoan, setSelectedCarForLoan] = useState<CarPublicResponse | null>(null)

  const fetchCarsData = async () => {
    setLoading(true)
    setError(null)

    try {
      const params: CarsQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      }

      if (orderBy) {
        params.order_by = orderBy
      }

      if (maxPrice) {
        const price = parseFloat(maxPrice)
        if (!isNaN(price) && price > 0) {
          params.max_price = price
        }
      }

      if (year) {
        const yearNum = parseInt(year)
        if (!isNaN(yearNum)) {
          params.year = yearNum
        }
      }

      if (wheelDrive) {
        params.wheel_drive = wheelDrive
      }

      const data = await fetchCars(params)
      setCars(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cars')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarsData()
  }, [page, orderBy, maxPrice, year, wheelDrive])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleOrderByChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    setOrderBy(value === '' ? '' : (value as CarsQueryParams['order_by']))
    setPage(1) // Reset to first page when sorting changes
  }

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(event.target.value)
    setPage(1) // Reset to first page when filter changes
  }

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value)
    setPage(1) // Reset to first page when filter changes
  }

  const handleWheelDriveChange = (event: SelectChangeEvent<string>) => {
    setWheelDrive(event.target.value)
    setPage(1) // Reset to first page when filter changes
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Price not available'
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number | null) => {
    if (mileage === null) return 'N/A'
    const mileageKm = mileage * 10
    return `${mileageKm.toLocaleString()} km`
  }

  const handleCompareClick = (car: CarPublicResponse) => {
    if (selectedCars.find((c) => c.id === car.id)) {
      // Remove car if already selected
      setSelectedCars(selectedCars.filter((c) => c.id !== car.id))
    } else if (selectedCars.length < 2) {
      // Add car if less than 2 selected
      setSelectedCars([...selectedCars, car])
    } else {
      // Show message if already 2 cars selected
      setSnackbarMessage('You can only compare 2 cars at a time. Remove one to add another.')
      setSnackbarOpen(true)
    }
  }

  const handleRemoveCar = (carId: number) => {
    setSelectedCars(selectedCars.filter((c) => c.id !== carId))
  }

  const handleOpenComparison = () => {
    if (selectedCars.length === 2) {
      setComparisonOpen(true)
    }
  }

  const handleCloseComparison = () => {
    setComparisonOpen(false)
  }

  const handleOpenLoanCalculator = (car: CarPublicResponse) => {
    setSelectedCarForLoan(car)
    setLoanCalculatorOpen(true)
  }

  const handleCloseLoanCalculator = () => {
    setLoanCalculatorOpen(false)
    setSelectedCarForLoan(null)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Car Showroom
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse our collection of {total} cars
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={orderBy}
              label="Sort By"
              onChange={handleOrderByChange}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="price">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="registered_year">Year: Oldest First</MenuItem>
              <MenuItem value="registered_year_desc">Year: Newest First</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={handleYearChange}
            >
              <MenuItem value="">All Years</MenuItem>
              {Array.from({ length: 2026 - 2019 + 1 }, (_, i) => 2019 + i).map((y) => (
                <MenuItem key={y} value={String(y)}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Wheel Drive</InputLabel>
            <Select
              value={wheelDrive}
              label="Wheel Drive"
              onChange={handleWheelDriveChange}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="rear wheel drive">Rear Wheel Drive</MenuItem>
              <MenuItem value="4x4">4x4</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Max Price (SEK)"
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            sx={{ minWidth: 200 }}
            placeholder="e.g., 500000"
          />

          {selectedCars.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {selectedCars.map((car) => (
                  <Chip
                    key={car.id}
                    label={`${car.brand} ${car.model}`}
                    onDelete={() => handleRemoveCar(car.id)}
                    deleteIcon={<Close />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {selectedCars.length === 2 && (
                <Button
                  variant="contained"
                  startIcon={<CompareArrows />}
                  onClick={handleOpenComparison}
                  sx={{ ml: 1 }}
                >
                  Compare
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Alert severity="info">
          No cars found matching your criteria.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {cars.map((car) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={car.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component={'div'}
                    image={car.display_image_url || undefined}
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      objectFit: 'cover',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    >
                      {formatPrice(car.price)}
                    </Box>
                    {!car.display_image_url && (
                      <Typography variant="h6" color="text.secondary">
                        {car.brand} {car.model}
                      </Typography>
                    )}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {car.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip label={car.brand} size="small" color="primary" variant="outlined" />
                      <Chip label={car.make} size="small" />
                      {car.fuel_type && (
                        <Chip label={car.fuel_type} size="small" />
                      )}
                      {car.color && (
                        <Chip label={car.color} size="small" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>
                      {car.registered_year && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Year:</strong> {car.registered_year}
                        </Typography>
                      )}
                      {car.mileage !== null && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Mileage:</strong> {formatMileage(car.mileage)}
                        </Typography>
                      )}
                      {car.wheel_drive && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Drive:</strong> {car.wheel_drive}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant={selectedCars.find((c) => c.id === car.id) ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<CompareArrows />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompareClick(car)
                        }}
                        sx={{ flex: 1 }}
                      >
                        {selectedCars.find((c) => c.id === car.id) ? 'Selected' : 'Compare'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Calculate />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenLoanCalculator(car)
                        }}
                        color="secondary"
                      >
                        Loan
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <CarComparison
        car1={selectedCars[0] || null}
        car2={selectedCars[1] || null}
        open={comparisonOpen}
        onClose={handleCloseComparison}
        formatPrice={formatPrice}
        formatMileage={formatMileage}
      />

      <LoanCalculator
        open={loanCalculatorOpen}
        onClose={handleCloseLoanCalculator}
        price={selectedCarForLoan?.price || null}
        carName={selectedCarForLoan?.name}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  )
}

