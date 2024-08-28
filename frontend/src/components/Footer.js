import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';
import '../Design/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="app-footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Simple SIEM
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Providing advanced security information and event management solutions to keep your systems safe.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#" color="textSecondary" display="block">Home</Link>
            <Link href="#" color="textSecondary" display="block">About Us</Link>
            <Link href="#" color="textSecondary" display="block">Contact</Link>
            <Link href="#" color="textSecondary" display="block">Privacy Policy</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Connect With Us
            </Typography>
            <IconButton aria-label="GitHub" color="primary">
              <GitHub />
            </IconButton>
            <IconButton aria-label="LinkedIn" color="primary">
              <LinkedIn />
            </IconButton>
            <IconButton aria-label="Twitter" color="primary">
              <Twitter />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            © {currentYear} Simple SIEM. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;