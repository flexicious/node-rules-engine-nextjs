import type { NextApiRequest, NextApiResponse } from 'next'
/// @ts-ignore
import { Database } from 'sqlite-async'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, username, password, birthdate, gender} = req.body
    const db = await Database.open('database.db')
    if (await doesUserExistWith(email, username))
        return res.status(409).send({ message: "User with the given email or username exists" })
    try {
        await db.run(`INSERT INTO [users] (email, username, password, birthdate, gender)
                           VALUES (?, ?, ?, ?, ?)`, [email, username, password, birthdate, gender])
        return res.status(201).json({ message: 'Created', user: { ...req.body } })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error" })
    }

}
async function doesUserExistWith(email: any, username: any) {
    const db = await Database.open('database.db')
    const row = await db.get(`SELECT COUNT([id])
                                FROM [users]
                               WHERE [users].[email] = ?
                                  OR [users].[username] = ?
                               LIMIT 1`, [email, username])
    return row["COUNT([id])"]
}

