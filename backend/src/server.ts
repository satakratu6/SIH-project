import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { connectToDatabase } from './config/database';
import { getRedis } from './config/redis';
import authRouter from './routes/auth.routes';
import teacherRouter from './routes/teacher.routes';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Attach io to app locals for use in controllers/services
app.locals.io = io;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/teacher', teacherRouter);

// Socket events namespace for teacher dashboard
io.on('connection', (socket) => {
  socket.on('join-session', (sessionId: string) => {
    socket.join(`session:${sessionId}`);
  });
});

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  await connectToDatabase();
  await getRedis();

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});

declare module 'express-serve-static-core' {
  interface Application {
    locals: {
      io: SocketIOServer;
      [key: string]: unknown;
    };
  }
}



