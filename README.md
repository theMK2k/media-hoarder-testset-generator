# Media Hoarder Testset Generator

Generate a testset of 9000+ 0-byte .mkv movie files for media hoarder.

## How it works

This tool reads all IMDB entries of the following lists:

- Feature Film Top 10000 (Part 1) <https://www.imdb.com/list/ls063676189>
- Feature Film Top 10000 (Part 2) <https://www.imdb.com/list/ls063676660>

It then generates 0-byte files in the `./generated` directory with the follwing filename: 

```text
%MOVIE TITLE% (%YEAR%) [%IMDB ID%].mkv
```

## Usage

### Install Node.js

Visit <https://nodejs.org> and download/install it for your OS.

### Run

```bash
npm start
```
