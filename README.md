# Task Management
This is a basic project and task management web application which allows users to create their projects, create task lists and create and manage tasks. Each project's task lists can be seen in 2 ways, in a list view or in a Kanban view.


## Table of Contents
  - [Tech Stack](#tech-stack)
  - [Deployment](#deployment)
  - [Database Design](#database-design)
  - [App Features](#app-features)
  - [Dashboard Layout](#dashboard-layout)
  - [Upcoming Features](#upcoming-features)

## Tech Stack
* [FastAPI](https://fastapi.tiangolo.com/)
* SQLModel
* Reactjs
* Vite
* Tailwindcss

## Deployment
The api server has been deployed on [railway.app](https://railway.app/) and the frontend is deployed on cloudflare pages.

## Database Design
![Database models](images/dbdiagram.png)

## App Features
What can users do in this application

1. User can create new projects
2. User can create many tasks in a project
3. Organize their tasks into different lists
4. View their task lists in a **List view** or **Kanban View**
5. User authentication and authorization

## Dashboard Layout
![Layout](images/dashboard-layout.png)

## Upcoming Features
- [ ] Add global settings for a user's account
- [ ] Add different settings for each project, like sending reminder emails, emails when a new task is created, etc.
- [ ] Allow the users to add reminders for each task, notify them on each reminder
