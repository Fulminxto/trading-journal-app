export async function sendLoginCode(
  email: string,
  code: string
): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[2FA DEV] Code for ${email}: ${code} — expires in 10 min`
    );
    return;
  }
  // Production: email provider not yet wired up.
  // 2FA cannot be enabled in production until this is implemented.
}
