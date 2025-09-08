import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { prompt, projectType = 'landing page' } = requestBody;

    console.log('🚀 Generating code with OpenAI');
    console.log('📝 Prompt length:', prompt?.length || 0);
    console.log('🎯 Project type:', projectType);
    console.log('🔑 API key configured:', !!openAIApiKey);

    const systemPrompt = `You are an expert web developer who creates modern, responsive, and beautiful ${projectType}s using the latest web technologies.

CRITICAL REQUIREMENTS:
- Generate a COMPLETE, FUNCTIONAL HTML page with embedded CSS and JavaScript
- Use modern CSS techniques (flexbox, grid, CSS variables, animations)
- Implement responsive design that works perfectly on mobile, tablet, and desktop
- Include interactive JavaScript features where appropriate
- Use semantic HTML5 elements for accessibility
- Add proper meta tags for SEO
- Create visually stunning designs with professional styling
- Use modern color schemes and typography
- Add smooth transitions and hover effects

TECHNICAL SPECIFICATIONS:
- Embed ALL CSS in <style> tags within the <head>
- Embed ALL JavaScript in <script> tags before closing </body>
- Use CSS Grid and Flexbox for layouts
- Implement mobile-first responsive design
- Add proper viewport meta tag
- Include favicon and meta descriptions
- Use modern CSS features (custom properties, clamp(), etc.)

OUTPUT FORMAT:
Return ONLY the complete HTML code. Do not include markdown formatting, explanations, or any other text. The response must start with <!DOCTYPE html> and be a complete, valid HTML document.

EXAMPLE STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>...</title>
    <style>
        /* Modern CSS with animations, responsive design, beautiful styling */
    </style>
</head>
<body>
    <!-- Semantic HTML with beautiful, functional content -->
    <script>
        // Interactive JavaScript functionality
    </script>
</body>
</html>`;

    const requestPayload = {
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 4000,
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
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('❌ Invalid OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }

    const generatedCode = data.choices[0].message.content;
    
    // Validate that we got HTML content
    if (!generatedCode.includes('<!DOCTYPE html>') && !generatedCode.includes('<html')) {
      console.error('❌ Generated content is not valid HTML:', generatedCode.substring(0, 200));
      throw new Error('Generated content is not valid HTML');
    }

    console.log('🎉 Successfully generated HTML code (length:', generatedCode.length, 'characters)');
    console.log('📄 Generated code preview:', generatedCode.substring(0, 200) + '...');

    return new Response(JSON.stringify({ 
      html_content: generatedCode,
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