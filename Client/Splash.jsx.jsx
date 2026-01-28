import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-primary">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center p-5 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Card.Body>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bank-logo mb-4">
                <i className="fas fa-university fa-4x text-primary"></i>
              </div>
            </motion.div>
            <h1 className="display-4 mb-3 text-primary">Shaka Bank</h1>
            <p className="lead text-muted">Secure Banking for the Modern World</p>
            <Spinner animation="border" variant="primary" className="mt-4" />
            <p className="mt-3">Loading your secure banking experience...</p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Splash;