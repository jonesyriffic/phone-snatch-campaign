import { db } from './db';
import { emailMetrics } from '@shared/schema';
import { Request, Response } from 'express';

// This file contains utility endpoints for development purposes only
// These should be disabled in production

/**
 * Add a test email record for demonstration purposes
 */
export const addTestEmailRecord = async (req: Request, res: Response) => {
  try {
    // Generate some random data for testing
    const names = [
      'John Smith', 'Sarah Johnson', 'Alex Williams', 
      'Emma Brown', 'Michael Davis', 'Olivia Wilson', 
      'Thomas Martin', 'Sophie Taylor', 'James Anderson'
    ];
    
    const postcodes = ['E20 1AA', 'E20 2BB', 'E20 3CC', 'E20 4DD', 'E20 5EE'];
    
    // Randomly select from the arrays
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPostcode = postcodes[Math.floor(Math.random() * postcodes.length)];
    const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@example.com`;
    
    // Insert the test record
    await db.insert(emailMetrics).values({
      fullName: randomName,
      postcode: randomPostcode,
      email: randomEmail,
      description: 'This is a test record',
      userAgent: req.headers['user-agent'] || '',
      customizedTemplate: Math.random() > 0.5 // Randomly set to true or false
    });
    
    return res.status(200).json({ 
      message: 'Test email record added successfully',
      data: {
        fullName: randomName,
        postcode: randomPostcode,
        email: randomEmail
      }
    });
  } catch (error) {
    console.error('Error adding test email record:', error);
    return res.status(500).json({ 
      message: 'Failed to add test email record'
    });
  }
};