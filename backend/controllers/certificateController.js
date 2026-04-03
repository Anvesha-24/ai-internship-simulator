import PDFDocument from "pdfkit";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Submission from "../models/Submission.js";

export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // --- Eligibility Check (Keep your existing logic) ---
    const totalTasks = await Task.countDocuments({ domain: user.domain });
    const submissions = await Submission.find({ user: userId }).populate("task");
    const uniqueTasks = new Set(
      submissions
        .filter((s) => s.task && s.task.domain === user.domain)
        .map((s) => s.task._id.toString())
    );

    if (uniqueTasks.size < totalTasks) {
      return res.status(400).json({
        message: `Complete all tasks to unlock (${uniqueTasks.size}/${totalTasks})`,
      });
    }

    // --- PDF Generation with UI Improvements ---
    const doc = new PDFDocument({ layout: "landscape", size: "A4" }); // Landscape is better for certificates

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
    doc.pipe(res);

    // 1. Decorative Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(5)
       .stroke("#1A365D"); // Deep Navy Blue

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .lineWidth(1)
       .stroke("#CBD5E0"); // Light Grey inner border

    // 2. Main Heading
    doc.moveDown(4);
    doc.fillColor("#1A365D")
       .fontSize(40)
       .text("CERTIFICATE", { align: "center", characterSpacing: 2 });
    
    doc.fontSize(15)
       .text("OF COMPLETION", { align: "center", characterSpacing: 5 });

    // 3. Middle Content
    doc.moveDown(2);
    doc.fillColor("#4A5568")
       .fontSize(18)
       .text("This is to proudly certify that", { align: "center" });

    doc.moveDown(1);
    doc.fillColor("#2B6CB0") // Brand Blue
       .fontSize(35)
       .text(user.name.toUpperCase(), { align: "center" });

    // Horizontal line under name
    const nameWidth = doc.widthOfString(user.name.toUpperCase());
    doc.moveTo(doc.page.width / 2 - nameWidth / 2, doc.y)
       .lineTo(doc.page.width / 2 + nameWidth / 2, doc.y)
       .stroke();

    doc.moveDown(1.5);
    doc.fillColor("#4A5568")
       .fontSize(16)
       .text(`has successfully completed the ${user.domain} Internship Simulation`, { 
           align: "center",
           lineGap: 5
       });

    // 4. Stats Grid
    doc.moveDown(2);
    const gridY = doc.y;
    doc.fontSize(12).fillColor("#718096");
    
    doc.text(`LEVEL: ${user.level || 'Beginner'}`, 100, gridY, { width: 200, align: 'center' });
    doc.text(`TOTAL XP: ${user.xp}`, 300, gridY, { width: 200, align: 'center' });
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 500, gridY, { width: 200, align: 'center' });

    // 5. Signature Area
    doc.moveDown(4);
    const sigY = doc.y;
 

    doc.end();
  } catch (err) {
    console.error("Certificate error:", err);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};