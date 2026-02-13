const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"static": "."});

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

  // Add a filter to format event dates
  eleventyConfig.addFilter("formatEventDate", (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York'
    };
    return date.toLocaleDateString('en-US', options);
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
