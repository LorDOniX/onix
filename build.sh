#!/bin/bash
echo New version build
./bundler.js clear
./bundler.js dev
./bundler.js doc
./bundler.js dist
