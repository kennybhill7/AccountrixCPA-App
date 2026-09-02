# AI Visual Calculator System
## Point Camera, Get Instant Math

**Generated:** November 5, 2025
**Status:** Design & Implementation Plan

---

## 🎯 THE VISION

**Problem:** CFOs/accountants constantly need to:
- Add up numbers from printed reports
- Verify invoice totals
- Calculate variances between documents
- Sum columns in physical spreadsheets
- But typing numbers into calculator is slow and error-prone

**Solution:** AI-powered visual calculator that:
- **Scans handwritten or printed numbers** from camera or photo
- **Natural language commands** - "Add these three numbers" or "Subtract line 2 from line 1"
- **Column/row detection** - Automatically identifies columns to sum
- **Multi-document calculations** - "What's the difference between these two invoices?"
- **Formula recognition** - Sees formulas and calculates them
- **Voice control** - "Add all the numbers in the third column"

**Result:** Turn your camera into an instant calculator for any physical document.

---

## 📱 USE CASES

### **1. Invoice Verification**
```
[Point camera at invoice]
User: "Does this add up correctly?"
AI: "Scanning invoice...
     Subtotal: $4,250.00
     Tax (6%): $255.00
     Total: $4,505.00
     ✓ Invoice math is correct!"
```

### **2. GL Report Column Sum**
```
[Point camera at printed GL report]
User: "Add up column 3"
AI: "Detecting columns...
     Column 3 (Debit) has 12 entries:
     $1,200 + $850 + $2,400 + ...
     Total: $15,840.00"
```

### **3. Handwritten Notes Addition**
```
[Point camera at handwritten numbers on notepad]
User: "Add these numbers"
AI: "I see 5 handwritten numbers:
     1. $12,450
     2. $8,200
     3. $15,600
     4. $3,900
     5. $7,125

     Total: $47,275"
```

### **4. Variance Calculation**
```
[Take photo of Budget]
User: "Save this as Budget"
AI: "Saved Budget: $125,000"

[Take photo of Actual]
User: "What's the variance from Budget?"
AI: "Actual: $118,450
     Budget: $125,000
     Variance: ($6,550) or -5.2%
     Under budget ✓"
```

### **5. Multi-Document Reconciliation**
```
[Photo 1: Bank statement ending balance]
User: "Bank balance"
AI: "Bank: $45,680.50"

[Photo 2: GL cash account balance]
User: "GL balance"
AI: "GL: $43,200.00"

User: "What's the difference?"
AI: "Reconciling difference: $2,480.50
     Outstanding items to investigate"
```

### **6. Complex Formula Recognition**
```
[Point camera at whiteboard with formula]
Shows: "Net Income = Revenue - COGS - OpEx"
       "Revenue = $500K"
       "COGS = $200K"
       "OpEx = $150K"

User: "Calculate this"
AI: "Formula detected: Net Income = Revenue - COGS - OpEx
     Substituting values:
     Net Income = $500,000 - $200,000 - $150,000
     Net Income = $150,000"
```

---

## 🛠️ TECHNICAL IMPLEMENTATION

### **Frontend: Visual Calculator Interface**

**React Component:**
```tsx
'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Mic, Calculator } from 'lucide-react';

export default function AIVisualCalculator() {
  const [calculationHistory, setCalculationHistory] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedNumbers, setDetectedNumbers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Capture frame and process
  const captureAndCalculate = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      // Capture current video frame
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.9);

      // Send to AI Calculator API
      const response = await fetch('/api/calculator/visual-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          operation: 'auto' // Let AI determine operation
        })
      });

      const data = await response.json();

      setDetectedNumbers(data.numbers);
      setResult(data.result);
      setCalculationHistory(prev => [...prev, data]);

    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice command handler
  const handleVoiceCommand = async (command: string) => {
    // Process voice command like "add all numbers" or "sum column 2"
    const response = await fetch('/api/calculator/voice-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command,
        detectedNumbers
      })
    });

    const data = await response.json();
    setResult(data.result);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Camera View */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Detected Numbers Overlay */}
        {detectedNumbers.length > 0 && (
          <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Detected Numbers:
            </div>
            <div className="flex flex-wrap gap-2">
              {detectedNumbers.map((num, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono"
                >
                  {num.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Result Display */}
        {result !== null && (
          <div className="absolute bottom-24 left-4 right-4 bg-green-600 text-white rounded-lg p-6 shadow-xl">
            <div className="text-sm opacity-80 mb-1">Result:</div>
            <div className="text-4xl font-bold">
              {result.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 mb-4">
          <button
            onClick={captureAndCalculate}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300"
          >
            <Calculator className="w-6 h-6" />
            {isProcessing ? 'Calculating...' : 'Calculate'}
          </button>

          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg flex items-center gap-2"
          >
            <Upload className="w-6 h-6" />
            Upload
          </button>
        </div>

        {/* Quick Commands */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleVoiceCommand('add all')}
            className="bg-purple-100 text-purple-700 py-3 rounded-lg text-sm font-medium"
          >
            Add All
          </button>
          <button
            onClick={() => handleVoiceCommand('average')}
            className="bg-purple-100 text-purple-700 py-3 rounded-lg text-sm font-medium"
          >
            Average
          </button>
          <button
            onClick={() => handleVoiceCommand('multiply')}
            className="bg-purple-100 text-purple-700 py-3 rounded-lg text-sm font-medium"
          >
            Multiply
          </button>
          <button
            onClick={() => handleVoiceCommand('subtract')}
            className="bg-purple-100 text-purple-700 py-3 rounded-lg text-sm font-medium"
          >
            Subtract
          </button>
        </div>

        {/* Voice Command Button */}
        <button
          className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <Mic className="w-6 h-6" />
          Voice Command
        </button>
      </div>

      {/* History Sidebar */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Calculation History</h3>
        {calculationHistory.map((calc, idx) => (
          <div key={idx} className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">
              {new Date(calc.timestamp).toLocaleTimeString()}
            </div>
            <div className="font-mono text-sm mb-1">
              {calc.operation}
            </div>
            <div className="font-bold text-green-600">
              = {calc.result.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **Backend: Visual Calculator API**

```typescript
/**
 * POST /api/calculator/visual-calculate
 *
 * Processes image with GPT-4 Vision + OCR to detect and calculate numbers
 */

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Tesseract from 'tesseract.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

interface VisualCalculateRequest {
  image: string; // base64
  operation?: 'add' | 'subtract' | 'multiply' | 'divide' | 'average' | 'auto';
  command?: string; // Natural language like "add column 2"
}

interface VisualCalculateResponse {
  numbers: number[];
  operation: string;
  result: number;
  formula: string;
  detectedStructure?: {
    columns?: number[][];
    rows?: number[][];
    tables?: any[];
  };
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualCalculateResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({} as any);
  }

  const { image, operation = 'auto', command } = req.body as VisualCalculateRequest;

  try {
    // Step 1: Use GPT-4 Vision to understand the image
    const visionPrompt = `You are an AI calculator analyzing a photo of numbers.

${command ? `User Command: "${command}"` : 'Automatically detect what calculation to perform.'}

Tasks:
1. Detect ALL numbers in the image (handwritten, printed, in tables, columns, rows)
2. Understand the structure (are they in columns? rows? a list?)
3. Determine what mathematical operation to perform
4. Extract the numbers in order
5. ${command ? `Follow the user's command: "${command}"` : 'Suggest the most logical operation (add, subtract, multiply, etc.)'}

Return JSON format:
{
  "numbers": [12.50, 45.00, 33.75, ...],
  "structure": "column" | "row" | "list" | "table" | "invoice",
  "operation": "add" | "subtract" | "multiply" | "divide" | "average",
  "reasoning": "Why you chose this operation",
  "detectedColumns": [[col1 numbers], [col2 numbers], ...] // if table/columns detected
}`;

    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: visionPrompt },
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'high' // High detail for accurate number detection
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1 // Low temp for accuracy
    });

    const visionData = JSON.parse(
      visionResponse.choices[0].message.content || '{}'
    );

    // Step 2: Perform the calculation
    const numbers = visionData.numbers || [];
    const detectedOperation = operation === 'auto' ? visionData.operation : operation;

    let result: number;
    let formula: string;

    switch (detectedOperation) {
      case 'add':
        result = numbers.reduce((sum: number, n: number) => sum + n, 0);
        formula = numbers.join(' + ') + ' = ' + result;
        break;

      case 'subtract':
        result = numbers.reduce((diff: number, n: number, idx: number) =>
          idx === 0 ? n : diff - n
        );
        formula = numbers.join(' - ') + ' = ' + result;
        break;

      case 'multiply':
        result = numbers.reduce((product: number, n: number) => product * n, 1);
        formula = numbers.join(' × ') + ' = ' + result;
        break;

      case 'divide':
        result = numbers.reduce((quotient: number, n: number, idx: number) =>
          idx === 0 ? n : quotient / n
        );
        formula = numbers.join(' ÷ ') + ' = ' + result;
        break;

      case 'average':
        result = numbers.reduce((sum: number, n: number) => sum + n, 0) / numbers.length;
        formula = `Average of ${numbers.length} numbers = ${result}`;
        break;

      default:
        // Default to addition
        result = numbers.reduce((sum: number, n: number) => sum + n, 0);
        formula = numbers.join(' + ') + ' = ' + result;
    }

    return res.status(200).json({
      numbers,
      operation: detectedOperation,
      result,
      formula,
      detectedStructure: visionData.detectedColumns ? {
        columns: visionData.detectedColumns
      } : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Visual calculation error:', error);
    return res.status(500).json({} as any);
  }
}
```

---

### **Advanced: Column/Table Detection**

```typescript
/**
 * POST /api/calculator/table-calculate
 *
 * Specialized endpoint for calculating specific columns/rows in tables
 */

interface TableCalculateRequest {
  image: string;
  command: string; // "sum column 3" or "average row 2" or "total all columns"
}

interface TableCalculateResponse {
  tables: Array<{
    columnCount: number;
    rowCount: number;
    columns: number[][];
    rows: number[][];
  }>;
  result: number | number[];
  operation: string;
}

async function handleTableCalculation(req: any, res: any) {
  const { image, command } = req.body as TableCalculateRequest;

  const visionPrompt = `You are analyzing a table/spreadsheet in an image.

User Command: "${command}"

Tasks:
1. Detect the table structure (how many columns? how many rows?)
2. Extract all numbers preserving column/row structure
3. Execute the user's command

Return JSON:
{
  "tables": [{
    "columnCount": 5,
    "rowCount": 12,
    "columns": [
      [row1col1, row2col1, row3col1, ...],  // Column 1 values
      [row1col2, row2col2, row3col2, ...],  // Column 2 values
      ...
    ],
    "rows": [
      [col1row1, col2row1, col3row1, ...],  // Row 1 values
      [col1row2, col2row2, col3row2, ...],  // Row 2 values
      ...
    ]
  }],
  "targetColumn": 3, // Which column to calculate (from command)
  "operation": "sum" | "average" | "count"
}`;

  const visionResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          { type: 'image_url', image_url: { url: image, detail: 'high' } }
        ]
      }
    ]
  });

  const data = JSON.parse(visionResponse.choices[0].message.content || '{}');

  // Calculate based on detected structure
  const targetColumn = data.targetColumn;
  const columnData = data.tables[0].columns[targetColumn - 1]; // 0-indexed

  let result: number;
  if (data.operation === 'sum') {
    result = columnData.reduce((sum: number, n: number) => sum + n, 0);
  } else if (data.operation === 'average') {
    result = columnData.reduce((sum: number, n: number) => sum + n, 0) / columnData.length;
  }

  return res.status(200).json({
    tables: data.tables,
    result,
    operation: data.operation
  });
}
```

---

## 🎤 VOICE COMMAND INTEGRATION

```typescript
/**
 * Voice command processor for calculator
 */

async function processVoiceCommand(audioBlob: Blob, detectedNumbers: number[]) {
  // Step 1: Transcribe voice using Whisper
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-1');

  const transcription = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: formData
  }).then(res => res.json());

  const command = transcription.text.toLowerCase();

  // Step 2: Parse command and execute
  if (command.includes('add') || command.includes('sum') || command.includes('total')) {
    return {
      operation: 'add',
      result: detectedNumbers.reduce((sum, n) => sum + n, 0),
      formula: detectedNumbers.join(' + ')
    };
  }

  if (command.includes('subtract') || command.includes('minus')) {
    return {
      operation: 'subtract',
      result: detectedNumbers.reduce((diff, n, idx) => idx === 0 ? n : diff - n),
      formula: detectedNumbers.join(' - ')
    };
  }

  if (command.includes('average') || command.includes('mean')) {
    const avg = detectedNumbers.reduce((sum, n) => sum + n, 0) / detectedNumbers.length;
    return {
      operation: 'average',
      result: avg,
      formula: `Average of ${detectedNumbers.length} numbers`
    };
  }

  if (command.includes('column')) {
    // Extract column number from command
    const match = command.match(/column (\d+)/);
    const columnNum = match ? parseInt(match[1]) : 1;

    return {
      operation: 'sum_column',
      columnNumber: columnNum,
      needsColumnDetection: true
    };
  }

  // Default: add all
  return {
    operation: 'add',
    result: detectedNumbers.reduce((sum, n) => sum + n, 0)
  };
}
```

---

## 📊 ADVANCED FEATURES

### **1. Saved Calculations**
- Save calculation results with labels
- Reference saved values in future calculations
- "Compare to last month's total"

### **2. Formula Builder**
- Detect multi-step formulas
- Calculate complex expressions
- Support parentheses and order of operations

### **3. Currency Conversion**
- Detect currency symbols
- Auto-convert to user's preferred currency
- Handle multi-currency calculations

### **4. Percentage Calculations**
- "What's 25% of this total?"
- "Calculate sales tax at 6%"
- Variance analysis (actual vs budget %)

### **5. Batch Processing**
- Take multiple photos
- Calculate across all images
- "Sum all invoices from today"

---

## 💰 COST ANALYSIS

**Per Calculation:**
- GPT-4 Vision: $0.01 per image
- 100 calculations/day = $1/day = $30/month
- Very affordable for professional use

**Optimization:**
- Use Tesseract OCR first (free)
- Only use GPT-4 Vision for complex layouts
- Cost per calc: $0.002-0.01

---

## 🎯 REVOLUTIONARY VALUE

**This feature makes Accountrix the ONLY app that:**
- Turns camera into instant calculator
- Understands handwriting and print
- Processes natural language math commands
- Handles complex table/column calculations
- Works with voice commands

**Use Cases Everywhere:**
- Field work (job sites, inventory counts)
- Meeting notes (whiteboard calculations)
- Document verification (invoice checking)
- Quick reconciliations (bank vs GL)
- On-the-go totaling (receipts, expenses)

---

**Ready to implement!**
