const express = require('express')
const router = express.Router()
const ytdl = require('ytdl-core')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');
const path = require('path')

router.get('/music/', async (req, res) => {
    const ytURL = req.query.url
    if (!ytURL) return res.status(400).send({
        error: "Please enter a valid YouTube URL"
    })
    if (!ytdl.validateURL(ytURL)) return res.status(400).send({
        error: "Unable to validate YouTube URL"
    })
    const videoID = ytdl.getURLVideoID(ytURL)

    const download = ytdl(ytURL, {
        quality: 'highestaudio'
    })
    const musicSavePath = `${path.join(__dirname, '../../public/music')}\\${videoID}.mp3`
    console.log(musicSavePath)
    ffmpeg(download)
        .audioBitrate(320)
        .save(musicSavePath)
        .on('progress', p => {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            res.download(musicSavePath, `${videoID}.mp3`)
        });


})







module.exports = router