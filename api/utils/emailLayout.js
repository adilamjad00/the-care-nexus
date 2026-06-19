const wrapEmail = (content) => {
  const year = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL || '#';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Care Nexus</title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background-color: #eff6ff;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            background-color: #eff6ff;
            padding: 48px 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px -30px rgba(37, 99, 235, 0.25);
            border: 1px solid rgba(37, 99, 235, 0.10);
        }

        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 36px 44px;
            text-align: left;
        }

        .logo {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
            text-decoration: none;
        }

        .content {
            padding: 40px 44px 28px 44px;
        }

        .badge {
            display: inline-block;
            padding: 6px 14px;
            background-color: #eaf4fc;
            color: #2563eb;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 20px;
            border: 1px solid rgba(37, 99, 235, 0.15);
        }

        .badge-warn {
            background-color: #fff7ed;
            color: #c2410c;
        }

        .badge-danger {
            background-color: #fef2f2;
            color: #b91c1c;
        }

        .title {
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 16px 0;
            letter-spacing: -0.5px;
        }

        .text {
            font-size: 15px;
            color: #334155;
            margin: 0 0 20px 0;
            line-height: 1.65;
        }

        .text-muted {
            font-size: 13px;
            color: #64748b;
        }

        .button-container {
            margin: 28px 0 20px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 28px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 999px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
        }

        .detail-box {
            background-color: #eaf4fc;
            padding: 20px 24px;
            border-radius: 16px;
            margin: 20px 0 24px 0;
            border: 1px solid rgba(37, 99, 235, 0.12);
        }

        .detail-label {
            font-weight: 600;
            color: #2563eb;
            min-width: 110px;
        }

        .detail-value {
            color: #0f172a;
        }

        .code-box {
            background: #f1f7ff;
            border: 1px dashed rgba(37, 99, 235, 0.4);
            padding: 16px 20px;
            border-radius: 12px;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 2px;
            text-align: center;
            margin: 20px 0 24px 0;
        }

        .note {
            border-left: 3px solid #2563eb;
            padding: 2px 0 2px 16px;
            margin: 24px 0;
            font-size: 13px;
            color: #334155;
        }

        .footer {
            padding: 28px 44px 32px 44px;
            text-align: center;
            background-color: #f8fbff;
            border-top: 1px solid rgba(37, 99, 235, 0.08);
        }

        .footer-text {
            font-size: 12px;
            color: #64748b;
            margin: 0 0 8px 0;
        }

        .footer-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <a href="${frontendUrl}" class="logo">The Care Nexus</a>
            </div>

            <div class="content">
                ${content}
            </div>

            <div class="footer">
                <p class="footer-text">
                    Need help? <a href="mailto:support@carenexus.com" class="footer-link">Contact support</a>
                </p>
                <p class="footer-text">
                    &copy; ${year} The Care Nexus. Smart healthcare for modern clinics.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;
};

module.exports = { wrapEmail };
