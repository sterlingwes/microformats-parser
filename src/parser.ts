import { parse, DefaultTreeElement } from "parse5";

import { findChildren } from "./helpers/findChildren";
import { parseMicroformat } from "./microformats/parse";
import { isMicroformatRoot } from "./helpers/nodeMatchers";
import { ParsedDocument, ParserOptions, ParsingOptions } from "./types";
import { validateParsedHtml } from "./validator";
import { documentSetup } from "./helpers/documentSetup";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");

export const parser = (
  html: string,
  options: ParserOptions
): ParsedDocument => {
  const doc = parse(html) as DefaultTreeElement;
  validateParsedHtml(doc);

  const { idRefs, rels, relUrls, baseUrl, lang } = documentSetup(doc, options);

  const parsingOptions: ParsingOptions = {
    ...options,
    baseUrl,
    idRefs,
    inherited: { roots: [], lang },
  };

  return {
    items: findChildren(doc, isMicroformatRoot).map((mf) =>
      parseMicroformat(mf, parsingOptions)
    ),
    rels,
    "rel-urls": relUrls,
    debug: {
      package: `https://www.npmjs.com/package/${pkg.name}`,
      source: pkg.repository,
      version: pkg.version,
    },
  };
};
