@for /f %%i in ('git rev-parse @~') do @set COMMIT_ID=%%i
@echo %COMMIT_ID%

@set lastcommitcode=export const lastcommit = '%COMMIT_ID%';

@echo %lastcommitcode% > lastcommit.js

