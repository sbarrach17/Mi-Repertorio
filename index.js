const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.listen(3000, () => {
    console.log("¡Servidor encendido!");
});
app.use(cors());
app.use(express.json());

app.post("/canciones", (req, res) => {
    try {
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        canciones.push(cancion);
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
        res.json({ message: "Canción Agregada 🎶" });
    } catch (error) {
        next(error);
    }
});

app.get("/canciones", (req, res) => {
    try {
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        res.json(canciones);
    } catch (error) {
        next(error);
    }
});

app.delete("/canciones/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        const index = canciones.findIndex((p) => p.id == id);
        if (index !== -1) {
            canciones.splice(index, 1);
            fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
            res.send("Canción eliminada 📛");
        } else {
            res.status(404).send("Canción no encontrada");
        }
    } catch (error) {
        next(error);
    }
});

app.put("/canciones/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        const index = canciones.findIndex((p) => p.id == id);
        if (index !== -1) {
            canciones[index] = cancion;
            fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
            res.send("Canción editada 📝");
        } else {
            res.status(404).send("Canción no encontrada");
        }
    } catch (error) {
        next(error);
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
