import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';

convict.addFormat(convictFormatWithValidator.email);
convict.addFormat(convictFormatWithValidator.url);

const config = convict({
    email: {
        smtp: {
            enabled: {
                doc: 'Whether this transport is enabled.',
                format: Boolean,
                default: true,
                env: 'SMTP_ENABLED',
            },
            host: {
                format: '*',
                default: 'smtp',
                env: 'SMTP_HOST',
            },
            port: {
                format: 'nat',
                default: '1025',
                env: 'SMTP_PORT',
            },
            auth: {
                user: {
                    format: '*',
                    default: '',
                    env: 'SMTP_USER',
                },
                pass: {
                    format: '*',
                    default: '',
                    env: 'SMTP_PASS',
                },
            },
            tls: {
                secure: {
                    format: Boolean,
                    default: false,
                    env: 'SMTP_SECURE',
                },
                ignore: {
                    format: Boolean,
                    default: false,
                    env: 'SMTP_IGNORE_TLS',
                },
                require: {
                    format: Boolean,
                    default: false,
                    env: 'SMTP_REQUIRE_TLS',
                },
            },
            pool: {
                format: Boolean,
                default: false,
                env: 'SMTP_POOL',
            },
        },
        local: {
            enabled: {
                doc: 'Whether this transport is enabled.',
                format: Boolean,
                default: false,
                env: 'LOCAL_SMTP_ENABLED',
            },
            host: {
                format: '*',
                default: 'smtp',
                env: 'LOCAL_SMTP_HOST',
            },
            port: {
                format: 'nat',
                default: '1025',
                env: 'LOCAL_SMTP_PORT',
            },
            auth: {
                user: {
                    format: '*',
                    default: '',
                    env: 'LOCAL_SMTP_USER',
                },
                pass: {
                    format: '*',
                    default: '',
                    env: 'LOCAL_SMTP_PASS',
                },
            },
            tls: {
                secure: {
                    format: Boolean,
                    default: false,
                    env: 'LOCAL_SMTP_SECURE',
                },
                ignore: {
                    format: Boolean,
                    default: false,
                    env: 'LOCAL_SMTP_IGNORE_TLS',
                },
                require: {
                    format: Boolean,
                    default: false,
                    env: 'LOCAL_SMTP_REQUIRE_TLS',
                },
            },
            pool: {
                format: Boolean,
                default: false,
                env: 'LOCAL_SMTP_POOL',
            },
        },
        dkim: {
            domainName: {
                doc: 'domain name to use in the signature',
                format: String,
                default: 'care-app.de',
                env: 'DKIM_DOMAIN_NAME',
            },
            keySelector: {
                doc: 'the DKIM key selector',
                format: String,
                default: 's202001',
                env: 'DKIM_DOMAIN_NAME',
            },
            privateKey: {
                doc: 'the private key for the selector in PEM format',
                format: String,
                default: '',
                env: 'DKIM_PRIVATE_KEY',
            },
        },
        bypass: {
            doc: 'Regular Expression for addresses that should be passed to real smtp even if local is enabled',
            format: String,
            default: '.*@appmotion.de|.*@vonfoorn.com',
            env: 'SMTP_BYPASS',
        },
        logger: {
            format: Boolean,
            default: true,
            env: 'EMAIL_LOGGER',
        },
        sender: {
            format: 'email',
            default: 'noreply@care-app.de',
            env: 'EMAIL_SENDER',
        },
        admin: {
            format: 'email',
            default: 'care-app@beiersdorf.com',
            env: 'EMAIL_ADMIN',
        },
    },
    knex: {
        client: {
            format: ['pg', 'mssql', 'mysql'],
            default: 'pg',
        },
        connection: {
            format: String,
            default: 'postgresql://flohmarkt:secret@postgres:5432/flohmarkt',
            env: 'POSTGRES_URI',
        },
        acquireConnectionTimeout: {
            doc: 'Timeout for knex when requesting connection from pool',
            format: Number,
            default: 10000,
            env: 'KNEX_ACQUIRE_TIMEOUT',
        },
        pool: {
            min: {
                doc: 'minimum size',
                format: Number,
                default: 0,
                env: 'POOL_MIN_SIZE',
            },
            max: {
                doc: 'maximum size',
                format: Number,
                default: 10,
                env: 'POOL_MAX_SIZE',
            },
            acquireTimeoutMillis: {
                doc: 'acquire promises are rejected after this many milliseconds if a resource cannot be acquired',
                format: Number,
                default: 30000,
                env: 'POOL_ACQUIRE_TIMEOUT',
            },
            createTimeoutMillis: {
                doc: 'create operations are cancelled after this many milliseconds if a resource cannot be acquired',
                format: Number,
                default: 30000,
                env: 'POOL_CREATE_TIMEOUT',
            },
            destroyTimeoutMillis: {
                doc: 'destroy operations are awaited for at most this many milliseconds new resources will be created after this timeout',
                format: Number,
                default: 5000,
                env: 'POOL_DESTROY_TIMEOUT',
            },
            idleTimeoutMillis: {
                doc: 'free resouces are destroyed after this many milliseconds',
                format: Number,
                default: 1000,
                env: 'POOL_IDLE_TIMEOUT',
            },
            reapIntervalMillis: {
                doc: 'how often to check for idle resources to destroy',
                format: Number,
                default: 1000,
                env: 'POOL_REAP_INTERVAL',
            },
            createRetryIntervalMillis: {
                doc: 'how long to idle after failed create before trying again',
                format: Number,
                default: 200,
                env: 'POOL_CREATE_RETRY_INTERVAL',
            },
            propagateCreateError: {
                doc: 'If true, when a create fails, the first pending acquire is rejected with the error.',
                format: Boolean,
                default: false,
                env: 'POOL_PROPAGATE_CREATE_ERROR',
            },
        },
        migrations: {
            tableName: {
                format: String,
                default: 'migrations',
            },
        },
        debug: {
            format: Boolean,
            default: false,
            env: 'DATABASE_DEBUG',
        },
    },
    jwt: {
        secret: {
            format: String,
            default: '1234567890123456789012345678901234567890',
            sensitive: true,
            env: 'JWT_SECRET',
        },
    },
    tokens: {
        identity: {
            expiresIn: {
                format: String,
                default: '1d',
                env: 'IDENTITY_TOKEN_EXPIRES_IN',
            },
            algorithm: {
                format: ['HS256', 'HS384', 'HS512'],
                default: 'HS512',
                env: 'IDENTITY_TOKEN_ALGORITHM',
            },
        },
        renewal: {
            length: {
                format: 'nat',
                default: 32,
                env: 'RENEWAL_TOKEN_LENGTH',
            },
            expiresIn: {
                format: String,
                default: '60 days',
                env: 'RENEWAL_TOKEN_EXPIRES_IN',
            },
            algorithm: {
                format: ['HS256', 'HS384', 'HS512'],
                default: 'HS512',
                env: 'RENEWAL_TOKEN_ALGORITHM',
            },
        },
    },
    bcrypt: {
        saltRounds: {
            format: 'nat',
            default: 12,
            env: 'BCRYPT_SALT_ROUNDS',
        },
    },
    server: {
        port: {
            doc: 'The port express listens',
            format: Number,
            default: 4300,
            env: 'PORT',
        },
    },
    redis: {
        healthCheckTimeout: {
            format: 'nat',
            default: 1000,
            env: 'REDIS_HEALTH_CHECK_TIMEOUT',
        },
        uri: {
            format: String,
            default: 'redis',
            env: 'REDIS_URI',
        },
        retry: {
            maxReconnectDelay: {
                format: 'nat',
                default: 1000 * 60,
            },
        },
    },
    environment: {
        nodeEnv: {
            format: ['development', 'production', 'test'],
            default: 'development',
            env: 'NODE_ENV',
        },
    },
});

config.validate({ allowed: 'strict' });

export default config.getProperties();
