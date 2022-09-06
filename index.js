if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw-file.js")
      .then(() => console.log(`service worker registered successful`))
      .catch((err) => console.log(`serive worker registration failed` + err));
  });
}
