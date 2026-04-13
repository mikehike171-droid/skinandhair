const { Client } = require('pg');
async function test() {
  const client = new Client({
    user: 'postgres', host: '98.94.89.173', database: 'skinhair', password: '12345', port: 5432
  });
  await client.connect();
  let res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'consultations'");
  console.log("Columns of consultations:", res.rows.map(r => r.column_name));
  await client.end();
}
test().catch(console.error);
