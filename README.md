# gitlab-checkout

This is a simple script to checkout a branch from a GitLab server repository.

#### Sample Usage

```
  name: "GitLab Checkout",
  uses: "choreo-templates/gitlab-checkout@v0.6.0",
  with:
    token: "${{ env.APP_GITLAB_SERVER_TOKEN }}",
    serverUrl: "${{env.APP_GITLAB_SERVER_URL}}",
    userOrgName: "${{env.ORG_NAME}}",
    userRepoName: "${{env.APP_NAME}}",
    configRepoName: "config-repo",
    branch: "choreo-dev"
    commitUser: "choreo-bot",
    commitEmail: "choreo-bot@wso2.com"
```
