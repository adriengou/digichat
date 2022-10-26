import crypto from "crypto";

export function hashPassword(password) {
    let hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    return hashedPassword;
}