const express = require('express');
const session = require('express-session');
const path = require('node:path');
const crypto = require('node:crypto');
const { Pool } = require('pg');
const { Issuer, generators } = require('openid-client');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');

const pool = new Pool({
  connectionString: (process.env.DATABASE_URL || '').replace('sslmode=require', 'sslmode=no-verify')
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_email TEXT,
      user_name TEXT,
      discipline_key TEXT NOT NULL,
      discipline_name TEXT NOT NULL,
      level_key TEXT NOT NULL,
      level_label TEXT NOT NULL,
      level_summary TEXT,
      frequency INTEGER NOT NULL,
      answers JSONB NOT NULL,
      weeks JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id, created_at DESC);`);
}

let oidcClient = null;

async function initAuth() {
  const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
  oidcClient = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    response_types: ['code'],
    token_endpoint_auth_method: 'none'
  });
}

function redirectUriFor(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${proto}://${host}/callback`;
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { secure: 'auto', httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));

function requireAuthPage(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

function requireAuthApi(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: 'Nicht angemeldet.' });
}

app.get('/login', (req, res, next) => {
  try {
    if (!oidcClient) return res.status(503).send('Anmeldung wird gerade vorbereitet, bitte gleich noch einmal versuchen.');
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const state = generators.state();
    req.session.code_verifier = code_verifier;
    req.session.oauth_state = state;
    const redirect_uri = redirectUriFor(req);
    const url = oidcClient.authorizationUrl({
      scope: 'openid email profile',
      redirect_uri,
      code_challenge,
      code_challenge_method: 'S256',
      state
    });
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

app.get('/callback', async (req, res, next) => {
  try {
    if (!oidcClient) return res.status(503).send('Anmeldung wird gerade vorbereitet, bitte gleich noch einmal versuchen.');
    const redirect_uri = redirectUriFor(req);
    const params = oidcClient.callbackParams(req);
    const tokenSet = await oidcClient.callback(redirect_uri, params, {
      code_verifier: req.session.code_verifier,
      state: req.session.oauth_state
    });
    const userinfo = await oidcClient.userinfo(tokenSet.access_token);
    req.session.user = {
      sub: userinfo.sub,
      email: userinfo.email || '',
      name: userinfo.name || userinfo.preferred_username || userinfo.email || 'Nutzer'
    };
    req.session.id_token = tokenSet.id_token;
    delete req.session.code_verifier;
    delete req.session.oauth_state;
    res.redirect('/');
  } catch (err) {
    console.error('OIDC callback error', err);
    res.status(400).send('Anmeldung fehlgeschlagen. <a href="/login">Erneut versuchen</a>');
  }
});

app.get('/logout', (req, res) => {
  const idToken = req.session && req.session.id_token;
  req.session.destroy(() => {
    try {
      const endSessionUrl = oidcClient && oidcClient.issuer && oidcClient.issuer.metadata.end_session_endpoint;
      if (endSessionUrl) {
        const proto = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const postLogout = `${proto}://${host}/`;
        const u = new URL(endSessionUrl);
        if (idToken) u.searchParams.set('id_token_hint', idToken);
        u.searchParams.set('post_logout_redirect_uri', postLogout);
        return res.redirect(u.toString());
      }
    } catch (err) {
      console.error('Logout redirect error', err);
    }
    res.redirect('/');
  });
});

app.get('/', requireAuthPage, (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.get('/index.html', (req, res) => res.redirect('/'));

app.get('/api/me', requireAuthApi, (req, res) => {
  res.json({ email: req.session.user.email, name: req.session.user.name });
});

app.post('/api/results', requireAuthApi, async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.disciplineKey || !b.disciplineName || !b.levelKey || !b.weeks || !b.answers) {
      return res.status(400).json({ error: 'Unvollständige Daten.' });
    }
    const result = await pool.query(
      `INSERT INTO results (user_id, user_email, user_name, discipline_key, discipline_name, level_key, level_label, level_summary, frequency, answers, weeks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, created_at`,
      [
        req.session.user.sub,
        req.session.user.email,
        req.session.user.name,
        b.disciplineKey,
        b.disciplineName,
        String(b.levelKey),
        b.levelLabel || '',
        b.levelSummary || '',
        Number(b.frequency) || 3,
        JSON.stringify(b.answers),
        JSON.stringify(b.weeks)
      ]
    );
    res.json({ id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (err) {
    console.error('POST /api/results error', err);
    res.status(500).json({ error: 'Speichern fehlgeschlagen.' });
  }
});

app.get('/api/results', requireAuthApi, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, discipline_key, discipline_name, level_label, frequency, created_at
       FROM results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [req.session.user.sub]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/results error', err);
    res.status(500).json({ error: 'Laden fehlgeschlagen.' });
  }
});

app.get('/api/results/:id', requireAuthApi, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, discipline_key, discipline_name, level_key, level_label, level_summary, frequency, answers, weeks, created_at
       FROM results WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.session.user.sub]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Nicht gefunden.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/results/:id error', err);
    res.status(500).json({ error: 'Laden fehlgeschlagen.' });
  }
});

app.delete('/api/results/:id', requireAuthApi, async (req, res) => {
  try {
    await pool.query(`DELETE FROM results WHERE id = $1 AND user_id = $2`, [req.params.id, req.session.user.sub]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/results/:id error', err);
    res.status(500).json({ error: 'Löschen fehlgeschlagen.' });
  }
});

app.use(express.static(ROOT, { index: false }));

async function initDbWithRetry(retries = 8, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await initDb();
      return;
    } catch (err) {
      console.error(`DB init attempt ${i + 1}/${retries} failed`, err.message);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  console.error('DB init gave up after retries — will keep retrying lazily on first query.');
}

async function initAuthWithRetry(retries = 8, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await initAuth();
      return;
    } catch (err) {
      console.error(`OIDC init attempt ${i + 1}/${retries} failed`, err.message);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  console.error('OIDC init gave up after retries — login will keep failing until next restart.');
}

async function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CalisthenicsCoach läuft auf Port ${PORT}`);
  });
  initDbWithRetry();
  initAuthWithRetry();
}

start();
