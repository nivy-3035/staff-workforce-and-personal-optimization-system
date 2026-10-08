import express from 'express';
import cors from 'cors';
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import staffRoutes from './routes/staffRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import designationRoutes from "./routes/designationRoutes.js";
import qualificationRoutes from "./routes/qualificationRoutes.js";
import additionalPostRoutes from "./routes/additionalPostRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import awardRoutes from "./routes/awardRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

import publicationRoutes from "./routes/publicationRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import conferenceRoutes from "./routes/conferenceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const copiesDir = path.join(__dirname, 'copies');
if (!fs.existsSync(copiesDir)) {
  fs.mkdirSync(copiesDir);
}


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/copies', express.static('copies'));
app.use('/api/staff', staffRoutes);
app.use("/api/designation", designationRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/additional-posts", additionalPostRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/award", awardRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/publication", publicationRoutes);
app.use('/api/experience', experienceRoutes); 
app.use("/api/conference", conferenceRoutes);
app.use("/api/admin", adminRoutes);


app.get('/', (req, res) => {
  res.send('Staff Management API is running.');
});

export default app;