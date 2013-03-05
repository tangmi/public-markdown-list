# Michael's premiere Markdown rendering service

This is a quick and simple web service that is meant to render Markdown files publicly available online (i.e. your Dropbox public folder) so you can send them to your nonbeliever friends who don't already have a Markdown viewer.

### Let's render us some files

#### Input Markdown resource url here:
<input id="input" type="text">

#### Get rendered link:
<input id="output" type="text" onclick="this.focus();this.select();">

<style class="I'm so sorry, CSS gods.">
#input, #output {
	width: 69%;
	padding: 1em;
	margin: 1em 0;
	display: block;
}
</style>

### Notes

This service uses [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown), though it ignores languages specified in fenced code blocks (```` ``` ````) and just makes an automatic guess for syntax highlighting. Though, if possible, it is better practice to specify the language in case you want to use your Markdown on GitHub.