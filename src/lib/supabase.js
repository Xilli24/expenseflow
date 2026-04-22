import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://frwsmsvrjrmgvcofprbc.supabase.co";
const supabaseAnonKey = "sb_publishable_wE-VoSBgAcPWACMDMsSaVA_G38HE_mW"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);