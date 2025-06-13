import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import cardTop from '../assets/card-top.png';
import cardBot from '../assets/card-bot.png';
import SMIT from '../assets/smit-logo.png';
import nameLogo from '../assets/name-logo.png';
import QRCode from 'react-qr-code';
import '../App.css';

const Download = () => {
  const [cnic, setCnic] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const componentRef = useRef();
  const qrCodeRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUser(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/user/${cnic}`);
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  const captureQrCode = async () => {
    if (!qrCodeRef.current) return '';
    const canvas = await html2canvas(qrCodeRef.current, {
      scale: 2,
      useCORS: true,
    });
    return canvas.toDataURL('image/png');
  };

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;
    setLoading(true);

    try {
      const qrCodeImage = await captureQrCode();
      setQrCodeDataUrl(qrCodeImage);
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      });

      // ************Generate PDF***************

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(canvas.toDataURL('image/png'));
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Saylani_ID_Card.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="cnicInput">
              <Form.Label className='lable-color'>CNIC (Which you provided during form submission)</Form.Label>
              <Form.Control
                type="text"
                placeholder="CNIC (Which you provided during form submission)"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="py-3 border-2 form-border"
              />
            </Form.Group>
            <Button type="submit" className="w-100 mt-3">Submit</Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {user && (
            <>
              <div ref={qrCodeRef} style={{ position: 'absolute', left: '-9999px' }}>
                <QRCode value={user.cnic} size={64} />
              </div>

              <div ref={componentRef} className="mt-4">
                <div className="row">
                  <div className="col col-lg-6 col-md-6 col-sm-12">
                    <div className="col col-lg-11 col-md-11 col-sm-12 text-center h-100 d-flex flex-column justify-content-between" 
                         style={{ border: '1px solid #7b7b7b' }}>
                      <img src={cardTop} alt="card-top" className="w-100 mb-1" style={{ height: '50px' }} />
                      <img src={SMIT} alt="SMIT" className="mb-2 mx-auto d-block" style={{ width: '100px', height: '50px' }} />
                      <img src={nameLogo} alt="nameLogo" className="mx-auto d-block mt-2" style={{ width: '150px', height: '50px' }} />
                      <img src={user.imageUrl} alt="user-image" className="mx-auto d-block rounded-sm mt-2" 
                           style={{ width: '80px', height: '80px', border: '3px solid #8bc441' }} />
                      <h6 className='mt-2'>{user.fullName.toUpperCase()}</h6>
                      <p>{user.course}</p>
                      <img src={cardBot} alt="card-bot" className="w-100" style={{ height: '40px' }} />
                    </div>
                  </div>

                  <div className="col col-lg-6 col-md-6 col-sm-12">
                    <div className="col col-lg-11 col-md-9 col-sm-12 h-100" style={{ border: '1px solid #7b7b7b' }}>
                      <img src={cardTop} alt="card-top" className="w-100 mb-1" style={{ height: '50px' }} />
                      <p className='mx-4 my-0' style={{ fontSize: '15px' }}>Name: <b><u>{user.fullName}</u></b></p>
                      <p className='mx-4 my-0' style={{ fontSize: '15px' }}>Father name: <b><u>{user.fatherName}</u></b></p>
                      <p className='mx-4 my-0' style={{ fontSize: '15px' }}>CNIC: <b><u>{user.cnic}</u></b></p>
                      <p className='mx-4 my-0' style={{ fontSize: '15px' }}>Course: <b><u>{user.course}</u></b></p>
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code" className="mt-4 mx-auto d-block" 
                             style={{ width: '64px', height: '64px' }} />
                      ) : (
                        <QRCode value={user.cnic} size={64} className="mt-4 mx-auto d-block" />
                      )}
                      <p className='mx-2 text-center mt-3' style={{ fontSize: '12px' }}>
                        <b>Note: This is for SMIT premises only. <br />If found please return to SMIT</b>
                      </p>
                      <hr className="mx-auto mt-4 mb-2" style={{ width: '50%', borderTop: '2px solid black' }} />
                      <b className='text-center d-block' style={{ fontSize: '12px' }}>Issuing authority</b>
                      <img src={cardBot} alt="card-bot" className="w-100" style={{ height: '40px' }} />
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="success" className="mt-3 w-100" onClick={handleDownloadPDF} disabled={loading}>
                {loading ? 'Downloading...' : 'Download as PDF'}
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Download;