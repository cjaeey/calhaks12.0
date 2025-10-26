import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Testing Claude API...');
console.log(`API Key: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...' : 'NOT SET'}`);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testClaudeAPI() {
  try {
    console.log('\nTrying multiple models...\n');

    const models = [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-latest',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];

    for (const model of models) {
      try {
        console.log(`Testing ${model}...`);
        const response = await client.messages.create({
          model,
          max_tokens: 20,
          messages: [{
            role: 'user',
            content: 'Say hello'
          }],
        });
        console.log(`✅ SUCCESS with ${model}!`);
        console.log(`Response: ${response.content[0].text}\n`);
        return; // Stop on first success
      } catch (error) {
        console.log(`❌ ${model} failed: ${error.message}\n`);
      }
    }

    console.log('All models failed. Trying with explicit date model:');
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say "hello"'
      }],
    });

    console.log('\n✅ SUCCESS!');
    console.log('Response:', response.content[0].text);
  } catch (error) {
    console.log('\n❌ ERROR!');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    if (error.status) {
      console.log('Status code:', error.status);
    }
    if (error.error) {
      console.log('Error details:', error.error);
    }
  }
}

testClaudeAPI();
