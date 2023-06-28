db.createUser(
    {
        user: "admin",
        pwd: "admin",
        roles: [
            {
                role: "readWrite",
                db: "bootcamp"
            }
        ]
    }
);
db.createCollection("bootcamp"); 