const { createServer } = require('http')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req:any, res:any) => {
    handle(req, res)
  }).listen(3000)
})