# CSS_CMS
A headless CMS for CSS Website and App.

## MASTER BRANCH

`Don't Mess With Master`

### Routes 

- `/api/admin/` Routes

### Route for Admin 

- Post `/api/admin/register` register
- Post `/api/admin/login` login
- Get  `/api/admin/logout` logout

### Route for Members 

- Post `/api/admin/member/new` add member
- Put `/api/admin/member/:id` updateMemberdeleteMember
- delete `/api/admin/member/:id` deleteMember
- Get  `/api/admin/members/:batch` all members of the batch

### Route for events 

- Get `/api/admin/events` all events
- Post `/api/admin/event/new` create event
- Get  `/api/admin/event/:id` get event details
- Put  `/api/admin/event/:id` update event details
- Delete  `/api/admin/event/:id` delete event details


**Installation**

1. Clone the repo *Or* Run `git pull origin master` if already cloned.
2. Run "npm install" in the command prompt to install all related dependencies.
3. Create a ".env" file inside the config directory as per ".env.example" file present there.
4. Run `npm run dev`.


#### 
