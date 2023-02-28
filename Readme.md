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

- Post `/api/user/signup` register/signup user
- Post `/api/user/login` login user
- Get `/api/user/logout` logout user

### Route for Abacus Events

- Get `/api/abacus/` get all abacus events
- Post `/api/abacus/register/:event_id` register for event
- Post `/api/abacus/create` create event
- Post `/api/abacus/update` update event

### Route for Enigma Events

- Get `/api/enigma` get details on all enigmas
- Post `/api/enigma` create enigma
- Patch `/api/enigma/:enigma_id` update enigma
- Delete `/api/enigma/:enigma_id` delete enigma

**Installation**

1. Clone the repo _Or_ Run `git pull origin master` if already cloned.
2. Run "npm install" in the command prompt to install all related dependencies.
3. Create a ".env" file inside the config directory as per ".env.example" file present there.
4. Run `npm run dev`.

####
