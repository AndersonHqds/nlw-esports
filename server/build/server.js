import express from "express";
const app = express();
app.get("/ads", (request, response) => {
    return response.json();
});
app.listen(3333);
