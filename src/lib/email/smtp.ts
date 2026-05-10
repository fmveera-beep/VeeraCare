import nodemailer from "nodemailer";

export function envTrim(name: string) {
  return process.env[name]?.trim();
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    envTrim("SMTP_HOST") &&
      envTrim("SMTP_PORT") &&
      envTrim("SMTP_USER") &&
      envTrim("SMTP_PASS") &&
      envTrim("SMTP_FROM")
  );
}

export function createSmtpTransporter() {
  const host = envTrim("SMTP_HOST")!;
  const port = Number(envTrim("SMTP_PORT")!);
  const user = envTrim("SMTP_USER")!;
  const pass = envTrim("SMTP_PASS")!;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function getSmtpFrom() {
  return envTrim("SMTP_FROM")!;
}
