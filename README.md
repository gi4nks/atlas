# Atlas

Atlas is a lightweight internal web application to catalog, track, and manage multiple personal software applications and experiments.

It is designed to be the "One Source of Truth" for your projects, restoring clarity and ownership.

## 🚀 Features

- **Data First:** All data is stored in simple YAML files in `apps/`.
- **Overview:** View all your apps, filtered by status, category, etc.
- **Details:** Deep dive into each app's stack, running instructions, and future ideas.
- **Zero Config:** No database, no auth, just files.

## 📂 Project Structure

```
/gi4nks
  /apps           # WHERE YOUR DATA LIVES (One YAML per app).
  /templates      # Templates for new apps.
  /atlas          # Next.js Application source code.
    /app            # Next.js App Router source code.
    /components     # React components.
    /lib            # Backend logic (file reading).
    /types          # TypeScript definitions.
```

## 🛠️ How to Add a New App

1.  From the `gi4nks` root (parent of `atlas`):
    ```bash
    cp templates/app.template.yml apps/my-new-app.yml
    ```
2.  Edit the YAML file with your app's details.
3.  Refresh Atlas!

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + DaisyUI
- **Data:** Local File System (YAML)

## 🏃‍♂️ Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000).

## 🐳 Running with Docker

You can run Atlas using Docker. The `../apps` folder is mounted as a volume to `/apps` inside the container, matching the application's internal search path.

1.  Build and start the container:
    ```bash
    docker-compose up -d
    ```

2.  Atlas will be available at [http://localhost:3000](http://localhost:3000).

## 🔮 Roadmap

- [ ] Search functionality (Client-side)
- [ ] Filtering by Status/Category
- [ ] Auto-import git metadata
- [ ] Health scores