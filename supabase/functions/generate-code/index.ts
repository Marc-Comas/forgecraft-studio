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
    const { prompt, projectType = 'landing page' } = await req.json();

    console.log('Generating code for prompt:', prompt);

    const systemPrompt = `You are an expert web developer who creates modern, responsive, and beautiful ${projectType}s. 

Generate a complete, functional HTML page that includes:
- Modern, clean design with professional styling
- Responsive layout that works on all devices
- Embedded CSS using modern techniques (flexbox, grid, etc.)
- Interactive JavaScript where appropriate
- Accessibility features
- SEO-friendly structure

The generated code should be production-ready and visually appealing. Use modern web standards and best practices.

Return ONLY the complete HTML code with embedded CSS and JavaScript. Do not include any explanations or markdown formatting.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;

    console.log('Successfully generated code');

    return new Response(JSON.stringify({ 
      html_content: generatedCode,
      css_content: '', // CSS is embedded in HTML
      js_content: '' // JS is embedded in HTML
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate code'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});