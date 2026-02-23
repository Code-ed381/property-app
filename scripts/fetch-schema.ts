import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function getSchema() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  
  if (json.definitions && json.definitions.maintenance_requests) {
    console.log(JSON.stringify(json.definitions.maintenance_requests, null, 2));
  } else {
    console.log("maintenance_requests not found in definitions");
  }
}

getSchema();
