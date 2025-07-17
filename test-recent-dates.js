const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing with recent date ranges');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

// Get recent date ranges
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const dateRanges = [
  {
    name: 'Today only',
    start: today.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
  },
  {
    name: 'Yesterday only',
    start: yesterday.toISOString().split('T')[0],
    end: yesterday.toISOString().split('T')[0]
  },
  {
    name: 'Past week',
    start: weekAgo.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
  },
  {
    name: 'Past month',
    start: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
  }
];

const testAttributeWithDates = async (attributeName, dateRange) => {
  const baseUrl = 'https://exist.io/api/2';
  
  // Test different URL patterns with the date range
  const patterns = [
    `${baseUrl}/attributes/${attributeName}/?date_min=${dateRange.start}&date_max=${dateRange.end}`,
    `${baseUrl}/attributes/${attributeName}/values/?date_min=${dateRange.start}&date_max=${dateRange.end}`,
    `${baseUrl}/attributes/${attributeName}/?start=${dateRange.start}&end=${dateRange.end}`,
    `${baseUrl}/attributes/${attributeName}/values/?start=${dateRange.start}&end=${dateRange.end}`,
  ];

  console.log(`\n📊 Testing ${attributeName} with ${dateRange.name} (${dateRange.start} to ${dateRange.end}):`);
  
  for (let i = 0; i < patterns.length; i++) {
    const url = patterns[i];
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`  Pattern ${i + 1}: ${response.status} - ${url}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`    ✅ SUCCESS! Found ${data.results?.length || data.objects?.length || 0} data points`);
        console.log(`    Response keys:`, Object.keys(data));
        if (data.results && data.results.length > 0) {
          console.log(`    Sample data:`, data.results[0]);
        }
        return { url, data };
      } else if (response.status === 404) {
        console.log(`    ❌ 404 - Endpoint not found`);
      } else {
        const errorText = await response.text();
        console.log(`    ❌ ${response.status} - ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`  Pattern ${i + 1}: ERROR - ${error.message}`);
    }
  }
  
  return null;
};

const main = async () => {
  const attributes = ['steps', 'sleep', 'meditation_min', 'productive_min'];
  
  for (const dateRange of dateRanges) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing date range: ${dateRange.name}`);
    console.log(`${'='.repeat(60)}`);
    
    for (const attr of attributes) {
      const result = await testAttributeWithDates(attr, dateRange);
      if (result) {
        console.log(`🎯 Found working pattern for ${attr}: ${result.url}`);
        break; // Found a working pattern, move to next attribute
      }
    }
  }
};

main().catch(console.error); 