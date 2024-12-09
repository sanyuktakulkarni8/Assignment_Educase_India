const db = require('../config/db');
const calculateDistance = require('../utils/distanceCalculator');

exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        await db.execute(query, [name, address, latitude, longitude]);
        res.status(201).json({ message: "School added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
        const [schools] = await db.execute('SELECT * FROM schools');
        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
