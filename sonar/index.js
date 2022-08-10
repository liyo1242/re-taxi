const scanner = require('sonarqube-scanner')

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: '619287f8be3978c8d099b4f1bbc64773206a29a2',
    options: {
      'sonar.projectName': 're-taxi',
      'sonar.sources': 'src',
    },
  },
  () => process.exit()
)
