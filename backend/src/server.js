import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { connectToDatabase } from './config/database.js';
import { getRedis } from './config/redis.js';
import authRouter from './routes/auth.routes.js';
import teacherRouter from './routes/teacher.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

app.locals.io = io;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/teacher', teacherRouter);

io.on('connection', (socket) => {
  socket.on('join-session', (sessionId) => {
    socket.join(`session:${sessionId}`);
  });
});

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  await connectToDatabase();
  await getRedis();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});



