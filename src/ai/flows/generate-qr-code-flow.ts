// src/ai/flows/generate-qr-code-flow.ts
'use server';

/**
 * @fileOverview Generates a QR code with security guard details, including a timestamp.
 *
 * - generateQrCode - A function that handles the QR code generation process.
 * - GenerateQrCodeInput - The input type for the generateQrCode function.
 * - GenerateQrCodeOutput - The return type for the generateQrCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQrCodeInputSchema = z.object({
  name: z.string().describe('The full name of the security guard.'),
  address: z.string().describe('The address of the security guard.'),
  idNumber: z.string().describe('The ID number of the security guard.'),
  emergencyContacts: z.string().optional().describe('Emergency contact numbers.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the security guard, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'" // Photo is optional
    ),
});
export type GenerateQrCodeInput = z.infer<typeof GenerateQrCodeInputSchema>;

const GenerateQrCodeOutputSchema = z.object({
  qrCodeData: z.string().describe('The JSON string containing the data for the QR code.'),
});
export type GenerateQrCodeOutput = z.infer<typeof GenerateQrCodeOutputSchema>;

export async function generateQrCode(input: GenerateQrCodeInput): Promise<GenerateQrCodeOutput> {
  return generateQrCodeFlow(input);
}

const generateQrCodeFlow = ai.defineFlow(
  {
    name: 'generateQrCodeFlow',
    inputSchema: GenerateQrCodeInputSchema,
    outputSchema: GenerateQrCodeOutputSchema,
  },
  async input => {
    // The photoDataUri is intentionally excluded from the QR code data to keep the data size small.
    const qrData = JSON.stringify({
      name: input.name,
      address: input.address,
      idNumber: input.idNumber,
      emergencyContacts: input.emergencyContacts,
      timestamp: new Date().toISOString(),
    });

    return {qrCodeData: qrData};
  }
);

    