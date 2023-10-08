export default class Controls
{
    constructor()
    {
        this.keyMap = {}

        window.addEventListener('keydown', (_event) =>
        {
            this.keyMap[_event.code] = _event.type === 'keydown'
        })

        window.addEventListener('keyup', (_event) =>
        {
            this.keyMap[_event.code] = _event.type === 'keydown'
        })
    }

    destroy()
    {
        window.removeEventListener('keydown')
        window.removeEventListener('keyup')
    }
}