// pages/api/submit-preferences.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

// Initialize the S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

type PreferenceData = {
  name: string;
  period: string;
  preferredPartner: string;
  nonPreferredPartner: string;
  preferredLocation: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data: PreferenceData = req.body;

      // Validate the data
      if (!data.name || !data.period) {
        return res.status(400).json({ message: 'Name and period are required' });
      }

      // Add timestamp to the data
      const now = new Date();
      const timestamp = now.toISOString();
      const dataWithTimestamp = { ...data, timestamp };

      // Create a unique filename for each submission
      const fileName = `preferences-${data.name}-${now.getTime()}.json`;

      // Convert the data to a string
      const dataString = JSON.stringify(dataWithTimestamp, null, 2);

      // Define S3 parameters
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `preferences/${fileName}`, // Folder structure in the bucket
        Body: dataString,
        ContentType: 'application/json',
      };

      // Upload the data to S3
      await s3.putObject(params).promise();

      res.status(200).json({ message: 'Preferences submitted successfully' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ message: 'Error saving preferences' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
