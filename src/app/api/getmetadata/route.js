import { NextResponse } from "next/server";
import { Parser } from "htmlparser2";
export const GET = async (request) => {
  const url = request.nextUrl.searchParams.get("url");

  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new Parser(
      {
        onopentag(name, attribs) {
          if (name === "meta" && attribs.property) {
            // Extract Open Graph meta tags
            if (attribs.property === "og:title") {
              metaData.title = attribs.content;
            } else if (attribs.property === "og:image") {
              metaData.image = attribs.content;
            } else if (attribs.property === "og:description") {
              metaData.description = attribs.content;
            }
          }
        },
      },
      { decodeEntities: true }
    );

    // Initialize an object to store the extracted data
    const metaData = {};

    parser.write(html);
    parser.end();

    // Prepare response data
    return NextResponse.json(metaData);
  } catch (error) {
    console.error(`Error fetching metadata for ${url}: ${error}`);
    return NextResponse.json({ status: 500, message: "Error" });
  }
};