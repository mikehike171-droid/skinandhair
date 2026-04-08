const { Client } = require('pg');
async function test() {
  const client = new Client({
    user: 'postgres', host: 'localhost', database: 'skinhair', password: '12345', port: 5432
  });
  await client.connect();
  
  // 1. Check location ID of user ID 1
  let res = await client.query("SELECT location_id FROM user_location_permissions WHERE user_id = 1 AND is_active = true");
  console.log("User 1 location_id(s):", res.rows);

  // 2. Check service_product products
  res = await client.query("SELECT name FROM service_product WHERE type ILIKE 'product'");
  console.log("Defined products (allowlist):", res.rows.map(r => r.name));

  // 3. Check some patient exams with services
  res = await client.query("SELECT id, location_id, services, patient_id FROM patient_examination WHERE services IS NOT NULL AND services::text != '[]' LIMIT 5");
  res.rows.forEach(r => {
    console.log(`Exam ID: ${r.id}, Location: ${r.location_id}, Services:`, JSON.stringify(r.services));
  });

  // 4. Check prescriptions
  res = await client.query("SELECT id, location_id, status, patient_id FROM patient_prescriptions LIMIT 5");
  console.log("Prescriptions:", res.rows);

  await client.end();
}
test().catch(console.error);
