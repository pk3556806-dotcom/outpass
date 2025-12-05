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

    const { role, username, password } = await req.json();

    if (!role || !username || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let user = null;
    let tableName = '';
    let usernameField = '';

    switch (role.toUpperCase()) {
      case 'STUDENT':
        tableName = 'students';
        usernameField = 'usn';
        break;
      case 'WARDEN':
        tableName = 'wardens';
        usernameField = 'username';
        break;
      case 'SECURITY':
        tableName = 'security_guards';
        usernameField = 'guard_id';
        break;
      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(usernameField, username)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    user = data;

    const response = {
      success: true,
      message: 'Login successful',
      role: role.toUpperCase(),
      name: user.name,
      identifier: user[usernameField],
      usn: role.toUpperCase() === 'STUDENT' ? user.usn : undefined,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});