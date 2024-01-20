import { NextResponse } from "next/server";
import cheerio from "cheerio";
export const GET = async (request) => {
  const url = request.nextUrl.searchParams.get("url");

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use cheerio to parse the HTML on the server-side
    const $ = cheerio.load(html);

    // Extract Open Graph meta tags
    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");

    // Prepare response data
    const metaData = {
      title: ogTitle || "",
      image: ogImage || "",
      description: ogDescription || "",
    };

    return NextResponse.json(metaData);
  } catch (error) {
    console.error(`Error fetching metadata for ${url}: ${error}`);
    return NextResponse.json({ status: 500, message: "Error" });
  }
};