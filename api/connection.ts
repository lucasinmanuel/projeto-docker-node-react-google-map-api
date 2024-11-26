import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'mydb'
});

export default pool;