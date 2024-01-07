import { Poll } from 'pg'

const pool = new Poll()

pool.on('error', (err, client) => {
  console.error('Error:', err)
})
