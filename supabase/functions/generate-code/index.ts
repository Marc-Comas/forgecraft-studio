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
    
    // Test if we can read the secret
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('🔑 API key configured:', !!openAIApiKey);
    console.log('🔑 API key length:', openAIApiKey ? openAIApiKey.length : 0);
    console.log('🔑 API key prefix:', openAIApiKey ? openAIApiKey.substring(0, 7) + '***' : 'NOT_FOUND');

    // Validate API key exists
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key is not configured');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured in secrets',
        details: 'Please check your secrets configuration'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (openAIApiKey.length < 10) {
      console.error('❌ OpenAI API key appears invalid (too short)');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key appears invalid',
        details: 'API key is too short'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    console.log('📋 Request body received:', JSON.stringify(requestBody, null, 2));
    
    const { prompt, projectType = 'landing page', projectId, filePath, code, intent = 'code' } = requestBody;

    console.log('🚀 Generating code with OpenAI');
    console.log('📝 Prompt length:', prompt?.length || 0);
    console.log('🎯 Project type:', projectType);

    // Implement dual-phase generation system
    const isDualPhase = requestBody.dualPhase !== false; // Default to true
    
    if (isDualPhase && (!code || intent !== 'enhancement')) {
      console.log('🎯 Starting dual-phase generation (Phase 1: Structure)');
      return await handleDualPhaseGeneration(prompt, projectType, openAIApiKey);
    }

    let systemPrompt;
    let userPrompt;
    
    // Different prompts based on intent and whether we're editing existing code
    if (code && intent === 'enhancement') {
      // AI Assistant mode - enhance existing code
      systemPrompt = `You are an expert web developer who enhances existing HTML/CSS/JavaScript code based on user instructions.

CRITICAL REQUIREMENTS:
- Analyze the existing code structure and maintain its overall design and functionality
- Apply the requested changes while preserving existing working features
- Ensure the updated code remains responsive and accessible
- Keep all existing animations and interactions unless specifically asked to change them
- Maintain the current color scheme and typography unless requested otherwise
- Generate clean, well-structured code with proper indentation

RESPONSE FORMAT:
Return a JSON object with the following structure:
{
  "ok": true,
  "mode": "full",
  "filePath": "index.html",
  "content": "<!DOCTYPE html>...",
  "messages": ["Brief description of changes made"],
  "elapsedMs": 1500
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text.`;

      userPrompt = `Current code:
${code.substring(0, 8000)}${code.length > 8000 ? '\n... [truncated]' : ''}

User request: ${prompt}

Please enhance the code according to the user's request while maintaining existing functionality.`;
    } else {
      // Project generation mode - create new templates (single phase fallback)
      systemPrompt = `You are an expert web developer who creates modern, responsive, and beautiful ${projectType}s using the latest web technologies.

CRITICAL REQUIREMENTS:
- Generate a COMPLETE, FUNCTIONAL HTML page with embedded CSS and JavaScript
- Use Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Implement responsive design that works on mobile and desktop
- Use semantic HTML5 elements for accessibility
- Add proper meta tags for SEO
- Create professional styling with modern design
- Add smooth transitions and hover effects

TECHNICAL SPECIFICATIONS:
- Use Tailwind CSS classes for styling
- Embed custom CSS in <style> tags only when necessary
- Embed JavaScript in <script> tags before closing </body>
- Use CSS Grid and Flexbox (via Tailwind) for layouts
- Implement mobile-first responsive design
- Add proper viewport meta tag

STRUCTURE REQUIREMENTS:
- Navigation with logo and menu items
- Hero section with headline and CTA
- Features/Services section
- Contact form with validation
- Footer with links and company info

RESPONSE FORMAT:
Return a JSON object with the following structure:
{
  "ok": true,
  "mode": "full",
  "filePath": "index.html",
  "content": "<!DOCTYPE html>...",
  "messages": ["Project generated successfully with modern design"],
  "elapsedMs": 2000
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text.`;

      userPrompt = prompt;
    }

    const requestPayload = {
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 8000,
    };

    console.log('📤 Sending request to OpenAI API...');
    console.log('🔗 Making fetch to:', 'https://api.openai.com/v1/chat/completions');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📥 OpenAI response status:', response.status);
    console.log('📥 OpenAI response headers:', JSON.stringify([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      console.error('❌ OpenAI API status:', response.status);
      console.error('❌ OpenAI API status text:', response.statusText);
      
      let errorMessage = `OpenAI API error (${response.status}): ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = `OpenAI API error: ${errorData.error?.message || errorText}`;
      } catch (e) {
        errorMessage = `OpenAI API error: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received successfully');
    console.log('📊 Response data keys:', Object.keys(data));
    console.log('📊 Token usage:', JSON.stringify(data.usage || {}, null, 2));
    
    // Enhanced validation with better error messages
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid OpenAI response structure - missing choices/message:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response structure from OpenAI - missing message data');
    }

    const message = data.choices[0].message;
    const finishReason = data.choices[0].finish_reason;
    
    console.log('🏁 Finish reason:', finishReason);
    
    // Check if content is empty due to length limit
    if (!message.content || message.content.trim() === '') {
      if (finishReason === 'length') {
        console.error('❌ OpenAI response truncated due to token limit. Finish reason:', finishReason);
        throw new Error('AI response was truncated due to token limit. Please try a shorter prompt or simplify your request.');
      } else {
        console.error('❌ OpenAI returned empty content. Finish reason:', finishReason);
        throw new Error('AI generated empty content. Please try again with a different prompt.');
      }
    }

    const generatedContent = message.content.trim();
    
    console.log('🎉 Successfully generated content (length:', generatedContent.length, 'characters)');
    console.log('📄 Generated content preview:', generatedContent.substring(0, 300) + '...');
    
    // Additional validation for content quality
    if (generatedContent.length < 100) {
      console.error('❌ Generated content too short:', generatedContent);
      throw new Error('Generated content appears incomplete. Please try again.');
    }

    // Try to parse as JSON first (for new format)
    try {
      const jsonResponse = JSON.parse(generatedContent);
      if (jsonResponse.ok && jsonResponse.content) {
        console.log('✅ Parsed structured JSON response successfully');
        return new Response(JSON.stringify(jsonResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.log('📝 Not JSON format, treating as raw HTML');
      console.log('🔍 Parse error:', parseError.message);
    }

    // Fallback: treat as raw HTML (legacy mode)
    if (!generatedContent.includes('<!DOCTYPE html>') && !generatedContent.includes('<html')) {
      console.error('❌ Generated content is not valid HTML:', generatedContent.substring(0, 200));
      throw new Error('Generated content is not valid HTML');
    }

    // Return in legacy format for backward compatibility
    const legacyResponse = { 
      html_content: generatedContent,
      css_content: '', // CSS is embedded in HTML
      js_content: '' // JS is embedded in HTML
    };
    
    console.log('✅ Returning legacy format response');
    return new Response(JSON.stringify(legacyResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 Error in generate-code function:', error.message);
    console.error('📍 Error name:', error.name);
    console.error('📍 Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate code',
      details: 'Check the function logs for more information',
      errorName: error.name
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Dual-phase generation function
async function handleDualPhaseGeneration(prompt: string, projectType: string, apiKey: string) {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Phase 1: Generating HTML structure and CSS (10,000 tokens)');
    
    // Phase 1: HTML Structure + CSS (10,000 tokens)
    const phase1SystemPrompt = `You are an expert web developer creating the HTML structure and CSS styling for a ${projectType}.

PHASE 1 FOCUS: HTML Structure + CSS Styling
- Generate complete HTML structure with embedded CSS
- Use Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Create responsive design and beautiful styling
- Include meta tags, viewport, and SEO elements
- NO JavaScript functionality yet - focus on structure and appearance
- Add placeholder content and forms (no JavaScript validation yet)

CRITICAL REQUIREMENTS:
- Generate a COMPLETE HTML structure with embedded CSS
- Use semantic HTML5 elements for accessibility
- Implement mobile-first responsive design
- Create professional, modern styling
- Add smooth transitions and hover effects via CSS only

RESPONSE FORMAT:
Return a JSON object:
{
  "ok": true,
  "phase": 1,
  "content": "<!DOCTYPE html>...",
  "messages": ["Phase 1: Structure and styling completed"],
  "ready_for_phase2": true
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting.`;

    const phase1Response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: phase1SystemPrompt },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 10000,
      }),
    });

    if (!phase1Response.ok) {
      throw new Error(`Phase 1 failed: ${phase1Response.statusText}`);
    }

    const phase1Data = await phase1Response.json();
    console.log('✅ Phase 1 completed, token usage:', JSON.stringify(phase1Data.usage || {}));

    let phase1Content;
    try {
      const phase1Json = JSON.parse(phase1Data.choices[0].message.content);
      phase1Content = phase1Json.content;
    } catch {
      phase1Content = phase1Data.choices[0].message.content;
    }

    console.log('🚀 Phase 2: Adding JavaScript interactivity (5,000 tokens)');
    
    // Phase 2: JavaScript Enhancement (5,000 tokens)
    const phase2SystemPrompt = `You are an expert web developer adding JavaScript interactivity to an existing HTML/CSS structure.

PHASE 2 FOCUS: JavaScript Enhancement
- Add interactive JavaScript functionality to the existing HTML structure
- Implement form validation, animations, and user interactions  
- Add event listeners, dynamic content, and smooth scrolling
- Enhance the user experience with modern JavaScript features
- Keep the existing HTML structure and CSS styling intact

CRITICAL REQUIREMENTS:
- Analyze the provided HTML structure
- Add JavaScript in <script> tags before closing </body>
- Implement proper form validation and error handling
- Add smooth scrolling, modals, and interactive elements
- Maintain the existing design and layout

RESPONSE FORMAT:
Return ONLY the complete, enhanced HTML with JavaScript added:
<!DOCTYPE html>
<html>...
</html>

IMPORTANT: Return the complete HTML including the JavaScript enhancements.`;

    const phase2Response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: phase2SystemPrompt },
          { role: 'user', content: `Here's the HTML structure from Phase 1. Please add JavaScript interactivity:\n\n${phase1Content.substring(0, 6000)}${phase1Content.length > 6000 ? '...[truncated]' : ''}` }
        ],
        max_completion_tokens: 5000,
      }),
    });

    const elapsedMs = Date.now() - startTime;

    if (!phase2Response.ok) {
      console.log('⚠️ Phase 2 failed, returning Phase 1 result as fallback');
      return new Response(JSON.stringify({
        ok: true,
        mode: "dual_phase_fallback",
        phase: 1,
        content: phase1Content,
        messages: ["Phase 1 completed successfully. Phase 2 failed - using structure-only version."],
        elapsedMs
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const phase2Data = await phase2Response.json();
    console.log('✅ Phase 2 completed, token usage:', JSON.stringify(phase2Data.usage || {}));

    const finalContent = phase2Data.choices[0].message.content.trim();
    
    console.log('🎉 Dual-phase generation completed successfully');
    console.log('📊 Total time:', elapsedMs, 'ms');

    return new Response(JSON.stringify({
      ok: true,
      mode: "dual_phase_complete",
      phase: 2,
      content: finalContent,
      messages: [
        "Phase 1: HTML structure and CSS completed (10K tokens)",
        "Phase 2: JavaScript interactivity added (5K tokens)",
        `Total generation time: ${Math.round(elapsedMs/1000)}s`
      ],
      elapsedMs,
      html_content: finalContent, // For backward compatibility
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in dual-phase generation:', error.message);
    
    return new Response(JSON.stringify({ 
      error: `Dual-phase generation failed: ${error.message}`,
      details: 'Check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}