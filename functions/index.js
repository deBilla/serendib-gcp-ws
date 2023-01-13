const functions = require("firebase-functions");
const express = require('express');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const db = admin.firestore();

app.get('/hello', (req, res) => {
    return res.status(200).send('Hello');
});

// Create
app.post('/student', async (req, res) => {
    try {
        await db.collection('students').doc('/' + req.body.id + '/').create({
            name: req.body.name,
            age: req.body.age
        })

        return res.status(200).send();
    } catch (error) {
        console.error(error);

        return res.status(500).send(error);
    }
});

// Get one
app.get('/student/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        const product = await document.get();
        const response = product.data();

        return res.status(200).send(response);
    } catch (error) {
        console.error(error);

        return res.status(500).send(error);
    }
});

// Get all
app.get('/student', async (req, res) => {
    try {
        const ref = db.collection('students');
        let response = [];

        await ref.get().then(snapshot => {
            let docs = snapshot.docs;

            for (let doc of docs) {
                const student = {
                    id: doc.id,
                    name: doc.data().name,
                    age: doc.data().age
                }

                response.push(student);
            }
        });

        return res.status(200).send(response);
    } catch (error) {
        console.error(error);

        return res.status(500).send(error);
    }
});

// Update
app.put('/student/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        await document.update({
            name: req.body.name,
            age: req.body.age
        });

        return res.status(200).send();
    } catch (error) {
        console.error(error);

        return res.status(500).send(error);
    }
});

// Delete
app.delete('/student/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        await document.delete();

        return res.status(200).send();
    } catch (error) {
        console.error(error);

        return res.status(500).send(error);
    }
});

exports.helloWorld = functions.https.onRequest(app);