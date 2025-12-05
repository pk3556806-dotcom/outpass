import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      const { passId, type } = await req.json();

      if (!passId || !type) {
        return new Response(
          JSON.stringify({ success: false, message: 'Missing passId or type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const eventType = type.toUpperCase();

      if (eventType === 'EXIT') {
        const { data, error } = await supabase
          .from('passes')
          .update({ status: 'USED', exited_at: new Date().toISOString() })
          .eq('pass_id', passId)
          .eq('status', 'APPROVED')
          .select()
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Pass not found or not approved. Cannot record EXIT.' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Student EXIT recorded successfully', data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (eventType === 'RETURN') {
        const { data, error } = await supabase
          .from('passes')
          .update({ returned_at: new Date().toISOString() })
          .eq('pass_id', passId)
          .eq('status', 'USED')
          .select()
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Pass not found or student has not exited yet. Cannot record RETURN.' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Student RETURN recorded successfully', data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: 'Invalid type. Use EXIT or RETURN' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});