import axios from "axios"
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const PASSWORD = "Rahul@123"

export async function createUser(): Promise<{
    id: string,
    jwt: string
}> {
    const uniqueUsername = `user${Date.now()}@test.com`;
    
    const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
        username: uniqueUsername,
        password: PASSWORD
    })

    const resSignin = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
        username: uniqueUsername,
        password: PASSWORD
    })

    return {
        id: res.data.id,
        jwt: resSignin.data.token
    }
}