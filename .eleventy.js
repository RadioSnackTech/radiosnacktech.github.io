module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"static": "."});

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    devServer: {
      host: "0.0.0.0"
    }
  };
};
