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
    const publicPath = `${path.join(__dirname, '../../public')}`
    if (!fs.existsSync(publicPath)){
        fs.mkdirSync(publicPath);
    }
    const musicSavePath = `${path.join(__dirname, '../../public/music')}`
    if (!fs.existsSync(musicSavePath)){
        fs.mkdirSync(musicSavePath);
    }
    const musicSavePathWithSongName = `${musicSavePath}\\${videoID}.mp3`
    ffmpeg(download)
        .audioBitrate(320)
        .save(musicSavePathWithSongName)
        .on('progress', p => {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            res.download(musicSavePathWithSongName, `${videoID}.mp3`)
        });


})







module.exports = router