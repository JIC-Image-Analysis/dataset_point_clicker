# Dataset point clicker

Tool to allow clicking on points in an image dataset and recording the results as an overlay on that dataset.

## DataSet serving infrastructure

1. The dataset should be served using [dserve](https://github.com/JIC-CSB/dserve).

2. Before clicking one needs to create an overlay named quadrilateral_points

```
curl -X PUT http://localhost:5000/overlays/quadrilateral_points
```

## Requirements for this project

```
npm install -g typescript
npm install --save-dev @types/jquery
npm install http-server -g
```

## Starting the point picker

```
http-server -p 8000 --cors
```
