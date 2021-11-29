// Responsible for managing the "Scratch" canvas.
// Responsible for the drawing code, managing positions of sprites, what backdrops are being displayed, ETC.
// Kind of the main object.

class Canvas {
    private audioContext = new (window.AudioContext)()

    public CachedAudio: { [key: string]: AudioBufferSourceNode } = {} // Nothing, values added manually by the program.

    private InternalCachedAudio: { [key: string]: AudioBufferSourceNode } = {} // Lookup-Table for cached audio. Added to internally.

    public Sprites: Sprite[] = [] // Used for drawing

    private Canvas: any

    constructor (HTMLCanvas: HTMLCanvasElement) {
        this.Canvas = HTMLCanvas
    }

    public DrawingInterval = () => {
        for (let i = 0; i < this.Sprites.length;) {
            const SpriteObject = this.Sprites[i]
            if (SpriteObject.ready == true && SpriteObject.active == true) this.Canvas.drawImage(SpriteObject.image, SpriteObject.coords.x, SpriteObject.coords.y)
        }
    }

    public AddSpriteToSprites(sprite: Sprite): Canvas {
        this.Sprites.push(sprite)
        return this
    }

    public PlayAudio(nameOrUrl: string, type: "name" | "url", loop: boolean) {
        if (type == "url") {
            // Check if audio exists within the Internal Lookup-Table, if it does, play the audio,
            // if it doesn't, perform XHR on the url to play the audio and put it in the cache as well.
            if (nameOrUrl in this.InternalCachedAudio) {
                this.InternalCachedAudio[nameOrUrl].start(0)
            } else {
                var source = this.audioContext.createBufferSource()
                var request = new XMLHttpRequest()
                try {
                    request.open("GET", nameOrUrl, true)
                } catch {
                    console.error(`ERROR! Invaild Image URL '${nameOrUrl}'.`)
                }
                request.responseType = "arraybuffer"

                request.onload = () => {
                    var audioData = request.response

                    this.audioContext.decodeAudioData(audioData, (buffer) => {
                        source.buffer = buffer

                        source.connect(this.audioContext.destination)
                        source.loop = loop
                    })

                    source.start(0)
                }

                request.send()
            }
        } else if (type == "name") {
            if (nameOrUrl in this.CachedAudio) {
                try {
                    this.CachedAudio[nameOrUrl].start(0)
                } catch {
                        console.error(`ERROR! Invaild object for '${nameOrUrl}', have you appended the CachedAudio table correctly?`)
                }
            } else {
                console.error(`ERROR! Invaild name '${nameOrUrl}', have you appended the CachedAudio table?`)
            }
        }
    }
}

module.exports = { Canvas: Canvas }