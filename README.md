
# Hootify

A quiz game inspired by Kahoot. Work in progress.

Try it out on [hootify.app](https://hootify.app)
## Tech Stack

**Client:** React, Vite, TailwindCSS, shadcn/ui

**Server:** ASP.NET, MariaDB, EF Core, Core Identity, SignalR
## Run Locally

Clone the project.

```bash
git clone https://github.com/tobiasrefsholt/Hootify.git
```

Create DB and user

```bash
sudo mysql
```

```mysql
MariaDB >

CREATE DATABASE database_name;
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

Configure appsettings.json with a database connection string and api credentials for [brevo](https://www.brevo.com/) (mail service)

```json
"ConnectionStrings": {
  "MariaDB": "server=localhost;user=username;password=password;database=database_name"
},
"Brevo": {
    "ApiKey": "your-apiKey-here",
    "SenderName": "",
    "SenderEmail": "noreply@somedomain.tld"
},
```

Initial database setup

```bash
dotnet ef migrations add InitAuthContext --context AuthDbContext
dotnet ef migrations add InitAppContext --context AppDbContext
dotnet ef database update --context AuthDbContext
dotnet ef database update --context AppDbContext
```

Run dev server
```
dotnet run
```

## Dependencies
- Dotnet core 8
- MariaDB
- Nodejs (for running dev server)
## Roadmap
[TODO](TODO.md)
