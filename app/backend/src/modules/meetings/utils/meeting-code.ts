import crypto from "crypto"


// Characters chosen to avoid confusion like O/0 and I/1
const ALLOWED_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Generate a 6 character meeting code 
export const generateMeetingCode = () => {
    let code = ""

    // Add one secure random character at a time 
    for (let index = 0; index < 6 ; index++) {
        const randowIndex = crypto.randomInt(
            0, ALLOWED_CHARACTERS.length
        );

        code += ALLOWED_CHARACTERS[randowIndex]

    }

    return code 
}