import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Run end-to-end demo
 */
async function runDemo() {
  try {
    console.log('🚀 Starting ReNOVA E2E Demo\n');

    // Step 1: Create a job
    console.log('📝 Step 1: Creating a new job...');
    const jobResponse = await axios.post(`${API_URL}/api/jobs`, {
      prompt: 'My AC unit is making a loud noise and not cooling properly. Need urgent repair in San Francisco.',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      photoUrls: [],
    });

    const { jobId } = jobResponse.data;
    console.log(`✅ Job created: ${jobId}\n`);

    // Step 2: Monitor progress
    console.log('⏳ Step 2: Monitoring job progress...');
    await new Promise((resolve) => {
      const eventSource = axios.get(`${API_URL}/api/jobs/${jobId}/events`, {
        responseType: 'stream',
      });

      eventSource.then(response => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.substring(6));
              console.log(`   ${data.stage}: ${data.message}`);

              if (data.stage === 'done' || data.stage === 'error') {
                resolve();
              }
            }
          }
        });
      });
    });

    // Wait a bit for processing to complete
    await new Promise(r => setTimeout(r, 2000));

    // Step 3: Get results
    console.log('\n📊 Step 3: Fetching results...');
    const resultsResponse = await axios.get(`${API_URL}/api/jobs/${jobId}/results`);

    const { matches, count } = resultsResponse.data;
    console.log(`\n✅ Found ${count} matching professionals:\n`);

    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.name || match.id}`);
      console.log(`   Score: ${match.score}`);
      console.log(`   Reason: ${match.reason}`);
      console.log('');
    });

    console.log('✅ Demo completed successfully!\n');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Demo failed');
    console.error('❌ Demo failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

runDemo();
