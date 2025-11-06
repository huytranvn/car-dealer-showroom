'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import { CarPublicResponse } from '@/lib/api'
import { compareCars, ComparisonResult } from '@/lib/compareCars'

interface CarComparisonProps {
  car1: CarPublicResponse | null
  car2: CarPublicResponse | null
  open: boolean
  onClose: () => void
  formatPrice: (price: number | null) => string
  formatMileage: (mileage: number | null) => string
}

export default function CarComparison({
  car1,
  car2,
  open,
  onClose,
  formatPrice,
  formatMileage,
}: CarComparisonProps) {
  if (!car1 || !car2) return null

  const comparisons = compareCars(car1, car2)

  const formatValue = (field: string, value: string | number | null, isNumeric?: boolean): string => {
    if (value === null || value === undefined) return 'N/A'

    if (field === 'price') {
      return formatPrice(value as number | null)
    }

    if (field === 'mileage') {
      return formatMileage(value as number | null)
    }

    if (isNumeric && typeof value === 'number') {
      return value.toLocaleString()
    }

    return String(value)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Compare Cars
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Car 1 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="div"
                image={car1.display_image_url || undefined}
                sx={{
                  height: 200,
                  backgroundColor: 'grey.200',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!car1.display_image_url && (
                  <Typography variant="h6" color="text.secondary">
                    {car1.brand} {car1.model}
                  </Typography>
                )}
              </CardMedia>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {car1.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip label={car1.brand} size="small" color="primary" variant="outlined" />
                  <Chip label={car1.make} size="small" />
                </Box>
                <Typography variant="h6" color="primary.main">
                  {formatPrice(car1.price)}
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Car 2 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="div"
                image={car2.display_image_url || undefined}
                sx={{
                  height: 200,
                  backgroundColor: 'grey.200',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!car2.display_image_url && (
                  <Typography variant="h6" color="text.secondary">
                    {car2.brand} {car2.model}
                  </Typography>
                )}
              </CardMedia>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {car2.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip label={car2.brand} size="small" color="primary" variant="outlined" />
                  <Chip label={car2.make} size="small" />
                </Box>
                <Typography variant="h6" color="primary.main">
                  {formatPrice(car2.price)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Comparison Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableBody>
              {comparisons.map((comparison) => (
                <TableRow key={comparison.field}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: 600, width: '30%' }}
                  >
                    {comparison.label}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: comparison.car1Better
                        ? 'rgba(76, 175, 80, 0.1)'
                        : comparison.car2Better
                        ? 'grey.100'
                        : 'transparent',
                      fontWeight: comparison.car1Better ? 600 : 400,
                    }}
                  >
                    {formatValue(comparison.field, comparison.car1Value, comparison.isNumeric)}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: comparison.car2Better
                        ? 'rgba(76, 175, 80, 0.1)'
                        : comparison.car1Better
                        ? 'grey.100'
                        : 'transparent',
                      fontWeight: comparison.car2Better ? 600 : 400,
                    }}
                  >
                    {formatValue(comparison.field, comparison.car2Value, comparison.isNumeric)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

