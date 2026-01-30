import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// App Config

const app = express()
const PORT = process.env.PORT || 4000

// middlewares

app.use(express.json())
app.use(cors())

// api endpoints

app.get('/', (req, res) => {
    res.send("api working")
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
