import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import router from './routes'
import generateConfig from './config'

process.on('unhandledRejection', console.error)

const config = generateConfig()

const app = initApp(config, null)

app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}!`)
})

export default function initApp(config, depedencies) {
    const app = express()

    app.set('config', config)

    app.use(morgan('dev'))

    app.use(cors({ origin: true }))

    app.use(bodyParser.urlencoded({ limit: '12mb',
        extended: false,
        parameterLimit: 1000000 }))

    app.use(bodyParser.json({ limit: '12mb' }))

    app.use(router)

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            statusCode: err.status || 500,
            error: err.name,
            message: err.message,
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            statusCode: 404,
            error: 'Not Found',
            message: 'No such route',
        })
    })

    return app;
}