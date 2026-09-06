# Distribution

1. `npm install`
1. `npm run bundle`
1. `npm test`
1. Create a release branch, for example `release/v1`
   `git checkout -b release/v1`
1. `npm run all`
1. Optional, Test your action locally

   ```shell
   # npx @github/local action <action-yaml-path> <entrypoint> <dotenv-file>
   npx @github/local-action . src/main.ts .env
   ```

1. Commit all changes

   ```shell
   git add .
   git commit -m "Release v1"
   ```

1. Push to remote

   ```shell
   git push -u origin releases/v1
   ```
