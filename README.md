# Dataset point clicker

Tool to allow clicking on points in an image dataset and recording the results as an overlay on that dataset.

## DataSet serving infrastructure

The dataset should be served using [dserve](https://github.com/JIC-CSB/dserve).


## Requirements for this project

```
npm install -g typescript
npm install --save-dev @types/jquery
npm install http-server -g
```

## Compiling the TypeScript code to JavaScript

```
export DSERVE_HOSTNAME=cigana
make
```

## Starting the point picker

```
bash run_docker.sh
```

Point a web browser at the URL: http://localhost:8080/
