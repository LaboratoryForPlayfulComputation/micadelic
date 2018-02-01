messaging.receive("test", function () {
    video.seek(Math.randomRange(10, 400))
})
video.play()
