// import express from 'express';
// import path from 'path';

const express = require('express');
const path = require('path');
const app = express();
const trackSubs = [];

const PORT = 5069;

let connection;
let status = 200;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/tests', express.static(path.resolve(__dirname, './scenarios')));
app.use('/', express.static(path.resolve(__dirname, '../dist')));

app.get('/track', (req, res) => {
    res.sendStatus(status);
    trackSubs.forEach(s => s(req.query, {status}));
});

export function returnStatus(statusCode) {
    status = statusCode;
}

export const URL = `localhost:${PORT}`;

export function subToTracks(cb) {
    trackSubs.push(cb);
}

export function start() {
    return new Promise((resolve, reject) => {
        connection = app.listen(PORT, err => {
            if (err) {
                reject(err);
                return console.log('Error starting tests server', err);
            }
            resolve(connection);
        });
    });
}

export function stop() {
    return new Promise((resolve) => connection.close(resolve));
}
