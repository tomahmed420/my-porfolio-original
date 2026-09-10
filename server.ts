import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import multer from "multer";

const db = new Database("portfolio.db");

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    image TEXT,
    results TEXT,
    problem TEXT,
    strategy TEXT,
    caseStudyLink TEXT,
    status TEXT DEFAULT 'published',
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    company TEXT,
    quote TEXT,
    rating INTEGER,
    image TEXT,
    video TEXT,
    result TEXT,
    content TEXT,
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    level INTEGER,
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    category TEXT,
    image TEXT,
    content TEXT,
    status TEXT DEFAULT 'published'
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    details TEXT,
    date TEXT
  );
`);

// Migration: Ensure displayOrder exists in relevant tables
const tablesWithDisplayOrder = ['portfolio', 'testimonials', 'skills'];
tablesWithDisplayOrder.forEach(table => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
  const hasDisplayOrder = columns.some(col => col.name === 'displayOrder');
  if (!hasDisplayOrder) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN displayOrder INTEGER DEFAULT 0`);
  }
});

// Migration: Ensure status exists in portfolio and blog
['portfolio', 'blog'].forEach(table => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
  const hasStatus = columns.some(col => col.name === 'status');
  if (!hasStatus) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN status TEXT DEFAULT 'published'`);
  }
});

// Migration: Ensure problem and strategy exist in portfolio
const portfolioColumns = db.prepare("PRAGMA table_info(portfolio)").all() as any[];
['problem', 'strategy', 'results', 'caseStudyLink'].forEach(colName => {
  if (!portfolioColumns.some(col => col.name === colName)) {
    db.exec(`ALTER TABLE portfolio ADD COLUMN ${colName} TEXT`);
  }
});

// Migration: Ensure video, result, and content exist in testimonials
const testimonialColumns = db.prepare("PRAGMA table_info(testimonials)").all() as any[];
['video', 'result', 'content'].forEach(colName => {
  if (!testimonialColumns.some(col => col.name === colName)) {
    db.exec(`ALTER TABLE testimonials ADD COLUMN ${colName} TEXT`);
  }
});

// Seed initial data
const initialContent = [
  ['logo_text', 'SJA'],
  ['favicon', 'https://ai-studio-static.s3.amazonaws.com/favicon.ico'],
  ['primary_color', '#007bff'],
  ['secondary_color', '#6c757d'],
  ['hero_name', 'Alex Sterling'],
  ['hero_headline', 'Driving Growth Through Data-Driven Media Buying'],
  ['hero_subheadline', 'Strategic Digital Marketing for High-Growth Brands.'],
  ['hero_image', 'https://picsum.photos/seed/marketer/1920/1080'],
  ['hero_is_available', 'true'],
  ['admin_username', 'sjadmin'],
  ['admin_password', '070302@#tag'],
  ['contact_email', 'hello@nexusmarketing.com'],
  ['contact_linkedin', 'linkedin.com/in/alexsterling'],
  ['contact_twitter', 'twitter.com/alexsterling'],
  ['contact_instagram', 'instagram.com/alexsterling']
];
const insertContent = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
initialContent.forEach(([key, value]) => {
  // Always ensure admin credentials match the requested ones for this update
  if (key === 'admin_username' || key === 'admin_password') {
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)").run(key, value);
  } else {
    insertContent.run(key, value);
  }
});

const contentCount = db.prepare("SELECT COUNT(*) as count FROM content").get() as { count: number };
if (contentCount.count <= initialContent.length) {
  const initialSkills = [
    ['Meta Ads', 95],
    ['Google Tag Manager', 90],
    ['GA4 Analytics', 85],
    ['Media Buying', 88],
    ['Conversion Optimization', 92],
    ['Email Marketing', 87]
  ];
  const insertSkill = db.prepare("INSERT INTO skills (name, level, displayOrder) VALUES (?, ?, ?)");
  initialSkills.forEach(([name, level], index) => insertSkill.run(name, level, index));

  const initialPortfolio = [
    ['E-commerce Scale-up', 'Ecommerce', 'https://picsum.photos/seed/ads1/800/600', '10x ROAS', 'Low conversion rate', 'Full funnel optimization', '#', 'published', 0],
    ['SaaS Lead Gen', 'Lead Gen', 'https://picsum.photos/seed/ads2/800/600', '$5 CPL', 'High CPL', 'Targeted search ads', '#', 'published', 1]
  ];
  const insertPortfolio = db.prepare("INSERT INTO portfolio (title, category, image, results, problem, strategy, caseStudyLink, status, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  initialPortfolio.forEach(p => insertPortfolio.run(...p));

  const initialTestimonials = [
    ['Sarah Johnson', 'CEO', 'FashionHub', 'Alex transformed our digital presence.', 5, 'https://picsum.photos/seed/person1/100/100', 0],
    ['Michael Chen', 'Marketing Director', 'TechFlow', 'The most data-driven media buyer.', 5, 'https://picsum.photos/seed/person2/100/100', 1]
  ];
  const insertTestimonial = db.prepare("INSERT INTO testimonials (name, role, company, quote, rating, image, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?)");
  initialTestimonials.forEach(t => insertTestimonial.run(...t));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.post("/api/admin/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  });

  app.get("/api/admin/media", (req, res) => {
    const files = fs.readdirSync(uploadsDir);
    const media = files.map(file => ({
      url: `/uploads/${file}`,
      name: file,
      date: fs.statSync(path.join(uploadsDir, file)).mtime
    })).sort((a, b) => b.date.getTime() - a.date.getTime());
    res.json(media);
  });

  app.get("/api/content", (req, res) => {
    const content = db.prepare("SELECT * FROM content").all();
    const portfolio = db.prepare("SELECT * FROM portfolio ORDER BY displayOrder ASC").all();
    const skills = db.prepare("SELECT * FROM skills ORDER BY displayOrder ASC").all();
    const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY displayOrder ASC").all();
    const blog = db.prepare("SELECT * FROM blog").all();
    
    const contentMap = {};
    content.forEach((item: any) => contentMap[item.key] = item.value);

    res.json({
      identity: {
        logoText: contentMap['logo_text'],
        favicon: contentMap['favicon'],
        primaryColor: contentMap['primary_color'],
        secondaryColor: contentMap['secondary_color']
      },
      hero: {
        name: contentMap['hero_name'],
        headline: contentMap['hero_headline'],
        subHeadline: contentMap['hero_subheadline'],
        image: contentMap['hero_image'],
        isAvailable: contentMap['hero_is_available'] === 'true'
      },
      portfolio,
      skills,
      testimonials,
      blog
    });
  });

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = db.prepare("SELECT value FROM content WHERE key = 'admin_username'").get() as { value: string };
    const adminPass = db.prepare("SELECT value FROM content WHERE key = 'admin_password'").get() as { value: string };
    
    if (username === adminUser.value && password === adminPass.value) {
      res.json({ success: true, token: "mock-token-123" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/admin/update-identity", (req, res) => {
    const { logoText, favicon, primaryColor, secondaryColor } = req.body;
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('logo_text', ?)").run(logoText);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('favicon', ?)").run(favicon);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('primary_color', ?)").run(primaryColor);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('secondary_color', ?)").run(secondaryColor);
    res.json({ success: true });
  });

  app.post("/api/admin/update-hero", (req, res) => {
    const { name, headline, subHeadline, image, isAvailable } = req.body;
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('hero_name', ?)").run(name);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('hero_headline', ?)").run(headline);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('hero_subheadline', ?)").run(subHeadline);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('hero_image', ?)").run(image);
    db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('hero_is_available', ?)").run(isAvailable ? 'true' : 'false');
    res.json({ success: true });
  });

  app.post("/api/admin/portfolio", (req, res) => {
    const { id, title, category, image, results, problem, strategy, caseStudyLink, status } = req.body;
    if (id) {
      db.prepare("UPDATE portfolio SET title = ?, category = ?, image = ?, results = ?, problem = ?, strategy = ?, caseStudyLink = ?, status = ? WHERE id = ?")
        .run(title, category, image, results, problem, strategy, caseStudyLink, status, id);
    } else {
      db.prepare("INSERT INTO portfolio (title, category, image, results, problem, strategy, caseStudyLink, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(title, category, image, results, problem, strategy, caseStudyLink, status);
    }
    res.json({ success: true });
  });

  app.post("/api/admin/reorder", (req, res) => {
    const { type, items } = req.body;
    const update = db.prepare(`UPDATE ${type} SET displayOrder = ? WHERE id = ?`);
    const transaction = db.transaction((items) => {
      items.forEach((id: number, index: number) => update.run(index, id));
    });
    transaction(items);
    res.json({ success: true });
  });

  app.delete("/api/admin/:type/:id", (req, res) => {
    const { type, id } = req.params;
    db.prepare(`DELETE FROM ${type} WHERE id = ?`).run(id);
    res.json({ success: true });
  });

  app.get("/api/admin/leads", (req, res) => {
    const leads = db.prepare("SELECT * FROM leads ORDER BY date DESC").all();
    res.json(leads);
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    db.prepare("INSERT INTO leads (name, email, subject, message, date) VALUES (?, ?, ?, ?, ?)")
      .run(name, email, subject, message, new Date().toISOString());
    res.json({ success: true });
  });

  app.get("/api/admin/history", (req, res) => {
    const history = db.prepare("SELECT * FROM history ORDER BY date DESC LIMIT 50").all();
    res.json(history);
  });

  app.post("/api/admin/history", (req, res) => {
    const { action, details } = req.body;
    db.prepare("INSERT INTO history (action, details, date) VALUES (?, ?, ?)")
      .run(action, details, new Date().toISOString());
    res.json({ success: true });
  });

  app.post("/api/admin/blog", (req, res) => {
    const { id, title, category, image, content, status } = req.body;
    if (id) {
      db.prepare("UPDATE blog SET title = ?, category = ?, image = ?, content = ?, status = ? WHERE id = ?")
        .run(title, category, image, content, status, id);
    } else {
      db.prepare("INSERT INTO blog (title, date, category, image, content, status) VALUES (?, ?, ?, ?, ?, ?)")
        .run(title, new Date().toISOString(), category, image, content, status);
    }
    res.json({ success: true });
  });

  app.get("/api/blog", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog WHERE status = 'published' ORDER BY date DESC").all();
    res.json(posts);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
