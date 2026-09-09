const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(
  __dirname,
  "..",
  "public",
  "games",
  "TixierMitaLabWeb",
);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function relativeSiteUrl(filePath, siteAbsoluteUrl) {
  const fileDirectory = path.dirname(filePath);
  const targetPath = path.join(
    siteRoot,
    ...siteAbsoluteUrl.slice(1).split("/"),
  );
  const relativePath = path.relative(fileDirectory, targetPath).replaceAll("\\", "/");

  return relativePath || ".";
}

function pointDirectoryLinksToIndex(filePath, html) {
  return html.replace(/\bhref="([^"]+)"/g, (match, url) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return match;

    const [, pathname = "", suffix = ""] = url.match(/^([^?#]*)([?#].*)?$/) || [];
    if (!pathname) return match;

    let decodedPathname;
    try {
      decodedPathname = decodeURI(pathname);
    } catch {
      return match;
    }

    const targetPath = path.resolve(path.dirname(filePath), decodedPathname);
    const isInsideSite =
      targetPath === siteRoot || targetPath.startsWith(`${siteRoot}${path.sep}`);
    const indexPath = path.join(targetPath, "index.html");

    if (
      !isInsideSite ||
      !fs.existsSync(targetPath) ||
      !fs.statSync(targetPath).isDirectory() ||
      !fs.existsSync(indexPath)
    ) {
      return match;
    }

    const separator = pathname.endsWith("/") ? "" : "/";
    return `href="${pathname}${separator}index.html${suffix}"`;
  });
}

if (!fs.existsSync(siteRoot)) {
  throw new Error(`TixierMitaLabWeb is missing: ${siteRoot}`);
}

for (const filePath of walk(siteRoot)) {
  const extension = path.extname(filePath).toLowerCase();
  if (!new Set([".html", ".css", ".js"]).has(extension)) continue;

  const original = fs.readFileSync(filePath, "utf8");
  let updated = original;

  if (extension === ".html") {
    updated = updated.replace(
      /\b(href|src)="\/(?!\/)([^"?#]*)([?#][^"]*)?"/g,
      (_match, attribute, pathname, suffix = "") =>
        `${attribute}="${relativeSiteUrl(filePath, `/${pathname}`)}${suffix}"`,
    );
    updated = pointDirectoryLinksToIndex(filePath, updated);
  }

  if (extension === ".css") {
    updated = updated.replace(
      /url\((['"])\/(?!\/)([^'"?#]*)([?#][^'"]*)?\1\)/g,
      (_match, quote, pathname, suffix = "") =>
        `url(${quote}${relativeSiteUrl(filePath, `/${pathname}`)}${suffix}${quote})`,
    );
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}
