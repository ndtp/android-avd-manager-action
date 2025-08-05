# Distribution

1. `npm install`
2. `npm run bundle`
3. `npm test`
4. Create a release branch, for example `release/v1` 'git checkout -b
   release/v1'
5. `npm run all`
6. Optional, Test your action locally
   ```
   # npx @github/local action <action-yaml-path> <entrypoint> <dotenv-file>
   npx @github/local-action . src/main.ts .env
   ```
7. Commit all changes
   ```
   git add .
   git commit -m "Release v1"
   ```
8. Push to remote
   ```
   git push -u origin releases/v1
   ```
