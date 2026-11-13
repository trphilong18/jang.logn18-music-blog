import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuibnxywbpocsecdxfpo.supabase.co';
const supabaseAnonKey = 'sb_publishable_Q7FgVQrFuqmiUggOnjISDw_d3zsDGm_'; // Dán toàn bộ mã publishable key của bạn vào đây

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
