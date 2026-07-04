const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGO_URL || '';

if (!uri || uri.includes('Add your own')) {
    console.warn('MONGO_URI not set or is a placeholder. Skipping DB connection.');
} else {
    mongoose
        .connect(uri, {})
        .then(() => {
            console.log('Database Connected Successfully');
        })
        .catch((err) => {
            console.error('Database connection error:', err);
        });
}