export default async function seed(db) {
    await db.run(`CREATE TABLE IF NOT EXISTS [users] 
    (
        [id] INTEGER PRIMARY KEY AUTOINCREMENT, 
        [email] TEXT NOT NULL, 
        [username] TEXT NOT NULL, 
        [gender] TEXT NOT NULL,  
        [birthdate] TEXT NOT NULL, 
        [password] TEXT NOT NULL
    )`)
}