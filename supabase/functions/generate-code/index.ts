import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const requestBody = await req.json();
    const { prompt, projectType = 'landing page', projectId, filePath, code, intent = 'code' } = requestBody;

    console.log('🚀 Generating code with OpenAI');
    console.log('📝 Prompt length:', prompt?.length || 0);
    console.log('🎯 Project type:', projectType);
    console.log('🔑 API key configured:', !!openAIApiKey);

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
      // Project generation mode - create new templates
      systemPrompt = `You are an expert web developer who creates modern, responsive, and beautiful ${projectType}s using the latest web technologies.

CRITICAL REQUIREMENTS:
- Generate a COMPLETE, FUNCTIONAL HTML page with embedded CSS and JavaScript
- Use Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Implement responsive design that works perfectly on mobile, tablet, and desktop
- Include interactive JavaScript features where appropriate
- Use semantic HTML5 elements for accessibility
- Add proper meta tags for SEO
- Create visually stunning designs with professional styling
- Use modern color schemes and typography
- Add smooth transitions and hover effects

TECHNICAL SPECIFICATIONS:
- Use Tailwind CSS classes for styling
- Embed custom CSS in <style> tags only when absolutely necessary
- Embed ALL JavaScript in <script> tags before closing </body>
- Use CSS Grid and Flexbox (via Tailwind) for layouts
- Implement mobile-first responsive design
- Add proper viewport meta tag
- Include favicon and meta descriptions
- Use modern CSS features (custom properties, clamp(), etc.)

STRUCTURE REQUIREMENTS:
- Navigation with logo and menu items
- Hero section with compelling headline and CTA
- Features/Services section
- Gallery/Portfolio/Products section (depending on type)
- Pricing section (for business/SaaS)
- FAQ section
- Contact form with proper validation
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
      max_completion_tokens: 15000, // Increased significantly for full HTML generation
    };

    console.log('📤 Sending request to OpenAI API');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📥 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received');
    console.log('🔍 Response data:', JSON.stringify(data, null, 2));
    
    // Enhanced validation with better error messages
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid OpenAI response structure - missing choices/message:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response structure from OpenAI - missing message data');
    }

    const message = data.choices[0].message;
    const finishReason = data.choices[0].finish_reason;
    
    // Check if content is empty due to length limit
    if (!message.content || message.content.trim() === '') {
      if (finishReason === 'length') {
        console.error('❌ OpenAI response truncated due to token limit. Finish reason:', finishReason);
        console.error('📊 Usage stats:', JSON.stringify(data.usage || {}, null, 2));
        throw new Error('AI response was truncated due to token limit. Please try a shorter prompt or simplify your request.');
      } else {
        console.error('❌ OpenAI returned empty content. Finish reason:', finishReason);
        throw new Error('AI generated empty content. Please try again with a different prompt.');
      }
    }

    console.log('📊 Token usage:', JSON.stringify(data.usage || {}, null, 2));
    console.log('🏁 Finish reason:', finishReason);

    const generatedContent = data.choices[0].message.content.trim();
    
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
        console.log('✅ Parsed structured JSON response');
        return new Response(JSON.stringify(jsonResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.log('📝 Not JSON format, treating as raw HTML');
    }

    // Fallback: treat as raw HTML (legacy mode)
    if (!generatedContent.includes('<!DOCTYPE html>') && !generatedContent.includes('<html')) {
      console.error('❌ Generated content is not valid HTML:', generatedContent.substring(0, 200));
      throw new Error('Generated content is not valid HTML');
    }

    // Return in legacy format for backward compatibility
    return new Response(JSON.stringify({ 
      html_content: generatedContent,
      css_content: '', // CSS is embedded in HTML
      js_content: '' // JS is embedded in HTML
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💥 Error in generate-code function:', error);
    console.error('📍 Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate code',
      details: 'Check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});