import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Debug: Log OpenAI client info
console.log('OpenAI client version: 5.10.1');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Debug: Check if the client is properly initialized
console.log('OpenAI client initialized:', !!openai);
console.log('OpenAI beta available:', !!openai.beta);
console.log('OpenAI threads available:', !!openai.beta?.threads);

const ASSISTANT_ID = process.env.ASSISTANT_ID || "asst_QTzhfhueiOj8ggm8wbyJok3r";

function parseCookie(req, name) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(res, name, value) {
  // HttpOnly = false so JS can access if needed; adjust for security in prod
  res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to safely extract thread ID
function extractThreadId(value) {
  if (!value) return null;
  
  // If it's already a string, return it
  if (typeof value === 'string') {
    // Handle case where string is "[object Object]"
    if (value === '[object Object]') {
      console.warn('Thread ID is "[object Object]", treating as null');
      return null;
    }
    return value;
  }
  
  // If it's an object with an id property
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return value.id;
  }
  
  // If it's an object but no id property, log warning and return null
  if (typeof value === 'object') {
    console.warn('Thread ID is an object without id property:', value);
    return null;
  }
  
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    // Extract session and thread IDs from headers or cookies
    let sessionId = req.headers['x-session-id'] || parseCookie(req, 'session_id');
    let threadId = req.headers['x-thread-id'] || parseCookie(req, 'thread_id');

    // Debug the raw values
    console.log('Raw threadId from headers/cookies:', threadId);
    console.log('Raw threadId type:', typeof threadId);

    // Safely extract thread ID
    threadId = extractThreadId(threadId);

    console.log('Initial threadId:', threadId);
    console.log('Type of threadId:', typeof threadId);

    let isNewSession = false;
    let isNewThread = false;

    // Create new session if missing
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      isNewSession = true;
    }

    // Create new thread if missing or invalid
    if (!threadId || typeof threadId !== 'string') {
      console.log('Creating new thread...');
      const thread = await openai.beta.threads.create();
      threadId = thread.id; // Remove unnecessary string coercion
      isNewThread = true;
      console.log('New thread created:', threadId);
    }

    // Final validation before API call
    if (typeof threadId !== 'string') {
      throw new Error(`Thread ID is not a string: ${typeof threadId} - ${threadId}`);
    }

    console.log('Final sessionId:', sessionId);
    console.log('Final threadId:', threadId);
    console.log('Final type of threadId:', typeof threadId);

    // Send user message - use direct HTTP due to OpenAI client bug
    try {
      console.log('Sending message with direct HTTP...');
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const result = await response.json();
      console.log('Message sent successfully:', result.id);

    } catch (err) {
      console.error('Message creation error:', err);
      
      if (err.message.includes('404')) {
        // Thread not found, create a new one and retry
        console.log('Thread not found (404), creating new thread...');
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        
        console.log('Retry with new threadId:', threadId);
        
        // Retry with direct HTTP
        try {
          const retryResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
              role: 'user',
              content: message
            })
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Retry failed: HTTP ${retryResponse.status}: ${await retryResponse.text()}`);
          }
          
          console.log('Retry with direct HTTP succeeded');
        } catch (retryErr) {
          console.log('Retry with direct HTTP failed:', retryErr.message);
          throw retryErr;
        }
        
        isNewThread = true;
      } else {
        throw err;
      }
    }

    // Run the assistant - try OpenAI client first, then direct HTTP
    let run;
    try {
      run = await openai.beta.threads.runs.create({
        thread_id: threadId,
        assistant_id: ASSISTANT_ID,
      });
    } catch (runErr) {
      console.log('Run creation with OpenAI client failed:', runErr.message);
      console.log('Trying direct HTTP for run creation...');
      
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID
        })
      });
      
      if (!runResponse.ok) {
        throw new Error(`Run creation failed: HTTP ${runResponse.status}: ${await runResponse.text()}`);
      }
      
      run = await runResponse.json();
      console.log('Run creation with direct HTTP succeeded');
    }

    // Poll for run completion - use direct HTTP since OpenAI client is buggy
    let runStatus;
    while (true) {
      try {
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed: HTTP ${statusResponse.status}: ${await statusResponse.text()}`);
        }
        
        runStatus = await statusResponse.json();
      } catch (statusErr) {
        console.log('Status check with direct HTTP failed:', statusErr.message);
        res.status(500).json({ error: 'Failed to check run status.' });
        return;
      }

      if (runStatus.status === 'completed') {
        break;
      } else if (runStatus.status === 'failed') {
        res.status(500).json({ error: 'Assistant run failed.' });
        return;
      }
      await sleep(1000);
    }

    // Get latest message from assistant - use direct HTTP
    let messagesRes;
    try {
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!messagesResponse.ok) {
        throw new Error(`Messages fetch failed: HTTP ${messagesResponse.status}: ${await messagesResponse.text()}`);
      }
      
      messagesRes = await messagesResponse.json();
    } catch (messagesErr) {
      console.log('Messages fetch with direct HTTP failed:', messagesErr.message);
      res.status(500).json({ error: 'Failed to fetch messages.' });
      return;
    }

    if (!messagesRes.data || messagesRes.data.length === 0) {
      res.status(500).json({ error: 'No messages returned from assistant.' });
      return;
    }

    const latestMsg = messagesRes.data[0];
    if (latestMsg.role !== 'assistant' || !latestMsg.content || latestMsg.content[0].type !== 'text') {
      res.status(500).json({ error: 'Latest message is not a valid assistant reply.' });
      return;
    }

    const reply = latestMsg.content[0].text.value;

    // Set cookies and headers for new session/thread
    if (isNewSession) {
      setCookie(res, 'session_id', sessionId);
      res.setHeader('x-session-id', sessionId);
    }

    if (isNewThread) {
      setCookie(res, 'thread_id', threadId);
      res.setHeader('x-thread-id', threadId);
    }

    res.status(200).json({
      reply,
      session_id: sessionId,
      thread_id: threadId
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}