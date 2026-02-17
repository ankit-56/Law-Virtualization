const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const laws = [
    {
        title: "The Constitution of India - Preamble",
        category: "Constitutional Law",
        description: "The Preamble to the Constitution of India records the aims and aspirations of the people of India which have been translated into the various provisions of the Constitution.",
        content: `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:
JUSTICE, social, economic and political;
LIBERTY of thought, expression, belief, faith and worship;
EQUALITY of status and of opportunity;
and to promote among them all
FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;
IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`
    },
    {
        title: "Article 21 - Protection of Life and Personal Liberty",
        category: "Constitutional Law",
        description: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
        content: `Article 21 of the Constitution of India provides that 'No person shall be deprived of his life or personal liberty except according to procedure established by law'. 
This fundamental right is available to every person, citizens and foreigners alike. 
Article 21 corresponds to the Magna Carta of 1215, the Fifth Amendment to the American Constitution, Article 40(4) of the Constitution of Eire 1937, and Article XXXI of the Constitution of Japan, 1946.`
    },
    {
        title: "Section 378 IPC - Theft",
        category: "Criminal Law",
        description: "Definition of Theft under the Indian Penal Code.",
        content: `Whoever, intending to take dishonestly any movable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft.
Explanation 1.—A thing so long as it is attached to the earth, not being movable property, is not the subject of theft; but it becomes capable of being the subject of theft as soon as it is severed from the earth.
Explanations 2-5 further clarify specific scenarios of moving property.`
    },
    {
        title: "Section 302 IPC - Punishment for Murder",
        category: "Criminal Law",
        description: "Punishment for murder under the Indian Penal Code.",
        content: `Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.`
    },
    {
        title: "Consumer Protection Act, 2019 - Rights of Consumers",
        category: "Civil Law",
        description: "Key rights provided to consumers under the 2019 Act.",
        content: `(i) the right to be protected against the marketing of goods, products or services which are hazardous to life and property;
(ii) the right to be informed about the quality, quantity, potency, purity, standard and price of goods, products or services, as the case may be, so as to protect the consumer against unfair trade practices;
(iii) the right to be assured, wherever possible, access to a variety of goods, products or services at competitive prices;
(iv) the right to be heard and to be assured that consumer's interests will receive due consideration at appropriate forums;
(v) the right to seek redressal against unfair trade practice or restrictive trade practices or unscrupulous exploitation of consumers; and
(vi) the right to consumer awareness.`
    }
];

async function seedDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to MySQL server');

        // Clear existing data (optional, but good for idempotent seeding)
        // await connection.query('DELETE FROM laws');
        // console.log('Cleared existing laws');

        // Get Category IDs
        const [categories] = await connection.query('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });

        for (const law of laws) {
            const categoryId = categoryMap[law.category] || null;
            await connection.query(
                'INSERT INTO laws (title, description, content, category_id) VALUES (?, ?, ?, ?)',
                [law.title, law.description, law.content, categoryId]
            );
            console.log(`Inserted: ${law.title}`);
        }

        console.log('Database seeding completed successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
