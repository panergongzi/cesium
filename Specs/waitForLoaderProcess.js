import loaderProcess from "./loaderProcess.js";
import pollToPromise from "./pollToPromise.js";

export default function waitForLoaderProcess(loader, scene) {
  let loaderFinished = false;
  loader.promise.finally(function () {
    loaderFinished = true;
  });
  return pollToPromise(function () {
    loaderProcess(loader, scene);
    return loaderFinished;
  }).then(function () {
    return loader.promise;
  });
}
