import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBillsAndCategories();
  }, []);

  const fetchBillsAndCategories = async () => {
    try {
      const [billsRes, categoriesRes] = await Promise.all([
        axios.get('/api/bills'),
        axios.get('/api/bills/categories')
      ]);
      setBills(billsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = (bill) => {
    setSelectedBill(bill);
    setPaymentAmount(bill.amountDue.toString());
    setShowPayModal(true);
  };

  const processPayment = async () => {
    try {
      await axios.post('/api/bills/pay', {
        billId: selectedBill._id,
        amount: parseFloat(paymentAmount),
        paymentDate: new Date().toISOString()
      });
      
      setShowPayModal(false);
      setSelectedBill(null);
      setPaymentAmount('');
      fetchBillsAndCategories(); // Refresh bills
      
      setError('');
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
      scheduled: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electricity: 'fas fa-bolt',
      water: 'fas fa-tint',
      internet: 'fas fa-wifi',
      phone: 'fas fa-phone',
      credit: 'fas fa-credit-card',
      loan: 'fas fa-hand-holding-usd',
      insurance: 'fas fa-shield-alt',
      other: 'fas fa-file-invoice'
    };
    return icons[category] || 'fas fa-file-invoice';
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
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="h2">Bill Payments</h1>
                  <p className="mb-0">Manage and pay your bills in one place</p>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="light" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus me-2"></i>
                    Add New Bill
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>
        {error}
      </Alert>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Due</h6>
                  <h3 className="mb-0">
                    ${bills.reduce((sum, bill) => sum + bill.amountDue, 0).toFixed(2)}
                  </h3>
                </div>
                <div className="bg-danger rounded-circle p-3">
                  <i className="fas fa-money-bill-wave fa-2x text-white"></i>
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
                  <h6 className="text-muted">Overdue</h6>
                  <h3 className="mb-0">
                    ${bills
                      .filter(bill => bill.status === 'overdue')
                      .reduce((sum, bill) => sum + bill.amountDue, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <div className="bg-warning rounded-circle p-3">
                  <i className="fas fa-exclamation-triangle fa-2x text-white"></i>
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
                  <h6 className="text-muted">Scheduled</h6>
                  <h3 className="mb-0">
                    ${bills
                      .filter(bill => bill.status === 'scheduled')
                      .reduce((sum, bill) => sum + bill.amountDue, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <div className="bg-info rounded-circle p-3">
                  <i className="fas fa-calendar-alt fa-2x text-white"></i>
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
                  <h6 className="text-muted">Paid This Month</h6>
                  <h3 className="mb-0">
                    ${bills
                      .filter(bill => bill.status === 'paid' && 
                        new Date(bill.paymentDate).getMonth() === new Date().getMonth())
                      .reduce((sum, bill) => sum + bill.amount, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <div className="bg-success rounded-circle p-3">
                  <i className="fas fa-check-circle fa-2x text-white"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bills Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Card.Title className="mb-0">My Bills</Card.Title>
                <Form.Group className="mb-0" style={{ width: '200px' }}>
                  <Form.Select>
                    <option>All Bills</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                    <option>Paid</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Bill</th>
                    <th>Provider</th>
                    <th>Due Date</th>
                    <th>Amount Due</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                            <i className={`${getCategoryIcon(bill.category)} text-primary`}></i>
                          </div>
                          <div>
                            <strong>{bill.name}</strong>
                            <div className="text-muted small text-capitalize">{bill.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>{bill.provider}</td>
                      <td>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</td>
                      <td className="fw-bold">${bill.amountDue.toFixed(2)}</td>
                      <td>{getStatusBadge(bill.status)}</td>
                      <td>
                        {bill.status !== 'paid' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handlePayBill(bill)}
                            disabled={bill.status === 'scheduled'}
                          >
                            {bill.status === 'scheduled' ? 'Scheduled' : 'Pay Now'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pay Bill Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBill && (
            <>
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-block mb-3">
                  <i className={`${getCategoryIcon(selectedBill.category)} fa-3x text-primary`}></i>
                </div>
                <h4>{selectedBill.name}</h4>
                <p className="text-muted">{selectedBill.provider}</p>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Bill Details</Form.Label>
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Due Date:</span>
                      <strong>{format(new Date(selectedBill.dueDate), 'MMM dd, yyyy')}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Reference Number:</span>
                      <strong>{selectedBill.reference}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Status:</span>
                      {getStatusBadge(selectedBill.status)}
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    max={selectedBill.amountDue}
                  />
                  <Form.Text className="text-muted">
                    Maximum: ${selectedBill.amountDue.toFixed(2)}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>From Account</Form.Label>
                  <Form.Select>
                    <option>Select account...</option>
                    <option>Checking Account - ****1234</option>
                    <option>Savings Account - ****5678</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPayModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={processPayment}
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Bill Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bill Name</Form.Label>
                  <Form.Control type="text" placeholder="e.g., Electricity Bill" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select>
                    <option>Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Provider</Form.Label>
                  <Form.Control type="text" placeholder="e.g., National Grid" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control type="text" placeholder="Your account with provider" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount Due</Form.Label>
                  <Form.Control type="number" placeholder="0.00" min="0" step="0.01" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Payment Frequency</Form.Label>
              <Form.Select>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One Time</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set up auto-pay"
              />
              <Form.Text className="text-muted">
                Bill will be paid automatically on the due date
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(false)}>
            Save Bill
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Bills;