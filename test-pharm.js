const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/v1/pharmacy/billed-products',
  method: 'GET',
};

// We don't have auth token easily, let's query the DB directly in this script.
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'skinhair',
  password: '12345',
  port: 5432,
});

async function test() {
  try {
    const productsResult = await pool.query("SELECT name FROM service_product WHERE type = 'Product'");
    const productNames = new Set(productsResult.rows.map(r => r.name.toLowerCase().trim()));
    console.log("Products in DB:", Array.from(productNames));

    const result = await pool.query(`
        SELECT 
          pe.id as examination_id,
          pe.patient_id,
          pe.created_at,
          pe.services,
          COALESCE(p.first_name || ' ' || p.last_name, 'Unknown Patient') as patient_name,
          p.patient_id as patient_code
        FROM patient_examination pe
        LEFT JOIN patients p ON pe.patient_id::text = p.id::text
        WHERE pe.services IS NOT NULL AND pe.services::text != '[]'
        ORDER BY pe.created_at DESC LIMIT 10
      `);

    const billedProducts = [];
    for (const exam of result.rows) {
      let servicesArray = [];
      try {
        servicesArray = typeof exam.services === 'string' ? JSON.parse(exam.services) : exam.services;
      } catch (e) { continue; }
      
      if (!Array.isArray(servicesArray)) continue;

      const productsInExam = servicesArray.filter(s => 
        productNames.has((s.service || '').toLowerCase().trim()) && 
        s.status !== 'Issued'
      );
      if (productsInExam.length > 0) {
        billedProducts.push({
          examination_id: exam.examination_id,
          patient_name: exam.patient_name,
          patient_code: exam.patient_code,
          products: productsInExam
        });
      }
    }
    console.log("Billed Products:", JSON.stringify(billedProducts, null, 2));
  } catch(e) { console.error(e); }
  pool.end();
}
test();
