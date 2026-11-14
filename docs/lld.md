# HireMe: Low-Level Design

For the big picture see the [High-Level Design](hld.md).

## 1. Models

```mermaid
erDiagram
  COMPANY ||--o{ JOB : posts
  JOB ||--o{ JOB_APPLICATION : receives
  USER ||--o{ JOB_APPLICATION : submits
  COMPANY ||--o{ JOB_APPLICATION : reviews
  USER {
    string _id "Clerk user id"
    string name
    string email
    string resume
    string image
  }
  COMPANY {
    string name
    string email
    string image
    string password
  }
  JOB {
    string title
    string description
    string location
    string category
    string level
    number salary
    number date
    boolean visible
    ObjectId companyId
  }
  JOB_APPLICATION {
    string userId
    ObjectId companyId
    ObjectId jobId
    string status "Pending by default"
    number date
  }
```

## 2. API

| Method | Route | Guard | Behavior |
|---|---|---|---|
| GET | `/api/jobs`, `/api/jobs/:id` | | Visible jobs and job details |
| GET | `/api/users/user` | Clerk | Candidate profile |
| POST | `/api/users/apply` | Clerk | Rejects a second application to the same job |
| GET | `/api/users/applications` | Clerk | Candidate's applications |
| POST | `/api/users/update-resume` | Clerk + multer | Uploads resume to Cloudinary |
| POST | `/api/company/register` | multer | Company with logo; password hashed; returns JWT |
| POST | `/api/company/login` | | Returns JWT (30 days) |
| GET | `/api/company/company`, `/list-jobs`, `/applicants` | company JWT | Recruiter data |
| POST | `/api/company/post-job`, `/change-status`, `/change-visiblity` | company JWT | Manage jobs and applications |
| POST | `/webhooks` | Svix signature | Clerk user sync |

## 3. Apply for a job

```mermaid
sequenceDiagram
  actor C as Candidate
  participant FE as ApplyJob page
  participant API as Express
  participant DB as MongoDB
  C->>FE: Apply
  FE->>API: POST /api/users/apply { jobId } + Clerk token
  API->>API: req.auth.userId from Clerk middleware
  API->>DB: existing application for (jobId, userId)?
  alt already applied
    API-->>FE: "Already applied"
  else
    API->>DB: create JobApplication (status Pending)
    API-->>FE: success
  end
```

## 4. Clerk webhook

| Event | Action |
|---|---|
| `user.created` | Create User with Clerk id, name, email, image, empty resume |
| `user.updated` | Update name, email, image |
| `user.deleted` | Delete the User |

## 5. Notes

`/debug-sentry` deliberately throws an error to test Sentry and should be removed or protected in production.
