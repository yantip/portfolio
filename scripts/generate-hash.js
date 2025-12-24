// Script to generate a bcrypt hash for your admin password
// Run with: node scripts/generate-hash.js "your-password-here"

const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.log('Usage: node scripts/generate-hash.js "your-password"')
  console.log('')
  console.log('Example:')
  console.log('  node scripts/generate-hash.js "mysecretpassword"')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 10)
console.log('')
console.log('Add this to your .env file:')
console.log('')
console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
console.log('')


