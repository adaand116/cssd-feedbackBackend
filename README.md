# Certifieringsuppgift Del 2: Feedback Backend (RESTApp)

Lösningsförslag på del 2, en backend (RESTApp) för feedback WebAppen som gör det möjligt att skapa nya feedback inlägg på sidan där modulen finns.
Konfiguration för att välja en ansvarig för nya feedback poster som får mail vid en ny post.
Exponerar två endpoints: `/getPosts` och `/addPost`

## /getPosts

`/rest-api/feedbackBackend/getPosts`

| Parameter | Description          | Type   | Required |
| --------- | -------------------- | ------ | -------- |
| pageId    | Page node identifier | string | Yes      |

## /addPost

`/rest-api/feedbackBackend/addPost`

| Parameter | Description                    | Type   | Required |
| --------- | ------------------------------ | ------ | -------- |
| pageId    | Page node identifier           | string | Yes      |
| content   | Feedback content in plain text | string | Yes      |

At the time of writing this README this RESTApp can be tested at [edu-dev10.sitevision-cloud.se](https://edu-dev10.sitevision-cloud.se)

## Installation and running

- `npm install` installs required packages and dependencies
- `npm run setup-dev-properties` creates .dev-properties.json
- `npm run create-addon` creates an addon with the name configured in the setup task
- `npm run dev` watches files for changes and runs `build force-deploy` on save
