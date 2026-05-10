# Hope, Inc. Human Resource System (HRS)

Welcome to the development repository for the Hope, Inc. Human Resource System (Hope HRS). This system is a 6-week capstone project for the BS Information Technology program at New Era University, built to manage core HR operations with role-based rights enforcement.

---

## 1. Project Structure & Branching Strategy

The repository follows a strict Git flow. Direct pushes to `main` or `dev` are blocked by branch protection rules.

```text
  main  (Production releases only)
   ▲
   │ (Release PR, reviewed by all 5 members)
  dev   (Integration and testing branch)
   ▲
   ├─► feat/feature-name    (Feature branches)
   ├─► db/rls-module-name   (Database triggers and policies)
   └─► chore/task-name      (Build, environment, or configuration)




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# HopeHRS

---
## 📄 Project Documentation (Module 5)
Click the links below to view the latest project documentation:

* [Software Test Plan](docs/TEST_PLAN.md) - QA checklist and role validation.
* [Security Audit Report](docs/AUDIT_REPORT.md) - Security verification log.
* [User Manual](docs/USER_MANUAL.md) - End-user navigation guide.
* [Project Glossary](docs/GLOSSARY.md) - Definition of key terms.
* [Changelog](docs/CHANGELOG.md) - Tracked updates and milestones.