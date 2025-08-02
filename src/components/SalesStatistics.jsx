import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import OrderContext from '../contexts/OrderProvider';

const SalesStatistics = () => {
  const { orders } = useContext(OrderContext);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateSalesStats = () => {
      const productStats = {};

      // Filter orders by completed status and calculate total sales for each product
      orders
        .filter(order => order.orderStatus === 'Completed')
        .forEach(order => {
          if (order.orderItems) {
            order.orderItems.forEach(item => {
              const productId = item.cakeId;
              const productName = item.cakeName;
              const quantity = item.quantity || 1;
              const price = item.cakePrice || 0;

              if (!productStats[productId]) {
                productStats[productId] = {
                  id: productId,
                  name: productName,
                  totalSold: 0,
                  totalRevenue: 0,
                  image: item.cakeImage || '/default-cake.jpg'
                };
              }

              productStats[productId].totalSold += quantity;
              productStats[productId].totalRevenue += quantity * price;
            });
          }
        });

      // Convert to array and sort by total sold
      const sortedStats = Object.values(productStats)
        .sort((a, b) => b.totalSold - a.totalSold)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
          trend: index < 3 ? 'up' : index < 6 ? 'stable' : 'down'
        }));

      setSalesData(sortedStats);
      setLoading(false);
    };

    calculateSalesStats();
  }, [orders]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <Remove color="warning" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Sales Statistics
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Quantity Sold</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Revenue</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.length > 0 ? (
                salesData.map((product) => (
                  <TableRow 
                    key={product.id}
                    sx={{ 
                      '&:hover': { backgroundColor: 'grey.50' },
                      backgroundColor: product.rank <= 3 ? 'success.light' : 'transparent'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={`#${product.rank}`}
                          color={product.rank <= 3 ? 'primary' : 'default'}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="primary">
                        {product.totalSold}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="success.main">
                        NZ${product.totalRevenue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getTrendIcon(product.trend)}
                        label={product.trend === 'up' ? 'Hot' : product.trend === 'down' ? 'Slow' : 'Normal'}
                        color={getTrendColor(product.trend)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No sales data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {salesData.length > 0 && (
        <Box mt={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Sales Overview
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Product Types
                </Typography>
                <Typography variant="h5" color="primary">
                  {salesData.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Quantity Sold
                </Typography>
                <Typography variant="h5" color="success.main">
                  {salesData.reduce((sum, item) => sum + item.totalSold, 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="h5" color="success.main">
                  NZ${salesData.reduce((sum, item) => sum + item.totalRevenue, 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default SalesStatistics;
