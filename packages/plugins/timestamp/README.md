

step1. build core types

```
cd ./src/core
yarn build
```

step2. link and build core types
```
cd ./packages/plugins/timestamp
yarn add link:../../../src/core
yarn build
```