# Codebase Structure

This project is split into two main parts:

- `staysmart_UI/` — Angular frontend application
- `staysmart_backend/` — Spring Boot backend application

---

## 1. Project layout

```text
StaySmart/
├── CODEBASE_STRUCTURE.md
├── staysmart_UI/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── app.routes.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.ts
│   │   │   └── app.html
│   │   ├── index.html
│   │   └── main.ts
│   └── public/
│
└── staysmart_backend/
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    └── src/
        ├── main/
        │   ├── java/com/staysmart/stay_smart/
        │   │   ├── config/
        │   │   ├── controller/
        │   │   ├── dto/
        │   │   ├── service/
        │   │   └── StaySmartApplication.java
        │   └── resources/
        │       ├── application.properties
        │       └── static/
        └── test/
```

---

## 2. Frontend: `staysmart_UI`

This is the Angular storefront and admin frontend.

### Main folders

#### `src/app/components/`
This contains page-level UI components such as:

- `home/` — landing page
- `product-listing/` — products page
- `product-detail/` — product detail view
- `header/` — global header with logo and wishlist state

#### `src/app/admin/`
This contains the admin panel implementation.

Typical structure:

- `admin.routes.ts` — admin routing
- `components/` — login, dashboard, orders, reviews, analytics
- `services/` — admin auth and admin API logic
- `guards/` — protected admin routes
- `models/` — admin domain models

#### `src/app/services/`
This contains application logic and API integration.

Examples:

- `product.service.ts` — product data calls
- `wishlist.service.ts` — wishlist persistence and actions
- `cart.service.ts` — cart behavior and order payloads
- `review.service.ts` — review submission and dummy data
- `admin-api.service.ts` — admin login and backend API communication

#### `src/app/models/`
This contains TypeScript interfaces used across the UI.

Examples:

- `tshirt.model.ts` — products, orders, order rows
- `review.model.ts` — customer review models

#### `src/app/app.routes.ts`
This file defines the main app routes, such as:

- `/` — home page
- `/products/:category` — product listing page
- `/products/:category/:productId` — product detail page
- `/admin/*` — admin routes

#### `src/app/app.config.ts`
This configures app-level providers, including Angular HTTP support.

---

## 3. Backend: `staysmart_backend`

This is the Spring Boot backend app that exposes APIs and can later be used to serve the Angular UI.

### Main folders

#### `controller/`
Contains REST controllers for API endpoints.

Examples:

- `AdminController.java` — admin login API
- `FrontendController.java` — SPA route fallback for frontend routing

#### `config/`
Contains configuration classes such as:

- `WebConfig.java` — CORS setup and web config

#### `dto/`
Contains request/response models for API exchange.

Examples:

- `AdminLoginRequest.java`
- `AdminLoginResponse.java`

#### `service/`
Business logic layer for future backend features.

#### `resources/`
Contains app configuration and static assets.

Examples:

- `application.properties`
- `static/` — can hold built Angular frontend output later

#### `StaySmartApplication.java`
This is the main entry point for the Spring Boot application.

---

## 4. How the frontend and backend connect

The Angular app runs locally on:

- `http://localhost:4200`

The Spring Boot app runs locally on:

- `http://localhost:8081`

The admin login flow is intended to call:

```text
POST http://localhost:8081/api/admin/login
```

The request carries:

- username
- password

If the credentials match:

- username = `aDmIn`
- password = `AdMiN`

then the backend returns a success response and the Angular UI redirects to the admin dashboard.

---

## 5. Current application flow

### Customer flow

1. User opens homepage
2. User browses categories and products
3. User adds items to wishlist/cart
4. User checks out after selecting size, category, and product info
5. Data is mapped into order rows and tracked as a structured order payload

### Admin flow

1. User clicks the admin link in the header
2. Angular loads the admin login screen
3. Admin sends username/password to backend
4. Backend validates credentials
5. If valid, admin is redirected to dashboard
6. Dashboard shows overview, orders, reviews, analytics

---

## 6. Why this structure is good

This split is ideal for a real production system because:

- Angular handles frontend experience and UI state
- Spring Boot handles API logic and authentication
- admin features can be extended without mixing backend logic into the UI layer
- it is easy to dockerize and deploy later to AWS

---

## 7. Local development commands

### Frontend

```bash
cd E:\Supriya_projects\DuoVia_ECom\StaySmart\staysmart_UI
npm start
```

### Backend

```bash
cd E:\Supriya_projects\DuoVia_ECom\StaySmart\staysmart_backend
./mvnw spring-boot:run
```

> Note: If Maven cannot resolve dependencies due to Java certificate issues, the local environment needs certificate trust configuration before the Spring Boot app can run.

---

## 8. Deployment direction

For later AWS/Docker deployment, the preferred approach is:

1. Build the Angular app
2. Copy the generated static build into `src/main/resources/static`
3. Run the Spring Boot app as the final packaged application
4. Deploy the backend container in Docker/ECS or EC2

This keeps the app as a single deployable service later while still keeping frontend and backend code organized during development.

---

## 9. Summary

- `staysmart_UI` = frontend experience
- `staysmart_backend` = backend API and deployment host
- both are connected by HTTP API calls
- the admin section is protected and designed to become full business operations later

This is a clean and scalable architecture for a storefront + admin + analytics application.
