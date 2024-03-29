# Dashboard

## Questions
- [x] Import from csv
- [x] Better delete handling
  - [x] Remove question from quizzes containing it 
  - [x] Batch delete
- [x] Add to existing quiz
- [ ] Batch remove from quizzes

## Quizzes
- [x] Option to delete
- [x] Add a view for quizz details
  - [x] Table of questions
  - [x] Option to remove questions
  - [ ] Duplicate

## Categories
- [x] A view to manage question categories
- [x] Add
- [x] Remove
- [ ] View questions per category

## User
- [x] Add a view for registrering an account
  - [ ] Handle account not verified
- [ ] Manage account page
  - [x] Change password
  - [x] Change email
  - [x] 2fa
  - [ ] Edit username
- [ ] Forgot password
- [ ] Delete all user data

## Games
- [x] A way to delete games

# Client view

## Leaderboard
- [x] Finsh leaderboard view
- [x] Fix updating of leaderboard on waiting for players screen. It is not updated after the initial load

## State on join
- [x] Check why the client is not loading on specific game states

# Other ideas
- [x] CreatedAt and lastModified fields in database, to make games, quizzes, categories and questions sortable by date.
- [ ] Add support for images on questions
- [ ] Score based on time to answer (not sure if i want that)
- [ ] Add a difficulty rating per question and quiz
