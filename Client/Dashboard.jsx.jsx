import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        axios.get('/api/accounts'),
        axios.get('/api/transactions/recent')
      ]);
      setAccounts(accountsRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const spendingData = {
    labels: ['Food', 'Shopping', 'Bills', 'Entertainment', 'Transport'],
    datasets: [{
      data: [300, 450, 200, 150, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const balanceHistory = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Balance',
      data: [5000, 5200, 5100, 5300, 5400, totalBalance],
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4
    }]
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="h2">Welcome back, {user?.firstName}!</h1>
                  <p className="mb-0">Here's your financial overview</p>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="light" className="me-2">
                    <i className="fas fa-plus me-2"></i>
                    New Account
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Balance</h6>
                  <h3 className="mb-0">${totalBalance.toFixed(2)}</h3>
                </div>
                <div className="bg-primary rounded-circle p-3">
                  <i className="fas fa-wallet fa-2x text-white"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Monthly Income</h6>
                  <h3 className="mb-0">$4,500.00</h3>
                </div>
                <div className="bg-success rounded-circle p-3">
                  <i className="fas fa-arrow-down fa-2x text-white"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Monthly Expenses</h6>
                  <h3 className="mb-0">$2,300.00</h3>
                </div>
                <div className="bg-warning rounded-circle p-3">
                  <i className="fas fa-arrow-up fa-2x text-white"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Savings Goal</h6>
                  <h3 className="mb-0">75%</h3>
                </div>
                <div className="bg-info rounded-circle p-3">
                  <i className="fas fa-bullseye fa-2x text-white"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title>Balance History</Card.Title>
              <Line data={balanceHistory} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title>Spending Categories</Card.Title>
              <Doughnut data={spendingData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accounts & Recent Transactions */}
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">My Accounts</Card.Title>
                <Button variant="link" size="sm">View All</Button>
              </div>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Number</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(account => (
                    <tr key={account._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle p-2 me-3 bg-${account.type === 'checking' ? 'primary' : 'success'} bg-opacity-10`}>
                            <i className={`fas fa-${account.type === 'checking' ? 'university' : 'piggy-bank'} text-${account.type === 'checking' ? 'primary' : 'success'}`}></i>
                          </div>
                          <div>
                            <strong>{account.name}</strong>
                            <div className="text-muted small">{account.type}</div>
                          </div>
                        </div>
                      </td>
                      <td>****{account.accountNumber.slice(-4)}</td>
                      <td className={`fw-bold ${account.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                        ${account.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Recent Transactions</Card.Title>
                <Button variant="link" size="sm">View All</Button>
              </div>
              <div className="transaction-list">
                {transactions.map(transaction => (
                  <div key={transaction._id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle p-3 me-3 bg-${transaction.type === 'credit' ? 'success' : 'danger'} bg-opacity-10`}>
                        <i className={`fas fa-${transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'} text-${transaction.type === 'credit' ? 'success' : 'danger'}`}></i>
                      </div>
                      <div>
                        <strong>{transaction.description}</strong>
                        <div className="text-muted small">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`fw-bold ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;