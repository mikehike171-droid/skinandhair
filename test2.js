const { Pool } = require('pg')
const pool = new Pool({ user: 'postgres', host: '98.94.89.173', database: 'skinhair', password: '12345', port: 5432 })
async function run() {
  const sr = await pool.query("SELECT name FROM service_product WHERE type ILIKE 'service'")
  const serviceNames = new Set(sr.rows.map(r => r.name.toLowerCase().trim()))
  
  const result = await pool.query(`
    SELECT pe.id, pe.services, p.patient_id, pe.location_id 
    FROM patient_examination pe 
    LEFT JOIN patients p ON pe.patient_id::text = p.id::text 
    ORDER BY pe.created_at DESC LIMIT 3
  `)
  
  for(let exam of result.rows) {
     let sa = typeof exam.services === 'string' ? JSON.parse(exam.services) : exam.services;
     const products = sa.filter(s => s.service && !serviceNames.has(s.service.toLowerCase().trim()) && !['Issued', 'Received', 'Not Received'].includes(s.status || ''));
     console.log('Exam:', exam.id, 'Location:', exam.location_id, 'Patient:', exam.patient_id, 'Mapped Products:', products);
  }
  pool.end()
}
run()
