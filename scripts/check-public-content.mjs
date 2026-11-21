// Internal-leak guard for the public docs site.
//
// Scans every user-facing file (en/, ru/ *.mdx and the site JSON files) and
// fails if any internal implementation detail leaks into the public pages.
// Public docs are for USERS: no internal endpoints, database terms, infra
// names, auth mechanisms, secrets, or developer/agent instructions.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Denylist of internal-only patterns (all matched case-insensitively).
const DENIED = [
	"/v1/",            // internal API paths
	"internal_events", // internal endpoint/secret naming
	"hmac",            // internal request signing
	"x-cevexa-",       // internal signature headers
	"redis",           // internal data stores
	"postgres",        // matches postgresql/postgres
	"mongodb",         // matches mongo too
	"prisma",          // schema tooling
	"\\bent\\b",       // Ent ORM
	"pgbouncer",
	"cevexa_auth",     // internal cookie name
	"workflow_dispatch",
	"docker",
	"kubernetes",
	"k3s",
	"agents\\.md",     // agent instructions
	"\\bsql\\b",
	"bullmq",
	"\\bpgx\\b",
	"ghcr",
	"\\bjwt\\b",
	"discord:event",   // internal event/dedup key format
	"bot:standard",    // internal Redis key prefixes
	"bot:plus",
	"cache:user_",
	"core_api",        // internal env naming
	"auth_session",
	"discord_client",
	"api\\.cevexa\\.xyz", // internal hostnames
	"localhost",
	"127\\.0\\.0\\.1",
	"middleware",
];

const SCAN_FILES = ["docs.json", "en.json", "ru.json"];
const SCAN_DIRS = ["en", "ru"];

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		if (statSync(p).isDirectory()) {
			yield* walk(p);
		} else if (/\.(mdx|json)$/i.test(entry)) {
			yield p;
		}
	}
}

const patterns = DENIED.map((p) => new RegExp(p, "i"));
const errors = [];

for (const target of [...SCAN_FILES, ...SCAN_DIRS]) {
	let files;
	try {
		const st = statSync(target);
		files = st.isDirectory() ? [...walk(target)] : [target];
	} catch {
		continue; // missing file/dir — JSON validity is checked elsewhere
	}
	for (const file of files) {
		const text = readFileSync(file, "utf8");
		for (const re of patterns) {
			const m = text.match(re);
			if (m) {
				errors.push(`${file}: internal-only term "${m[0]}"`);
			}
		}
	}
}

if (errors.length) {
	console.error(`Public-content check FAILED (${errors.length} hit${errors.length === 1 ? "" : "s"}):`);
	for (const e of errors) console.error(`  ${e}`);
	console.error(
		"\nPublic docs are user-only. Move internal detail to Cevexa-Internal-Docs (private)."
	);
	process.exit(1);
}
console.log("Public-content check passed: no internal implementation terms in user-facing files.");
