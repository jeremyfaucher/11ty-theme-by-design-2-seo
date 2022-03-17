const { DateTime } = require("luxon");
// Import Nunjucks   
//const Nunjucks = require("nunjucks");
// excerpt of my .eleventy.js config file
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  // e.g. Use syntax highlighters in njk and md Eleventy templates (not liquid)
  templateFormats: ["html", "md"],
  //Pass through files
	eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/.well-known');
  eleventyConfig.addPassthroughCopy('./robots.txt');

  //Date Clean up
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  //Latests Summary Limit
  eleventyConfig.addFilter("limit_latest", function (arr, limit) {
    return arr.slice(0, limit);
  });
  //Post Summary Limit
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(1, limit);
  });
  // remove snippet from build
  eleventyConfig.setBrowserSyncConfig({
    snippet: false,
  });
// minify css in build
eleventyConfig.addFilter("cssmin", function(code) {
  return new CleanCSS({}).minify(code).styles;
});
// minify js on build
eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
  code,
  callback
  ) {
  try {
    const minified = await minify(code);
    callback(null, minified.code);
  } catch (err) {
    console.error("Terser error: ", err);
    // Fail gracefully.
    callback(null, code);
  }
});

//https://stackoverflow.com/questions/32138820/remove-div-tags-and-replace-some-of-them-by-br-tag
// excerpt filter
eleventyConfig.addFilter("excerpt", (post) => {
  let text = post;
  let result = text.replace(/<figure>.*<\/figure>/s, "");
//return result;
  let content = result.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 184));
});

  // Return your Object options:
  return {
    dir: {
      input: "src",
      output: "_site",
    }
  }
}; 
