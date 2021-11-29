class Sprite {

    public image

    public active: boolean = false

    public ready: boolean = false

    public coords: { x: number, y: number }

    constructor (url: string, x: number, y: number) {
        this.coords = { x: x, y: y }

        this.image = new HTMLImageElement()
        this.image.src = url
        this.image.onload = () => {
            this.ready = true
        }
    }

}