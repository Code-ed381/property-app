import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testInsert() {
  console.log("Testing insert into maintenance_requests...");
  
  const { data: tenant } = await supabase.from("tenants").select("id").limit(1).single();
  
  if (!tenant) return;

  const statuses = ['PENDING', 'pending', 'Pending', 'Open', 'OPEN', 'open', 'New', 'NEW', 'new'];

  for (const st of statuses) {
    console.log(`Trying status: ${st}`);
    const { error } = await supabase
      .from("maintenance_requests")
      .insert([{
        tenant_id: tenant.id,
        title: "Test Issue",
        description: "Test Description",
        priority: "LOW",
        status: st,
      }]);

    if (!error) {
      console.log(`✅ SUCCESS WITH STATUS: ${st}`);
      // cleanup
      await supabase.from("maintenance_requests").delete().eq("title", "Test Issue");
      return;
    } else {
      console.log(`❌ Failed with status: ${st} - ${error.message}`);
    }
  }
}

testInsert();
