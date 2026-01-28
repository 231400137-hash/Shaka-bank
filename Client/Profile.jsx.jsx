import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tab, Nav, Modal } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [devicesRes, notificationsRes] = await Promise.all([
        axios.get('/api/user/devices'),
        axios.get('/api/user/notifications')
      ]);
      setDevices(devicesRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const onProfileSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/api/user/profile', data);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/user/password', data);
      setSuccess('Password changed successfully!');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled) => {
    try {
      await axios.put('/api/user/two-factor', { enabled });
      setSuccess(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
      // Refresh user data
      const response = await axios.get('/api/user/profile');
      updateUser(response.data);
    } catch (err) {
      setError('Failed to update two-factor settings');
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete('/api/user/account');
      // Handle account deletion (redirect to login, clear storage, etc.)
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  const revokeDevice = async (deviceId) => {
    try {
      await axios.delete(`/api/user/devices/${deviceId}`);
      setDevices(devices.filter(device => device._id !== deviceId));
      setSuccess('Device access revoked');
    } catch (err) {
      setError('Failed to revoke device');
    }
  };

  if (!user) {
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
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="h2">My Profile</h1>
                  <p className="text-muted mb-0">Manage your account settings and preferences</p>
                </Col>
                <Col md={4} className="text-end">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-block">
                    <i className="fas fa-user fa-3x text-primary"></i>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary bg-opacity-25 p-4 d-inline-block mb-3">
                  <i className="fas fa-user fa-3x text-primary"></i>
                </div>
                <h5>{user.firstName} {user.lastName}</h5>
                <p className="text-muted">{user.email}</p>
                <span className="badge bg-success">Verified Account</span>
              </div>

              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-user-circle me-2"></i>
                    Personal Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'security'} 
                    onClick={() => setActiveTab('security')}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-shield-alt me-2"></i>
                    Security
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-bell me-2"></i>
                    Notifications
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'devices'} 
                    onClick={() => setActiveTab('devices')}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-laptop me-2"></i>
                    Devices
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'preferences'} 
                    onClick={() => setActiveTab('preferences')}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-cog me-2"></i>
                    Preferences
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>}
          
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>}

          <Tab.Content>
            {/* Personal Info Tab */}
            <Tab.Pane active={activeTab === 'profile'}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Personal Information</h4>
                  <Form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={user.firstName}
                            {...registerProfile('firstName', {
                              required: 'First name is required'
                            })}
                            isInvalid={!!profileErrors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {profileErrors.firstName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={user.lastName}
                            {...registerProfile('lastName', {
                              required: 'Last name is required'
                            })}
                            isInvalid={!!profileErrors.lastName}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={user.email}
                        {...registerProfile('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        isInvalid={!!profileErrors.email}
                      />
                      <Form.Text className="text-muted">
                        You'll need to verify your email address after changing it
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        defaultValue={user.phone}
                        {...registerProfile('phone', {
                          required: 'Phone number is required'
                        })}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            defaultValue={user.dateOfBirth?.split('T')[0]}
                            {...registerProfile('dateOfBirth')}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>National ID</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={user.nationalId}
                            {...registerProfile('nationalId')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={user.address}
                        {...registerProfile('address')}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary">Cancel</Button>
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Security Tab */}
            <Tab.Pane active={activeTab === 'security'}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Change Password</h4>
                  <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required'
                        })}
                        isInvalid={!!passwordErrors.currentPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.currentPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                        isInvalid={!!passwordErrors.newPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.newPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => 
                            value === watch('newPassword') || 'Passwords do not match'
                        })}
                        isInvalid={!!passwordErrors.confirmPassword}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Two-Factor Authentication</h4>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-1">SMS Verification</h5>
                      <p className="text-muted mb-0">
                        Receive a verification code via SMS when signing in
                      </p>
                    </div>
                    <Form.Check
                      type="switch"
                      checked={user.twoFactorEnabled}
                      onChange={(e) => handleTwoFactorToggle(e.target.checked)}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Authenticator App</h5>
                      <p className="text-muted mb-0">
                        Use an authenticator app for verification codes
                      </p>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Set Up
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Devices Tab */}
            <Tab.Pane active={activeTab === 'devices'}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Active Devices</h4>
                  <p className="text-muted mb-4">
                    Manage devices that are currently logged into your account
                  </p>

                  <div className="devices-list">
                    {devices.map(device => (
                      <div key={device._id} className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                            <i className={`fas fa-${device.type === 'mobile' ? 'mobile-alt' : 'laptop'} fa-2x text-primary`}></i>
                          </div>
                          <div>
                            <h5 className="mb-1">{device.name}</h5>
                            <p className="text-muted mb-0 small">
                              {device.browser} • {device.os} • Last active: {new Date(device.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          {device.isCurrent ? (
                            <span className="badge bg-success me-2">Current</span>
                          ) : (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => revokeDevice(device._id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline-danger" className="mt-4" onClick={() => {
                    // Revoke all devices except current
                  }}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Sign out from all devices
                  </Button>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Account Actions Card (Always visible) */}
            <Card className="border-0 shadow-sm mt-4 border-danger">
              <Card.Body className="p-4">
                <h4 className="mb-3 text-danger">Danger Zone</h4>
                <p className="text-muted mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete My Account
                </Button>
              </Card.Body>
            </Card>
          </Tab.Content>
        </Col>
      </Row>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-danger">
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-4">
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently deleted, including:
          </p>
          <ul className="mb-4">
            <li>All bank accounts and transactions</li>
            <li>Payment history and bills</li>
            <li>Personal information</li>
            <li>Preferences and settings</li>
          </ul>
          <Form.Group className="mb-3">
            <Form.Label>
              Type <strong>DELETE</strong> to confirm
            </Form.Label>
            <Form.Control type="text" placeholder="DELETE" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            Delete Account Permanently
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;