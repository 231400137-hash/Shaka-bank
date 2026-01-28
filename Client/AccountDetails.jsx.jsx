import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [transactionAmount, setTransactionAmount] = useState('');

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      const [accountRes, transactionsRes] = await Promise.all([
        axios.get(`/api/accounts/${id}`),
        axios.get(`/api/accounts/${id}/transactions`)
      ]);
      setAccount(accountRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    try {
      await axios.post(`/api/accounts/${id}/transactions`, {
        type: transactionType,
        amount: parseFloat(transactionAmount),
        description: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`
      });
      setShowTransactionModal(false);
      setTransactionAmount('');
      fetchAccountDetails(); // Refresh data
    } catch (err) {
      setError('Transaction failed');
    }
  };

  const exportStatement = async () => {
    try {
      const response = await axios.get(`/api/accounts/${id}/statement`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statement-${id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to export statement');
    }
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
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>
        {error}
      </Alert>}

      {/* Account Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <Button variant="link" onClick={() => navigate('/dashboard')} className="mb-3">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </Button>
                  <h1 className="h2">{account?.name}</h1>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-3">{account?.type}</span>
                    <span className="text-muted">Account: ****{account?.accountNumber?.slice(-4)}</span>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <h1 className={`display-5 ${account?.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${account?.balance?.toFixed(2)}
                  </h1>
                  <p className="text-muted">Current Balance</p>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col>
                  <Button variant="primary" className="me-2" onClick={() => {
                    setTransactionType('deposit');
                    setShowTransactionModal(true);
                  }}>
                    <i className="fas fa-plus-circle me-2"></i>
                    Deposit
                  </Button>
                  <Button variant="outline-primary" className="me-2" onClick={() => {
                    setTransactionType('withdrawal');
                    setShowTransactionModal(true);
                  }}>
                    <i className="fas fa-minus-circle me-2"></i>
                    Withdraw
                  </Button>
                  <Button variant="outline-secondary" className="me-2" onClick={exportStatement}>
                    <i className="fas fa-download me-2"></i>
                    Export Statement
                  </Button>
                  <Button variant="outline-danger">
                    <i className="fas fa-lock me-2"></i>
                    Freeze Account
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Account Info Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-3">Available Balance</h6>
              <h3 className="mb-0">${account?.availableBalance?.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-3">Interest Rate</h6>
              <h3 className="mb-0">{account?.interestRate}%</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-3">Last Statement Balance</h6>
              <h3 className="mb-0">${account?.lastStatementBalance?.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-3">Account Created</h6>
              <h3 className="mb-0">{format(new Date(account?.createdAt), 'MMM yyyy')}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Card.Title className="mb-0">Transaction History</Card.Title>
                <Form.Group className="mb-0" style={{ width: '200px' }}>
                  <Form.Select>
                    <option>All Transactions</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Reference</th>
                    <th className="text-end">Amount</th>
                    <th className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction._id}>
                      <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                      <td>
                        <div>
                          <strong>{transaction.description}</strong>
                          {transaction.notes && (
                            <div className="text-muted small">{transaction.notes}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${transaction.category === 'transfer' ? 'info' : 'secondary'}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td>
                        <code>{transaction.reference}</code>
                      </td>
                      <td className={`text-end fw-bold ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                      <td className="text-end">
                        ${transaction.runningBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction Modal */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {transactionType === 'deposit' ? 'Make Deposit' : 'Make Withdrawal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <Form.Text className="text-muted">
                Available balance: ${account?.availableBalance?.toFixed(2)}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={transactionType === 'deposit' ? 'primary' : 'warning'}
            onClick={handleTransaction}
            disabled={!transactionAmount || parseFloat(transactionAmount) <= 0}
          >
            Confirm {transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccountDetails;