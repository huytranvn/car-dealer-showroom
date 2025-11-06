'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    Slider,
    Grid,
    Paper,
} from '@mui/material'

interface LoanCalculatorProps {
    open: boolean
    onClose: () => void
    price: number | null
    carName?: string
}

export default function LoanCalculator({ open, onClose, price, carName }: LoanCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState<number>(0)
    const [interestRate, setInterestRate] = useState<number>(5.99)
    const [loanPeriod, setLoanPeriod] = useState<number>(8)
    const [downPayment, setDownPayment] = useState<number>(0)
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
    const [totalInterest, setTotalInterest] = useState<number>(0)
    const [totalAmount, setTotalAmount] = useState<number>(0)

    useEffect(() => {
        if (price !== null) {
            setLoanAmount(price)
            // Set default down payment to 20% of the price
            setDownPayment(Math.round(price * 0.2))
        }
    }, [price])

    useEffect(() => {
        calculateLoan()
    }, [loanAmount, interestRate, loanPeriod, downPayment])

    const calculateLoan = () => {
        if (loanAmount <= 0 || loanPeriod <= 0) {
            setMonthlyPayment(0)
            setTotalInterest(0)
            setTotalAmount(0)
            return
        }

        const principal = loanAmount - downPayment
        if (principal <= 0) {
            setMonthlyPayment(0)
            setTotalInterest(0)
            setTotalAmount(downPayment)
            return
        }

        // Convert annual interest rate to monthly
        const monthlyRate = interestRate / 100 / 12
        // Number of monthly payments
        const numberOfPayments = loanPeriod * 12

        // Calculate monthly payment using the formula:
        // M = P * [r(1+r)^n] / [(1+r)^n - 1]
        const monthlyPaymentAmount =
            principal *
            ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1))

        const totalPaid = monthlyPaymentAmount * numberOfPayments + downPayment
        const totalInterestPaid = totalPaid - loanAmount

        setMonthlyPayment(monthlyPaymentAmount)
        setTotalInterest(totalInterestPaid)
        setTotalAmount(totalPaid)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleLoanAmountChange = (value: number) => {
        if (price !== null && value > price) {
            setLoanAmount(price)
        } else {
            setLoanAmount(value)
        }
    }

    const handleDownPaymentChange = (value: number) => {
        if (value < 0) {
            setDownPayment(0)
        } else if (loanAmount > 0 && value > loanAmount) {
            setDownPayment(loanAmount)
        } else {
            setDownPayment(value)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Loan Calculator
                </Typography>
                {carName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {carName}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent>
                {price === null ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                        Price information not available for loan calculation.
                    </Typography>
                ) : (
                    <>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Loan Amount (SEK)"
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => handleLoanAmountChange(parseFloat(e.target.value) || 0)}
                                    fullWidth
                                    inputProps={{ min: 0, max: price }}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Down Payment (SEK)"
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value) || 0)}
                                    fullWidth
                                    inputProps={{ min: 0, max: loanAmount }}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ mb: 2 }}>
                                    <Typography gutterBottom>
                                        Interest Rate: {interestRate.toFixed(2)}% per year
                                    </Typography>
                                    <Slider
                                        value={interestRate}
                                        onChange={(_, value) => setInterestRate(value as number)}
                                        min={0}
                                        max={20}
                                        step={0.1}
                                        marks={[
                                            { value: 0, label: '0%' },
                                            { value: 5, label: '5%' },
                                            { value: 10, label: '10%' },
                                            { value: 15, label: '15%' },
                                            { value: 20, label: '20%' },
                                        ]}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography gutterBottom>
                                        Loan Period: {loanPeriod} years
                                    </Typography>
                                    <Slider
                                        value={loanPeriod}
                                        onChange={(_, value) => setLoanPeriod(value as number)}
                                        min={1}
                                        max={10}
                                        step={1}
                                        marks={[
                                            { value: 1, label: '1yr' },
                                            { value: 3, label: '3yr' },
                                            { value: 5, label: '5yr' },
                                            { value: 8, label: '8yr' },
                                            { value: 10, label: '10yr' },
                                        ]}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Monthly Payment
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" sx={{ mb: 3 }}>
                                        {formatCurrency(monthlyPayment)}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Principal Amount
                                            </Typography>
                                            <Typography variant="h6">
                                                {formatCurrency(loanAmount - downPayment)}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Interest
                                            </Typography>
                                            <Typography variant="h6" color="error.main">
                                                {formatCurrency(totalInterest)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Amount (Principal + Interest)
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold">
                                                {formatCurrency(totalAmount)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

