const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const categories = [
    { name: 'Constitutional Law', description: 'Laws related to the Constitution of India and fundamental rights.' },
    { name: 'Criminal Law', description: 'Laws related to crimes, punishments, and procedures under IPC and CrPC.' },
    { name: 'Civil Law', description: 'Laws related to civil disputes, property, contracts, and torts.' },
    { name: 'Corporate Law', description: 'Laws related to companies, business, and commerce.' },
    { name: 'Family Law', description: 'Laws related to marriage, divorce, succession, and adoption.' }
];

const laws = [
    // Constitutional Law (10)
    {
        title: "The Preamble to the Constitution",
        category: "Constitutional Law",
        description: "The soul and identity of the Indian democratic republic.",
        explanation: `The Preamble is the introductory statement of the Constitution which sets out the main objectives which the constituent assembly intended to achieve. 

### Why is it so important?
It is often referred to as the 'Key to the Minds of the Constitution-Makers'. It defines India as:
- **Sovereign**: Free from any external interference.
- **Socialist**: Aiming for social and economic equality.
- **Secular**: The state has no religion and respects all faiths equally.
- **Democratic**: Power in the hands of the people.
- **Republic**: The head of the state is elected, not hereditary.

### The Four Pillars
The Preamble also emphasizes Justice (Social, Economic, Political), Liberty, Equality (of status and opportunity), and Fraternity (assuring dignity and unity).`,
        content: `### THE STATUTORY TEXT
WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:

⚖️ **JUSTICE**, social, economic and political;
⚖️ **LIBERTY** of thought, expression, belief, faith and worship;
⚖️ **EQUALITY** of status and of opportunity;

and to promote among them all **FRATERNITY** assuring the dignity of the individual and the unity and integrity of the Nation;

IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`
    },
    {
        title: "Article 21 - Protection of Life and Liberty",
        category: "Constitutional Law",
        description: "The most fundamental of all human rights in the Indian legal system.",
        explanation: `Article 21 is a 'Negative Right' that prohibits the state from infringing upon life and liberty except through a valid legal procedure. 

### The Evolution of Article 21
Over the decades, the Supreme Court of India has expanded this single sentence into a mountain of protections. It is now considered the 'Heart of Fundamental Rights'.

### What does it cover today?
- **Right to Privacy**: Your personal space is protected from government prying.
- **Right to Livelihood**: The right to earn a decent living.
- **Right to Shelter**: Every human deserves a roof.
- **Right to a Clean Environment**: Access to pollution-free air and water.
- **Right to Free Legal Aid**: If you can't afford a lawyer, the state must provide one.

It ensures that a person can live with 'Dignity', not just exist like an animal.`,
        content: `### ARTICLE 21
Protection of Life and Personal Liberty.

### THE LAW
No person shall be deprived of his life or personal liberty except according to procedure established by law.

### KEY INTERPRETATIONS
1. **Both Citizens and Foreigners**: This right is available to every human being on Indian soil.
2. **Absolute Protection**: Even during a National Emergency, this right cannot be fully taken away.
3. **Due Process**: Justice Bhagwati in the Maneka Gandhi case ruled that any law depriving life must be 'Fair, Just, and Reasonable'.`
    },
    {
        title: "Article 14 - Right to Equality",
        category: "Constitutional Law",
        description: "Fundamental principle ensuring fairness and justice for all.",
        explanation: `Article 14 is the cornerstone of Indian Democracy. It ensures that the government does not treat people arbitrarily or unfairly.

### Two Major Concepts:
1. **Equality Before Law**: (Negative Concept) No one is above the law. Whether you are a laborer or a billionaire, the legal process remains the same.
2. **Equal Protection of Laws**: (Positive Concept) People in similar circumstances should be treated similarly. It allows the government to make special laws for disadvantaged groups (like children or women) to bring them to an equal standing.

### Practical Impact
It prohibits 'Class Legislation' but allows for 'Reasonable Classification'. It is the reason why we have separate queues for senior citizens or special programs for the girl child.`,
        content: `### ARTICLE 14
Equality before Law.

### THE LAW
The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.

### CRITICAL RULES
- **Rule of Law**: Arbitrary power is prohibited.
- **Vires of Discretion**: Any government official using power must follow the rules of fairness.
- **Non-Discrimination**: The state cannot favor one individual over another without a reasonable scientific basis.`
    },
    {
        title: "Article 21A - Right to Education",
        category: "Constitutional Law",
        description: "Ensuring every child goes to school.",
        explanation: "Free and compulsory education for all children aged 6 to 14.",
        content: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine."
    },
    {
        title: "Article 25 - Freedom of Religion",
        category: "Constitutional Law",
        description: "The secular foundation of India.",
        explanation: "You are free to follow and practice any religion you believe in.",
        content: "Subject to public order, morality and health... all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion."
    },
    {
        title: "Article 32 - Constitutional Remedies",
        category: "Constitutional Law",
        description: "Direct access to the Supreme Court.",
        explanation: "If your rights are violated, you can go straight to the highest court.",
        content: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed."
    },
    {
        title: "Article 44 - UCC (Directive)",
        category: "Constitutional Law",
        description: "The vision for a Uniform Civil Code.",
        explanation: "The goal to have one common law for all citizens for personal matters.",
        content: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India."
    },
    {
        title: "Article 51A - Fundamental Duties",
        category: "Constitutional Law",
        description: "Responsibilities of an Indian citizen.",
        explanation: "Rights come with duties—like respecting the flag and protecting nature.",
        content: "It shall be the duty of every citizen of India— (a) to abide by the Constitution and respect its ideals and institutions... (g) to protect and improve the natural environment..."
    },

    // Criminal Law (10)
    {
        title: "Section 300 IPC - Murder",
        category: "Criminal Law",
        description: "Definition of culpable homicide amounting to murder.",
        explanation: "Intentional killing of anyone is the most serious crime.",
        content: "Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death..."
    },
    {
        title: "Section 304B IPC - Dowry Death",
        category: "Criminal Law",
        description: "Specific law against dowry harassment and death.",
        explanation: "Protecting women from greed and violence within marriages.",
        content: "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage..."
    },
    {
        title: "Section 354 IPC - Outraging Modesty",
        category: "Criminal Law",
        description: "Protection of women against harassment.",
        explanation: "Criminalizing any act that uses force to disrespect a woman.",
        content: "Whoever assaults or uses criminal force to any woman, intending to outrage... her modesty, shall be punished with imprisonment..."
    },
    {
        title: "Section 375 IPC - Rape Laws",
        category: "Criminal Law",
        description: "Detailed laws protecting bodily integrity.",
        explanation: "Strict laws ensuring consent and the safety of women.",
        content: "A man is said to commit 'rape' if he operates against the will or without the consent of the woman..."
    },
    {
        title: "Section 378 IPC - Theft",
        category: "Criminal Law",
        description: "Definition of taking someone's property dishonestly.",
        explanation: "Taking something without permission with bad intent is theft.",
        content: "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property..."
    },
    {
        title: "Section 390 IPC - Robbery",
        category: "Criminal Law",
        description: "Theft combined with force or fear.",
        explanation: "If theft involves hurting someone or threatening them, it becomes robbery.",
        content: "Theft is 'robbery' if, in order to the committing of the theft, the offender causes or attempts to cause to any person death or hurt..."
    },
    {
        title: "Section 405 IPC - Criminal Breach of Trust",
        category: "Criminal Law",
        description: "Misusing property someone gave you to keep safely.",
        explanation: "If you are trusted with someone's money or property and you steal it, this law applies.",
        content: "Whoever, being in any manner entrusted with property... dishonestly misappropriates or converts to his own use that property..."
    },
    {
        title: "Section 415 IPC - Cheating",
        category: "Criminal Law",
        description: "Deceiving someone to cause them loss.",
        explanation: "Trying to trick people into giving you money or property is a crime.",
        content: "Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property..."
    },
    {
        title: "Section 420 IPC - Fraud",
        category: "Criminal Law",
        description: "Aggravated cheating involving delivery of property.",
        explanation: "The famous '420' law against large-scale scamming and financial trickery.",
        content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person... shall be punished with imprisonment for seven years."
    },
    {
        title: "Section 499 IPC - Defamation",
        category: "Criminal Law",
        description: "Harmful lies that hurt your reputation.",
        explanation: "You cannot say or write false things about someone to damage their image.",
        content: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person..."
    },

    // Civil Law (10)
    {
        title: "Transfer of Property Act - Gift",
        category: "Civil Law",
        description: "Rules for legally giving property as a gift.",
        explanation: "A gift must be voluntary and accepted by the receiver while the giver is alive.",
        content: "'Gift' is the transfer of certain existing moveable or immoveable property made voluntarily and without consideration, by one person, called the donor, to another, called the donee."
    },
    {
        title: "Indian Contract Act - Section 10",
        category: "Civil Law",
        description: "What makes an agreement a valid contract.",
        explanation: "For a deal to be legal, both must agree freely, be adults, and have a clear purpose.",
        content: "All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object."
    },
    {
        title: "Right to Information (RTI) Act",
        category: "Civil Law",
        description: "Ask any government office for answers.",
        explanation: "Every Indian citizen can ask for data about road budgets, exams, or government projects.",
        content: "An Act to provide for setting out the practical regime of right to information for citizens to secure access to information under the control of public authorities."
    },
    {
        title: "Consumer Protection Act, 2019",
        category: "Civil Law",
        description: "Rights of a buyer against bad products or services.",
        explanation: "If you buy something and it's broken or a scam, you have the right to get your money back.",
        content: "An Act to provide for protection of the interests of consumers and for the said purpose, to establish authorities for timely and effective administration of consumer disputes."
    },
    {
        title: "Motor Vehicles Act - Insurance",
        category: "Civil Law",
        description: "Mandatory Third-Party Insurance.",
        explanation: "You MUST have insurance to drive a car or bike, to cover damage to others.",
        content: "No person shall use, except as a passenger, or cause or allow any other person to use, a motor vehicle in a public place, unless there is in force in relation to the use... a policy of insurance."
    },
    {
        title: "Law of Torts - Negligence",
        category: "Civil Law",
        description: "Being careless and causing harm to others.",
        explanation: "If someone's carelessness hurts you, they must pay for your loss.",
        content: "Negligence is the breach of a duty caused by the omission to do something which a reasonable man, guided by those considerations which ordinarily regulate the conduct of human affairs, would do."
    },
    {
        title: "Easement Act - Right to Way",
        category: "Civil Law",
        description: "Your right to pass through a path you've used for years.",
        explanation: "If you have used a road for 20 years, no one can suddenly block it for you.",
        content: "An easement is a right which the owner or occupier of certain land possesses, as such, for the beneficial enjoyment of that land, to do and continue to do something, or to prevent and continue to prevent something."
    },
    {
        title: "Arbitration and Conciliation Act",
        category: "Civil Law",
        description: "Solving fights outside the court.",
        explanation: "Using an expert mediator to settle disputes quickly without a long court case.",
        content: "To consolidate and amend the law relating to domestic arbitration, international commercial arbitration and enforcement of foreign arbitral awards."
    },
    {
        title: "Specific Relief Act, 1963",
        category: "Civil Law",
        description: "Forcing someone to finish a deal they promised.",
        explanation: "If someone promised to sell you a house and now refuses, the court can force them to sell it.",
        content: "An Act to define and amend the law relating to certain kinds of specific relief."
    },
    {
        title: "Indian Evidence Act - Section 3",
        category: "Civil Law",
        description: "What counts as proof in a civil case.",
        explanation: "Documents, videos, and witness statements that the court can use to decide the truth.",
        content: "'Evidence' means and includes all statements which the Court permits or requires to be made before it by witnesses, in relation to matters of fact under inquiry."
    },

    // Corporate Law (10)
    {
        title: "Companies Act - Digital Signatures",
        category: "Corporate Law",
        description: "Verifying business documents online.",
        explanation: "Electronic signatures have the same power as physical ones for company papers.",
        content: "The Central Government may, by notification, make rules for the use of electronic signature in such manner as it may deem fit."
    },
    {
        title: "Companies Act - Director Duties",
        category: "Corporate Law",
        description: "Responsibilities of a person running a company.",
        explanation: "A director must act honestly and always protect the company's interest.",
        content: "A director of a company shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole."
    },
    {
        title: "GST Act, 2017",
        category: "Corporate Law",
        description: "The 'One Nation, One Tax' law for goods and services.",
        explanation: "A single tax format across India making business easier for everyone.",
        content: "An Act to make a provision for levy and collection of tax on intra-State supply of goods or services or both by the Central Government."
    },
    {
        title: "Insolvency and Bankruptcy Code (IBC)",
        category: "Corporate Law",
        description: "How to handle a business that cannot pay its loans.",
        explanation: "A system to either save the company or sell its assets to pay back lenders quickly.",
        content: "The Objective of the IBC is to consolidate and amend the laws relating to reorganization and insolvency resolution of corporate persons."
    },
    {
        title: "SEBI Act, 1992",
        category: "Corporate Law",
        description: "Protection for people who invest in the stock market.",
        explanation: "SEBI acts as a watch-dog to ensure no one cheats you when you buy shares.",
        content: "To provide for the establishment of a Board to protect the interests of investors in securities and to promote the development of the securities market."
    },
    {
        title: "FEMA - Foreign Exchange",
        category: "Corporate Law",
        description: "Rules for doing business with other countries.",
        explanation: "Managing how much foreign money (dollars, euros) can be brought into or out of India.",
        content: "An Act to consolidate and amend the law relating to foreign exchange with the objective of facilitating external trade and payments."
    },
    {
        title: "Competition Act, 2002",
        category: "Corporate Law",
        description: "Preventing big companies from creating monopolies.",
        explanation: "Ensuring there is fair competition so that customers get the best prices.",
        content: "An Act to provide for... the establishment of a Commission to prevent practices having adverse effect on competition."
    },
    {
        title: "Partnership Act, 1932",
        category: "Corporate Law",
        description: "Laws for businesses started by two or more friends.",
        explanation: "Defines how partners share profits and who is responsible for losses.",
        content: "'Partnership' is the relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all."
    },
    {
        title: "Limited Liability Partnership (LLP) Act",
        category: "Corporate Law",
        description: "A safer way to start a business partnership.",
        explanation: "If the business fails, your personal home and car are safe from bank loans.",
        content: "An Act to make provisions for the formation and regulation of limited liability partnerships and for matters connected therewith."
    },
    {
        title: "IT Act - E-Commerce Rules",
        category: "Corporate Law",
        description: "Laws for shops selling on Amazon, Flipkart, etc.",
        explanation: "Electronic contracts and online shopping have strict consumer protection rules.",
        content: "The legal recognition of electronic records and digital signatures for facilitating electronic governance and commerce."
    },

    // Family Law (10)
    {
        title: "Hindu Marriage Act - Section 5",
        category: "Family Law",
        description: "Valid conditions for a marriage.",
        explanation: "Both must be of legal age, be sane, and not already married to someone else.",
        content: "A marriage may be solemnized... if neither party has a spouse living, the bridegroom has completed 21 years and the bride 18 years..."
    },
    {
        title: "Special Marriage Act, 1954",
        category: "Family Law",
        description: "Marriage for couples of different religions.",
        explanation: "A secular way to marry without changing your religion.",
        content: "An Act to provide a special form of marriage in certain cases and for the registration of such and certain other marriages."
    },
    {
        title: "Section 125 CrPC - Maintenance",
        category: "Family Law",
        description: "Right of wives, children, and parents to money for food/bills.",
        explanation: "A husband/father must give financial support to dependent family members.",
        content: "If any person having sufficient means neglects or refuses to maintain his wife, unable to maintain herself, or his legitimate or illegitimate minor child..."
    },
    {
        title: "Guardians and Wards Act, 1890",
        category: "Family Law",
        description: "Who takes care of a child if parents aren't there.",
        explanation: "The court decides the best guardian, keeping the child's happiness as the priority.",
        content: "An Act to consolidate and amend the law relating to Guardian and Ward for the benefit of the minor's welfare."
    },
    {
        title: "Hindu Succession Act - Daughters' Rights",
        category: "Family Law",
        description: "Equal share in father's property for daughters.",
        explanation: "Since 2005, daughters have the exact same right to property as sons.",
        content: "In a Joint Hindu family, the daughter of a coparcener shall by birth become a coparcener in her own right in the same manner as the son."
    },
    {
        title: "Adoption (HAMA) Rules",
        category: "Family Law",
        description: "How to legally adopt a child.",
        explanation: "Once adopted, the child has the same legal rights as a biological child.",
        content: "Any Hindu male or female who is of sound mind and is not a minor has the capacity to take a son or a daughter in adoption."
    },
    {
        title: "Special Marriage Act - Notice of Marriage",
        category: "Family Law",
        description: "The 30-day notice for a court marriage.",
        explanation: "You must tell the marriage officer 30 days in advance to allow for any legal objections.",
        content: "When a marriage is intended to be solemnized under this Act, the parties to the marriage shall give notice thereof in writing in the form specified."
    },
    {
        title: "Domestic Violence Act - Shelter Homes",
        category: "Family Law",
        description: "Safe places for women facing abuse.",
        explanation: "Government must provide a roof for women who cannot stay in their own homes due to violence.",
        content: "The victim has a right to be accommodated in a shelter home if she is at risk of violence within her domestic relationship."
    },
    {
        title: "Maintenance and Welfare of Parents Act",
        category: "Family Law",
        description: "Children's duty to take care of elderly parents.",
        explanation: "If you don't look after your old parents, they can legally claim monthly money from you.",
        content: "An Act to provide for more effective provisions for the maintenance and welfare of parents and senior citizens guaranteed and recognized under the Constitution."
    },
    {
        title: "Section 13 Hindu Marriage Act - Mutual Divorce",
        category: "Family Law",
        description: "Parting ways by mutual agreement.",
        explanation: "If both agree, divorce can be obtained peacefully in about 6-18 months.",
        content: "A petition for dissolution of marriage by a decree of divorce may be presented to the district court by both the parties together on the ground that they have lived separately."
    }
];

const seedDatabase = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to MySQL server');

        // Clear existing data
        await connection.query('DELETE FROM bookmarks');
        await connection.query('DELETE FROM laws');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM users');

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('Ankit@772888', salt);
        await connection.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            ['Ankit Admin', 'ankitrautsingh@gmail.com', adminPassword, 'admin']
        );
        console.log('Admin user created: ankitrautsingh@gmail.com');

        // Clear and Insert Categories and get their IDs
        await connection.query('DELETE FROM categories');
        const categoryMap = {};
        for (const cat of categories) {
            const [result] = await connection.query(
                'INSERT INTO categories (name, description) VALUES (?, ?)',
                [cat.name, cat.description]
            );
            categoryMap[cat.name] = result.insertId;
        }
        console.log('Categories inserted');

        // Insert Laws
        for (const law of laws) {
            const categoryId = categoryMap[law.category];
            await connection.query(
                'INSERT INTO laws (title, category_id, description, explanation, content, media_urls) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    law.title, 
                    categoryId, 
                    law.description, 
                    law.explanation || '', 
                    law.content, 
                    JSON.stringify(["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop"])
                ]
            );
        }
        console.log(`Successfully inserted ${laws.length} laws.`);

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (connection) await connection.end();
    }
};

seedDatabase();
