const ws = require('ws')

const wss = new ws.Server({
    port: 5000,
}, () => console.log('server start on 5000'))

let queue = []
let games = []

wss.on('connection', function connection(ws) {
    ws.id = Date.now()
    console.log(`подключился человк(id: ${ws.id})`)
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'queue':
                if (queue.length === 0) {
                    queue.push({id:ws.id, field: message.field, move: message.move})
                }
                else {
                    let pair = [queue[0].id, ws.id]
                    games.push(pair)

                    send(queue[0].id, {field: message.field, move: queue[0].move})
                    send(ws.id, {field: queue[0].field, move: queue[0].move === 'first' ? 'second' : 'first'})

                    queue = []
                }
                break
            case 'move':
                let opponent = findOpponentId(ws.id)
                send(opponent, message.move)
                break
        }
    })

    ws.on('close',  () => {
        if (queue[0].id === ws.id) queue = []
        let opponent = findOpponentId(ws.id)
        send(opponent, 'Leave')
    })
})

const send = (id, e) => {
    wss.clients.forEach(client => {
        if (client.id === id) {
            client.send(JSON.stringify(e))
        }
    })
}

const findOpponentId = (id) => {
    for (let game of games) {
        if (game[0] === id) {
            return game[1]
        }
        if (game[1] === id) {
            return game[0]
        }
    }
}