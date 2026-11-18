// EN/RU parity check for the public docs site.
//
// Fails when the English and Russian trees diverge:
//  - the set of *.mdx files under en/ and ru/ must be identical (same relative paths)
//  - the "pages" listed in en.json and ru.json navigation must mirror each
//    other (same order, en/<x> <-> ru/<x>)
//  - every page referenced in navigation must exist as an .mdx file
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const errors = [];

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		if (statSync(p).isDirectory()) {
			yield* walk(p);
		} else if (entry.toLowerCase().endsWith(".mdx")) {
			yield p;
		}
	}
}

const list = (dir) =>
	[...walk(dir)].map((p) => relative(dir, p).replaceAll("\\", "/")).sort();

const enFiles = list("en");
const ruFiles = list("ru");

const onlyEn = enFiles.filter((f) => !ruFiles.includes(f));
const onlyRu = ruFiles.filter((f) => !enFiles.includes(f));
for (const f of onlyEn) errors.push(`en/${f} has no ru/ counterpart`);
for (const f of onlyRu) errors.push(`ru/${f} has no en/ counterpart`);

function navPages(jsonPath) {
	const doc = JSON.parse(readFileSync(jsonPath, "utf8"));
	const pages = [];
	for (const tab of doc?.tabs ?? doc?.navigation?.tabs ?? []) {
		for (const group of tab?.groups ?? []) {
			for (const page of group?.pages ?? []) pages.push(page);
		}
	}
	return pages;
}

const enPages = navPages("en.json");
const ruPages = navPages("ru.json");

const ruMirrorOfEn = enPages.map((p) => p.replace(/^en\//, "ru/"));
const enMirrorOfRu = ruPages.map((p) => p.replace(/^ru\//, "en/"));

if (JSON.stringify(ruMirrorOfEn) !== JSON.stringify(ruPages)) {
	errors.push(
		`navigation mismatch: en.json pages ${JSON.stringify(enPages)} ` +
			`do not mirror ru.json pages ${JSON.stringify(ruPages)}`
	);
}
if (JSON.stringify(enMirrorOfRu) !== JSON.stringify(enPages)) {
	errors.push(
		`navigation mismatch: ru.json pages ${JSON.stringify(ruPages)} ` +
			`do not mirror en.json pages ${JSON.stringify(enPages)}`
	);
}

const fileSet = new Set([...enFiles.map((f) => `en/${f}`), ...ruFiles.map((f) => `ru/${f}`)]);
for (const page of [...enPages, ...ruPages]) {
	if (!fileSet.has(`${page}.mdx`)) {
		errors.push(`navigation references missing page "${page}"`);
	}
}

if (errors.length) {
	console.error(`Locale parity check FAILED (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
	for (const e of errors) console.error(`  ${e}`);
	process.exit(1);
}
console.log(
	`Locale parity passed: ${enFiles.length} mirrored pages in en/ and ru/, navigation in sync.`
);
