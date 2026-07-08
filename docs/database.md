# Database Design

Tables

1. Users

- id
- name
- email
- password

2. Resume

- id
- userId
- resumeUrl
- score
- feedback

3. Interview

- id
- userId
- category
- score
- feedback
- date

4. StudyPlan

- id
- userId
- topic
- completed

5. History

- id
- interviewId
- question
- answer
- AI Feedback