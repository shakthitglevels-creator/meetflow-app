import crypto from 'crypto';

//genereate a 6-digit Secure otp
export const generateOtp = () => {
    // generate a random 6-digit number 
    // 100000 inclusice and 1000000 exclusive 
    const otp = crypto.randomInt(100000, 1000000)

    return otp.toString();
}




// // Generate a 6-digit OTP
// export const generateOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }

