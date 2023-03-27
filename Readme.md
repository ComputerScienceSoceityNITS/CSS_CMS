# CSS_CMS

A headless CMS for CSS Website and App.

## MASTER BRANCH

`Don't Mess With Master`

### Routes

- `/api/admin/` Routes

### Route for Admin

- Post `/api/admin/register` register
- Post `/api/admin/login` login
- Get `/api/admin/logout` logout

### Route for Members

- Post `/api/admin/member/new` add member
- Put `/api/admin/member/:id` updateMemberdeleteMember
- delete `/api/admin/member/:id` deleteMember
- Get `/api/admin/members/:batch` all members of the batch

### Route for Users

- Get `/api/admin/user/` get signed in user details
- Post `/api/admin/user/signup` register/signup user
- Post `/api/admin/user/login` login user
- Get `/api/admin/user/logout` logout user

### Route for Abacus Events

- Post `/api/admin/abacus/` create event _admin only_
- Patch `/api/admin/abacus/:event_id` update event _admin only_
- Delete `/api/admin/abacus/:event_id` delete event _admin only_
- Get `/api/admin/abacus/` get all abacus events
- Post `/api/admin/abacus/register/:event_id` register signed-in user for event

### Route for Enigma Events

- Post `/api/admin/enigma` create enigma _admin only_
- Patch `/api/admin/enigma/:enigma_id` update enigma _admin only_
- Delete `/api/admin/enigma/:enigma_id` delete enigma _admin only_
- Get `/api/admin/enigma` get details on all enigmas
- Post `/api/admin/enigma/register/:enigma_id` register signed-in user for enigma
- Get `/api/admin/enigma/cfID` get all users with provided codeforces handles

### Fields for user creation

- `name` : string, required
- `email` : string, required
- `password`: string, required
- `scholarID`: string, required
- `codeforcesHandle`: string, optional
- `githubHandle`: string, optional

### Fields for abacus event creation

- `name`: string, required
- `description`: string, required
- `startDate`, `endDate`: string, required
- `eventType`: string, required
- `minTeamSize`, `maxTeamSize`: string, required
- `startTime`: string, required
- `coverPic`: base64 encoded image

### Fields for abacus registration

- `event_id`: string, required [as URL parameter]
- `teamName`: string, required
- `teamLeaderScholarID`: string, required
- `memberScholarIDs`: Array of string, required [__must be enough to meet minTeamSize requirement__]
- **all scholar IDs present in the submitted fields must have an account**

**Installation**

1. Clone the repo _Or_ Run `git pull origin master` if already cloned.
2. Run "npm install" in the command prompt to install all related dependencies.
3. Create a ".env" file inside the config directory as per ".env.example" file present there.
4. Run `npm run dev`.

####
