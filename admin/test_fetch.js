const url = "https://firestore.googleapis.com/v1/projects/hackweek-8f195/databases/(default)/documents";

fetch(url)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
