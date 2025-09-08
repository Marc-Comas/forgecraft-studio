import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('🚀 Function called with method:', req.method);
  
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📝 Processing request...');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('🔑 API key configured:', !!openAIApiKey);
    
    if (!openAIApiKey || openAIApiKey.length < 10) {
      console.error('❌ OpenAI API key is not configured or invalid');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured in secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, projectType, intent, code, dualPhase } = await req.json();
    console.log('📋 Request received - Prompt length:', prompt?.length || 0);
    console.log('🎯 Project type:', projectType, 'Intent:', intent);

    // Minimal system prompt - token efficient
    const system = [
      "You edit or generate HTML for a landing page.",
      "Return ONLY one JSON object:",
      ' - {"html_content":"<!doctype html>..."}  (full doc)',
      ' - OR {"content":"<!doctype html>..."}    (legacy)',
      "If you cannot fit the full document, return ONLY the changed section wrapped exactly as:",
      "  <!--PARTIAL_HTML_START--> ... <!--PARTIAL_HTML_END-->",
      "No markdown. No code fences. No explanations."
    ].join("\n");

    const user = prompt; // Client already builds minimal prompt

    console.log('📤 Calling OpenAI with minimal prompt (system:', system.length, 'chars, user:', user.length, 'chars)');

    // Call model with reduced token limit
    const result = await callModel({ system, user, max_tokens: 4000, apiKey: openAIApiKey });

    // Strict output validation
    let payload: any = {};
    try { 
      payload = JSON.parse(result); 
    } catch {
      // If not JSON, try to detect partial block
      if (String(result).includes("<!--PARTIAL_HTML_START-->")) {
        payload = { content: String(result) };
        console.log('📄 Detected partial HTML response');
      } else {
        console.error('❌ Invalid model output - not JSON and no partial markers');
        return new Response(JSON.stringify({ error: "Invalid model output format" }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('✅ Valid response received');
    return new Response(JSON.stringify(payload), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error('💥 Error in generate-code function:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate code'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Minimal model call function
async function callModel({ system, user, max_tokens, apiKey }: {
  system: string;
  user: string; 
  max_tokens: number;
  apiKey: string;
}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_completion_tokens: max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  console.log('📊 Token usage:', JSON.stringify(data.usage || {}));
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid OpenAI response structure');
  }

  const content = data.choices[0].message.content.trim();
  const finishReason = data.choices[0].finish_reason;
  
  if (finishReason === 'length') {
    console.log('⚠️ Response truncated due to token limit');
  }

  return content;
}