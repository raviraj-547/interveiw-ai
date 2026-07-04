const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Interview AI Backend Running"
    });
});

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size limit exceeded. The maximum allowed size is 500MB."
            });
        }

        return res.status(400).json({
            message: `File upload error: ${err.message}`
        });
    }

    return res.status(err.status || 500).json({
        message: err.message || "An unexpected server error occurred."
    });
});

module.exports = app;