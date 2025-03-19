# Setup Project

Create .env file

```dotenv
DATABASE_URL="mysql://janedoe:mypassword@localhost:3306/mydb"
```

```shell
npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start
```