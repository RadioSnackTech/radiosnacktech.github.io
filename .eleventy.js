const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");

const TZ = "America/Toronto";

async function imageShortcode(src, alt, sizes = "100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/images/",
    urlPath: "/images/"
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes, {
    htmlOptions: {
      imgAttributes: {
        width: false,
        height: false,
      }
    }
  });
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"static": "."});

  // Add responsive image shortcode
  eleventyConfig.addShortcode("image", imageShortcode);

  // Add markdown filter
  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  // Add a filter to get current date
  eleventyConfig.addFilter("currentDate", () => {
    return new Date().toISOString();
  });

  // Add a filter to format just the time
  eleventyConfig.addFilter("formatEventTime", (dateString) => {
    if (!dateString || !dateString.includes('T')) return null; // all-day event
    return DateTime.fromISO(dateString, { zone: TZ }).toFormat('h:mm a');
  });

  // Add a filter to format a date as "Wednesday, April 1"
  eleventyConfig.addFilter("formatCalDate", (dateString) => {
    return DateTime.fromISO(dateString, { zone: TZ }).toFormat('cccc, LLLL d');
  });

  // Find a matching local event URL by comparing start time to minute precision in UTC
  eleventyConfig.addFilter("findLocalEventUrl", (gcalStart, localEvents) => {
    if (!gcalStart || !gcalStart.includes('T')) return null;
    const gcalMinute = DateTime.fromISO(gcalStart).toUTC().startOf('minute').toISO();
    for (const event of Object.values(localEvents)) {
      if (DateTime.fromISO(event.date).toUTC().startOf('minute').toISO() === gcalMinute) {
        return event.url;
      }
    }
    return null;
  });

  // Add a filter to format event dates
  eleventyConfig.addFilter("formatEventDate", (dateString) => {
    return DateTime.fromISO(dateString, { zone: TZ }).toFormat('EEE, MMM d, yyyy, h:mm a');
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    devServer: {
      host: "0.0.0.0"
    }
  };
};
