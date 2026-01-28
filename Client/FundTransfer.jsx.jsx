import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const FundTransfer = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [transferData, setTransferData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fromAccount = watch('fromAccount');
  const selectedFromAccount = accounts.find(acc => acc._id === fromAccount);

  useEffect(() => {
    fetchAccountsAndBeneficiaries();
  }, []);

  const fetchAccountsAndBeneficiaries = async () => {
    try {
      const [accountsRes, beneficiariesRes] = await Promise.all([
        axios.get('/api/accounts'),
        axios.get('/api/beneficiaries')
      ]);
      setAccounts(accountsRes.data);
      setBeneficiaries(beneficiariesRes.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate available balance
      const fromAccount = accounts.find(acc => acc._id === data.fromAccount);
      if (fromAccount.availableBalance < parseFloat(data.amount)) {
        throw new Error('Insufficient funds');
      }

      // Prepare transfer data
      const transferPayload = {
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        amount: parseFloat(data.amount),
        description: data.description,
        transferType: data.transferType
      };

      setTransferData(transferPayload);

      // Request OTP for verification
      await axios.post('/api/transfer/initiate', transferPayload);
      setShowOTPModal(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Transfer initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndProcessTransfer = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post('/api/transfer/execute', {
        ...transferData,
        otp
      });
      
      setSuccess(`Transfer successful! Reference: ${response.data.reference}`);
      reset();
      setShowOTPModal(false);
      setOtp('');
      setTransferData(null);
      
      // Refresh accounts
      fetchAccountsAndBeneficiaries();
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickTransfer = async (beneficiary) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Generate random amount for demo
      const amount = Math.floor(Math.random() * 100) + 1;
      
      const transferPayload = {
        fromAccount: accounts[0]?._id,
        toAccount: beneficiary.accountNumber,
        amount: amount,
        description: `Quick transfer to ${beneficiary.name}`,
        transferType: 'immediate'
      };

      setTransferData(transferPayload);
      await axios.post('/api/transfer/initiate', transferPayload);
      setShowOTPModal(true);
    } catch (err) {
      setError('Quick transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h2 className="mb-4">Transfer Funds</h2>
              
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>}
              
              {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </Alert>}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>From Account</Form.Label>
                      <Form.Select
                        {...register('fromAccount', { required: 'Please select source account' })}
                        isInvalid={!!errors.fromAccount}
                      >
                        <option value="">Select Account</option>
                        {accounts.map(account => (
                          <option key={account._id} value={account._id}>
                            {account.name} - ****{account.accountNumber.slice(-4)} 
                            (${account.availableBalance.toFixed(2)})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.fromAccount?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transfer Type</Form.Label>
                      <Form.Select
                        {...register('transferType', { required: 'Please select transfer type' })}
                        isInvalid={!!errors.transferType}
                      >
                        <option value="">Select Type</option>
                        <option value="within-bank">Within Shaka Bank</option>
                        <option value="interbank">Interbank Transfer</option>
                        <option value="international">International Transfer</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.transferType?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>To Account / Beneficiary</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter account number or select beneficiary"
                    {...register('toAccount', {
                      required: 'Account number is required',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Invalid account number'
                      }
                    })}
                    isInvalid={!!errors.toAccount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.toAccount?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        {...register('amount', {
                          required: 'Amount is required',
                          min: { value: 0.01, message: 'Amount must be greater than 0' },
                          validate: value => {
                            if (selectedFromAccount && parseFloat(value) > selectedFromAccount.availableBalance) {
                              return 'Insufficient funds';
                            }
                            return true;
                          }
                        })}
                        isInvalid={!!errors.amount}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.amount?.message}
                      </Form.Control.Feedback>
                      {selectedFromAccount && (
                        <Form.Text className="text-muted">
                          Available: ${selectedFromAccount.availableBalance.toFixed(2)}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter description"
                        {...register('description', {
                          required: 'Description is required'
                        })}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Continue to Transfer'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Transfer Section */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-4">Quick Transfer</h5>
              <p className="text-muted mb-4">Send money to your frequent recipients</p>
              
              <div className="beneficiaries-list">
                {beneficiaries.map(beneficiary => (
                  <div key={beneficiary._id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                        <i className="fas fa-user text-primary"></i>
                      </div>
                      <div>
                        <strong>{beneficiary.name}</strong>
                        <div className="text-muted small">{beneficiary.bankName}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => quickTransfer(beneficiary)}
                      disabled={loading}
                    >
                      Send
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h6 className="mb-3">Transfer Limits</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Daily Limit</span>
                  <strong>$10,000</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Per Transaction</span>
                  <strong>$5,000</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Minimum Amount</span>
                  <strong>$1.00</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            We've sent a 6-digit verification code to your registered mobile number.
            Please enter it below to complete the transfer.
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-center fs-4"
            />
          </Form.Group>

          <div className="text-center">
            <Button 
              variant="link" 
              className="text-decoration-none"
              onClick={() => {
                // Resend OTP logic
              }}
            >
              Resend Code
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOTPModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={verifyAndProcessTransfer}
            disabled={isProcessing || otp.length !== 6}
          >
            {isProcessing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Transfer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FundTransfer;