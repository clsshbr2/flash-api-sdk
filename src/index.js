// src/index.js
import { FlashApi } from './client/FlashApi.js';
import { FlashApiError } from './errors/FlashApiError.js';
import { AuthenticationError } from './errors/AuthenticationError.js';
import { ValidationError } from './errors/ValidationError.js';
import { RateLimitError } from './errors/RateLimitError.js';
import { WebSocketError } from './errors/WebSocketError.js';
import { NotFoundError } from './errors/NotFoundError.js';
import { TimeoutError } from './errors/TimeoutError.js';
import { InternalServerError } from './errors/InternalServerError.js';

export {
    FlashApi,
    FlashApiError,
    AuthenticationError,
    ValidationError,
    RateLimitError,
    WebSocketError,
    NotFoundError,
    TimeoutError,
    InternalServerError,
};

export default FlashApi;